import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ['Employee Management', 'Team Collaboration', 'HR Solutions', 'Workforce Analytics'];

  useEffect(() => {
    const handleType = () => {
      const current = loopNum % words.length;
      const fullText = words[current];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Hero Text */}
          <div className="lg:w-1/2 text-white mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Modern{' '}
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                {text}
              </span>
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Streamline your workforce management with our comprehensive employee management system. 
              Track performance, manage leaves, and boost productivity with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/auth" 
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                Watch Demo
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Laptop Animation */}
          <div className="lg:w-1/2 relative flex justify-center">
            <div className="relative">
              {/* Laptop */}
              <div className="relative mx-auto max-w-lg">
                <div className="bg-gray-800 rounded-t-2xl p-4 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-black rounded-lg p-6 h-80 overflow-hidden">
                    {/* Dashboard Mockup */}
                    <div className="text-white h-full animate-pulse">
                      <div className="flex gap-4 mb-4">
                        <div className="bg-blue-600 px-3 py-1 rounded text-sm animate-bounce">Dashboard</div>
                        <div className="text-gray-400 px-3 py-1 rounded text-sm">Employees</div>
                        <div className="text-gray-400 px-3 py-1 rounded text-sm">Reports</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg animate-pulse">
                          <div className="text-2xl font-bold">248</div>
                          <div className="text-sm opacity-80">Total Employees</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg animate-pulse" style={{animationDelay: '0.5s'}}>
                          <div className="text-2xl font-bold">95%</div>
                          <div className="text-sm opacity-80">Attendance</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-4 rounded-lg animate-pulse" style={{animationDelay: '1s'}}>
                          <div className="text-2xl font-bold">12</div>
                          <div className="text-sm opacity-80">On Leave</div>
                        </div>
                      </div>
                      
                      <div className="flex items-end gap-2 h-20">
                        <div className="bg-blue-500 w-8 h-12 rounded-t animate-bounce"></div>
                        <div className="bg-blue-600 w-8 h-16 rounded-t animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="bg-blue-700 w-8 h-9 rounded-t animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        <div className="bg-blue-800 w-8 h-18 rounded-t animate-bounce" style={{animationDelay: '0.6s'}}></div>
                        <div className="bg-blue-500 w-8 h-14 rounded-t animate-bounce" style={{animationDelay: '0.8s'}}></div>
                        <div className="bg-blue-600 w-8 h-17 rounded-t animate-bounce" style={{animationDelay: '1s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 h-6 rounded-b-2xl shadow-lg"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-8 bg-white p-3 rounded-lg shadow-lg" style={{animation: 'float 3s ease-in-out infinite'}}>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
                  <span className="text-sm font-semibold text-blue-700">Team Management</span>
                </div>
              </div>
              
              <div className="absolute top-20 -right-8 bg-white p-3 rounded-lg shadow-lg" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '1s'}}>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
                  <span className="text-sm font-semibold text-blue-700">Analytics</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '2s'}}>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
                  <span className="text-sm font-semibold text-blue-700">Time Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-16">Why Choose CzarCore?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Fast & Efficient</h3>
              <p className="text-blue-600">Streamlined processes that save time and boost productivity across your organization.</p>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Secure & Reliable</h3>
              <p className="text-blue-600">Enterprise-grade security with role-based access control and data encryption.</p>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Mobile Ready</h3>
              <p className="text-blue-600">Access your dashboard anywhere, anytime with our responsive design.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">CzarCore</h3>
              <p className="text-gray-300 mb-4">Modern Employee Management System for the digital workplace.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link to="/auth" className="text-gray-300 hover:text-blue-400 transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-300">Employee Management</span></li>
                <li><span className="text-gray-300">Leave Management</span></li>
                <li><span className="text-gray-300">Payroll System</span></li>
                <li><span className="text-gray-300">Analytics Dashboard</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                  <span className="text-gray-300">contact@czarcore.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CzarCore. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;