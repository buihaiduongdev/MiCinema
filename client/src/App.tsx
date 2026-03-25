import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import MoviesPage from './features/movies/pages/MoviesPage';
import MovieDetailPage from './features/movies/pages/MovieDetailPage';
import CinemaBrowsePage from './features/movies/pages/CinemaBrowsePage';
import PersonsListPage from './features/persons/pages/PersonsListPage';
import PersonDetailPage from './features/persons/pages/PersonDetailPage';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Movies / Cinema */}
      <Route path="/phim" element={<MoviesPage />} />
      <Route path="/phim/:slug" element={<MovieDetailPage />} />
      <Route path="/dien-anh" element={<CinemaBrowsePage />} />

      {/* Persons */}
      <Route path="/dien-vien" element={<PersonsListPage />} />
      <Route path="/dao-dien" element={<PersonsListPage />} />
      <Route path="/dien-vien/:slug" element={<PersonDetailPage />} />
      <Route path="/dao-dien/:slug" element={<PersonDetailPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/phim" replace />} />
    </Routes>
  );
}

export default App;
