import axios from 'axios';

const rawBaseURL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';
const normalizedBaseURL = rawBaseURL.endsWith('/api')
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/+$/, '')}/api`;

const apiClient = axios.create({
  baseURL: normalizedBaseURL,
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
        window.location.href = '/login';
      }
    }

    const responseData = error.response?.data;
    const message =
      (typeof responseData === 'object' && responseData?.message) ||
      (typeof responseData === 'string' &&
      responseData.includes('Cannot') &&
      responseData.includes('/auth/')
        ? 'Sai endpoint API. Hãy kiểm tra VITE_API_URL, cần có /api ở cuối.'
        : '') ||
      'Lỗi hệ thống';

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
