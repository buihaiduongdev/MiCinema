/**
 * main.tsx — Entry Point
 * 
 * Dùng: ReactDOM.createRoot
 * Wrap App với các Providers theo thứ tự:
 * 1. <QueryProvider> — TanStack Query
 * 2. <AuthProvider> — Auth context
 * 3. <ThemeProvider> — Dark/Light mode
 * 4. <MantineProvider> — Mantine UI
 * 5. <App />
 */
