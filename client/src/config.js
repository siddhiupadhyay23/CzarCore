const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://czarcore.onrender.com/api'
    : '/api'
};

export default config;