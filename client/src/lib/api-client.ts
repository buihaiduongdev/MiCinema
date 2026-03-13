import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        //TODO: dùng react-router
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response?.data || { message: 'Lỗi hệ thống' });
  },
);

export default apiClient;
