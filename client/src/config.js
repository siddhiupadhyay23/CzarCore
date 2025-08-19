const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://czar-core-3qze.vercel.app/api' 
    : '/api'
};

export default config;