/**
 * AuthProvider — Context + useReducer
 *
 * Dùng useReducer vì state phức tạp:
 * - State: { user: User | null, token: string | null, isAuthenticated: boolean }
 * - Actions: LOGIN_SUCCESS, LOGOUT, UPDATE_PROFILE, TOKEN_REFRESH
 *
 * Khởi tạo: đọc token từ localStorage, decode JWT để lấy user
 * Export: AuthContext để useAuth() hook consume
 */
