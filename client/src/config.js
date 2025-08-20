const config = {
  API_URL: process.env.REACT_APP_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? 'https://czarcore.onrender.com' 
             : 'http://localhost:5002')
};

export default config;