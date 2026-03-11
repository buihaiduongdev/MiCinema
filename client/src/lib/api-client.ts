/**
 * API Client — Axios hoặc fetch wrapper
 *
 * Config:
 * - baseURL: import.meta.env.VITE_API_URL || '/api'
 * - Interceptor request: tự thêm Authorization: Bearer <token>
 * - Interceptor response: xử lý 401 → logout + redirect /login
 *
 * Export: apiClient instance (get, post, put, delete)
 */
