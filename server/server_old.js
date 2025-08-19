const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/CzarCore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  googleId: { type: String },
  avatar: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  personalEmail: { type: String },
  tempPassword: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  dateOfJoining: { type: Date, required: true },
  availableLeaves: { type: Number, default: 20 },
  department: { type: String },
  position: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Employee = mongoose.model('Employee', employeeSchema);

// Simple Google OAuth redirect
app.get('/api/auth/google', (req, res) => {
  const googleAuthURL = `https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/api/auth/google/callback&scope=profile email&response_type=code`;
  res.redirect(googleAuthURL);
});

// Google OAuth callback
app.get('/api/auth/google/callback', async (req, res) => {

  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('http://localhost:3000/auth?error=no_code');
    }
    

    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:5000/api/auth/google/callback'
    });
    
    const tokenData = tokenResponse.data;

    
    // Get user info
    const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
    const userData = userResponse.data;

    
    // Find or create user
    let user = await User.findOne({ email: userData.email });
    
    if (!user) {
      user = new User({
        googleId: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.picture
      });
      await user.save();

    } else {

    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'czarcore_secret_key',
      { expiresIn: '24h' }
    );
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }))}`);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect('http://localhost:3000/auth?error=oauth_failed');
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role = 'employee', employeeId, dateOfBirth, dateOfJoining, availableLeaves } = req.body;
    
    if (role === 'employee') {
      if (!name || !email || !password || !employeeId || !dateOfBirth || !dateOfJoining) {
        return res.status(400).json({ message: 'All employee fields are required' });
      }
    } else if (role === 'admin') {
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required for admin' });
      }
    }
    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.googleId && !existingUser.password) {
        // User exists with Google, add password
        const hashedPassword = await bcrypt.hash(password, 12);
        existingUser.password = hashedPassword;
        existingUser.name = name;
        existingUser.updatedAt = new Date();
        await existingUser.save();
        
        const token = jwt.sign(
          { userId: existingUser._id, email: existingUser.email, role: existingUser.role }, 
          process.env.JWT_SECRET || 'czarcore_secret_key', 
          { expiresIn: '24h' }
        );
        
        return res.status(201).json({ 
          message: 'Password added to existing Google account',
          token, 
          user: { 
            id: existingUser._id, 
            name: existingUser.name, 
            email: existingUser.email,
            role: existingUser.role 
          } 
        });
      }
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    if (role === 'employee') {
      const user = new User({ 
        name, 
        email, 
        password: hashedPassword,
        role,
        updatedAt: new Date()
      });
      await user.save();
      
      const employee = new Employee({
        userId: user._id,
        employeeId,
        name,
        email,
        dateOfBirth,
        dateOfJoining,
        availableLeaves: availableLeaves || 20
      });
      await employee.save();
      
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role }, 
        process.env.JWT_SECRET || 'czarcore_secret_key', 
        { expiresIn: '24h' }
      );
      
      res.status(201).json({ 
        message: 'Employee registered successfully',
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          role: user.role 
        } 
      });
    } else if (role === 'admin') {
      // Generate work email and password for admin
      const workEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
      const workPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedWorkPassword = await bcrypt.hash(workPassword, 12);
      
      const user = new User({ 
        name, 
        email: workEmail,
        password: hashedWorkPassword,
        role: 'admin',
        personalEmail: email,
        tempPassword: workPassword,
        updatedAt: new Date()
      });
      await user.save();
      
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role }, 
        process.env.JWT_SECRET || 'czarcore_secret_key', 
        { expiresIn: '24h' }
      );
      
      res.status(201).json({ 
        message: 'Admin registration submitted successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        workCredentials: {
          workEmail: workEmail,
          workPassword: workPassword,
          personalEmail: email
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    const user = await User.findOne({ email });

    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (!user.password) {

      return res.status(400).json({ 
        message: 'This account was created with Google. Please use Google Sign In.',
        isGoogleUser: true 
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    user.updatedAt = new Date();
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'czarcore_secret_key', 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: 'Login successful',
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Forgot Password
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    
    // Simulate email (in real app, send actual email)
    console.log(`Password reset link: http://localhost:3000/reset-password?token=${resetToken}`);
    
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Reset Password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.updatedAt = new Date();
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const secret = process.env.JWT_SECRET || 'czarcore_secret_key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

// Middleware to check admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Employee routes
// Create employee profile (by employee)
app.post('/api/employee/profile', verifyToken, async (req, res) => {
  try {
    const { employeeId, dateOfBirth, dateOfJoining, department, position } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const existingEmployee = await Employee.findOne({ userId: req.user.userId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee profile already exists' });
    }
    
    const employee = new Employee({
      userId: req.user.userId,
      employeeId,
      name: user.name,
      email: user.email,
      dateOfBirth,
      dateOfJoining,
      department,
      position
    });
    
    await employee.save();
    res.status(201).json({ message: 'Employee profile created successfully', employee });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee profile (by employee)
app.get('/api/employee/profile', verifyToken, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee profile (by employee)
app.put('/api/employee/profile', verifyToken, async (req, res) => {
  try {
    const { dateOfBirth, department, position } = req.body;
    
    const employee = await Employee.findOneAndUpdate(
      { userId: req.user.userId },
      { dateOfBirth, department, position, updatedAt: new Date() },
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    
    res.json({ message: 'Profile updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
// Get all users (admin only)
app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('name email role personalEmail tempPassword createdAt updatedAt');
    const usersWithProfiles = await Promise.all(users.map(async (user) => {
      const profile = await Employee.findOne({ userId: user._id });
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        personalEmail: user.personalEmail,
        tempPassword: user.tempPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        hasProfile: !!profile,
        profile: profile || {
          employeeId: 'Not Set',
          department: 'Not Set',
          position: 'Not Set',
          availableLeaves: 'Not Set',
          dateOfBirth: null,
          dateOfJoining: null
        }
      };
    }));
    res.json(usersWithProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all employees (admin only) - keep for backward compatibility
app.get('/api/admin/employees', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId', 'name email role');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single employee (admin only)
app.get('/api/admin/employees/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'name email role');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee (admin only)
app.put('/api/admin/employees/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, dateOfBirth, dateOfJoining, availableLeaves, department, position } = req.body;
    
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, dateOfBirth, dateOfJoining, availableLeaves, department, position, updatedAt: new Date() },
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee (admin only)
app.delete('/api/admin/employees/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(5000, () => console.log('CzarCore server running on port 5000'));