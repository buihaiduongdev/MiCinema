/**
 * useLogin — Custom Hook cho đăng nhập
 * 
 * Dùng: useMutation từ TanStack Query
 * mutationFn: POST /api/auth/login → { user, token }
 * onSuccess: dispatch LOGIN_SUCCESS lên AuthProvider, redirect về /
 * onError: hiển thị notification lỗi
 */
