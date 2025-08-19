const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.vercel.app/api' 
    : '/api'
};

export default config;