/**
 * App.tsx — Router Config
 *
 * Dùng: React Router v7 (BrowserRouter, Routes, Route)
 * - Wrap <AppLayout> cho tất cả routes
 * - Public routes: /, /login, /register, /movies, /movies/:id
 * - Protected routes: dùng <ProtectedRoute allowedRoles={[...]}>
 * - Admin routes: /admin/*
 *
 * Import pages từ features/* /pages/
 */
