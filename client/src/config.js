const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://czarcore-production.up.railway.app/api'
    : '/api'
};

export default config;