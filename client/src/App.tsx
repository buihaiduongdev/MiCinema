import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import MoviesPage from './features/movies/pages/MoviesPage';
import MovieDetailPage from './features/movies/pages/MovieDetailPage';
// import BookingPage from './features/booking/pages/BookingPage';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Movies */}
      <Route path="/phim" element={<MoviesPage />} />
      <Route path="/phim/:slug" element={<MovieDetailPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/phim" replace />} />
    </Routes>
  );
}

export default App;
