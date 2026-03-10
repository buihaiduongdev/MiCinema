/**
 * RoleGuard — Conditional Render theo Role
 * 
 * Props: { roles: string[], children: ReactNode }
 * Dùng: useAuth() — chỉ render children nếu user có role phù hợp
 * Khác ProtectedRoute: không redirect, chỉ ẩn/hiện UI element
 */
