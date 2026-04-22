import axios from 'axios';

const api = axios.create({
  // Garante que usa a variável de ambiente ou o fallback correto para o browser
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; //
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se der 401, limpa tudo e volta para o login para evitar loops
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;