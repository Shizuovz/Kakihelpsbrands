export const API_BASE_URL = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://kaki-hoardings-api.onrender.com';
