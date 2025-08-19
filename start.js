const { spawn } = require('child_process');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Starting CzarCore Employee Management System...');

// Test MongoDB connection first
async function testConnection() {
  try {
    console.log('📡 Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/CzarCore', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log('✅ MongoDB connection successful!');
    mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    if (error.message.includes('IP that isn\'t whitelisted')) {
      console.log('🔒 MongoDB Atlas IP Whitelist Issue:');
      console.log('1. Go to MongoDB Atlas Dashboard');
      console.log('2. Navigate to Network Access');
      console.log('3. Add your current IP address or use 0.0.0.0/0 for all IPs (development only)');
      console.log('4. Wait 2-3 minutes for changes to take effect');
    } else {
      console.log('1. Make sure MongoDB is running locally or check your MongoDB Atlas connection');
      console.log('2. Verify your MONGODB_URI in the .env file');
      console.log('3. Check your network connection');
    }
    return false;
  }
}

async function startServer() {
  const connectionOk = await testConnection();
  
  if (!connectionOk) {
    console.log('\n⚠️  Starting server anyway - connection will be retried...');
  }
  
  console.log('\n🔧 Starting backend server...');
  const server = spawn('node', ['server/server.js'], { stdio: 'inherit' });
  
  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
  });
  
  server.on('close', (code) => {
    console.log(`🛑 Server process exited with code ${code}`);
  });
}

startServer();