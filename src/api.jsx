import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendfitmrp-production.up.railway.app/api', // Cambia según la URL de tu backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtén el token desde localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
