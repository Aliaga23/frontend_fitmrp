import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendfitmrp-production.up.railway.app/api',  // Cambia esto a la URL de tu backend
});

export default api;
