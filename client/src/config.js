const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://czar-core-backend.vercel.app/api' 
    : '/api'
};

export default config;