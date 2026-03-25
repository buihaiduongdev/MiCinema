import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import MoviesPage from './features/movies/pages/MoviesPage';
import MovieDetailPage from './features/movies/pages/MovieDetailPage';
import UiComponentsTestPage from './pages/UiComponentsTestPage';
// import BookingPage from './features/booking/pages/BookingPage';

function App() {
  return (
    <Routes>
      {/* App Layout Routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<div>Movies Page</div>} />
        <Route path="/schedule" element={<div>Schedule Page</div>} />
        <Route path="/offers" element={<div>Offers Page</div>} />
        <Route path="/news" element={<div>News Page</div>} />
        <Route path="/member" element={<div>Member Page</div>} />
        <Route path="/ui-components-test" element={<UiComponentsTestPage />} />
      </Route>

      {/* Auth Routes (without AppLayout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* Movies */}
      <Route path="/phim" element={<MoviesPage />} />
      <Route path="/phim/:slug" element={<MovieDetailPage />} />
    </Routes>
  );
}

export default App;
