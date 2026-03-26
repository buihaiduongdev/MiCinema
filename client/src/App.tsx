import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
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
      {/* App Layout Routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<div>Movies Page</div>} />
        <Route path="/schedule" element={<div>Schedule Page</div>} />
        <Route path="/offers" element={<div>Offers Page</div>} />
        <Route path="/news" element={<div>News Page</div>} />
        <Route path="/member" element={<div>Member Page</div>} />

        {/* Movies / Cinema */}
        <Route path="/phim" element={<MoviesPage />} />
        <Route path="/phim/:slug" element={<MovieDetailPage />} />
        <Route path="/dien-anh" element={<CinemaBrowsePage />} />

        {/* Persons */}
        <Route path="/dien-vien" element={<PersonsListPage />} />
        <Route path="/dao-dien" element={<PersonsListPage />} />
        <Route path="/dien-vien/:slug" element={<PersonDetailPage />} />
        <Route path="/dao-dien/:slug" element={<PersonDetailPage />} />
      </Route>

      {/* Auth Routes (without AppLayout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/phim" replace />} />
    </Routes>
  );
}

export default App;
