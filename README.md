# CzarCore - Modern Animated Authentication

A modern, animated authentication UI built with the MERN stack featuring smooth sliding transitions.

## ✨ Features

- **Animated Split-Screen Design**: Purple gradient panel slides smoothly between sides
- **Dual Mode Interface**: Toggle between Sign In and Sign Up with animated transitions
- **Google Login Integration**: Ready for OAuth implementation
- **JWT Authentication**: Secure token-based authentication
- **Form Validation**: Client and server-side validation
- **Responsive Design**: Mobile and tablet optimized
- **Modern UI**: Smooth hover effects and transitions

## 🚀 Quick Start

1. **Install Dependencies**:
```bash
npm install
cd client && npm install
```

2. **Start MongoDB**: Ensure MongoDB is running locally

3. **Run Application**:
```bash
# Development mode (both frontend and backend)
npm run dev

# Or run separately:
# Backend: npm start
# Frontend: cd client && npm run dev
```

4. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
CzarCore/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.js         # Main component with animations
│   │   ├── App.css        # Styling and animations
│   │   └── index.js       # React entry point
│   └── package.json
├── server/
│   └── server.js          # Express API server
├── package.json           # Root dependencies
└── README.md
```

## 🔧 API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User authentication

## 🎨 Animation Features

- **Sliding Panel**: Purple background smoothly slides between left and right
- **Form Transitions**: Forms fade in/out with staggered timing
- **Hover Effects**: Buttons and inputs have smooth hover animations
- **Mobile Responsive**: Animations adapt for mobile devices

## 🛡️ Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with 24-hour expiration
- Email validation
- Duplicate user prevention
- Input sanitization

## 📱 Responsive Design

- Desktop: Split-screen layout
- Tablet/Mobile: Stacked layout with adapted animations
- Touch-friendly interface elements