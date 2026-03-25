/**
 * ProtectedRoute — Route Guard
 *
 * Props: { allowedRoles: string[], children: ReactNode }
 * Dùng: useAuth() kiểm tra isAuthenticated + role
 * - Chưa login → redirect /login
 * - Sai role → redirect /403 hoặc /
 */
