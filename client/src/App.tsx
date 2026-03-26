import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { BookingPage } from './features/booking/pages/BookingPage';
import { BookingConfirmPage } from './features/booking/pages/BookingConfirmPage';
import { BookingSuccessPage } from './features/booking/pages/BookingSuccessPage';
import { ManageRoomsPage } from './features/admin/rooms/pages/ManageRoomsPage';
import { BookingBridgePage } from './pages/BookingBridgePage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route
          path="/movies"
          element={
            <BookingBridgePage
              variant="movies"
              title="Phim đang chiếu"
              description="Danh sách phim và suất chiếu sẽ hiển thị tại đây khi đã kết nối hệ thống. Bạn có thể đặt vé ngay nếu rạp đã bật suất mặc định."
            />
          }
        />
        <Route
          path="/schedule"
          element={
            <BookingBridgePage
              variant="schedule"
              title="Lịch chiếu"
              description="Xem lịch theo ngày và chọn suất phù hợp — phần này sẽ được bổ sung đầy đủ khi tích hợp API lịch chiếu."
            />
          }
        />
        <Route path="/offers" element={<div>Offers Page</div>} />
        <Route path="/news" element={<div>News Page</div>} />
        <Route path="/member" element={<div>Member Page</div>} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/booking/:showtimeId" element={<BookingPage />} />
      <Route path="/booking/:bookingId/confirm" element={<BookingConfirmPage />} />
      <Route path="/booking/:bookingId/success" element={<BookingSuccessPage />} />
      <Route path="/admin/rooms" element={<ManageRoomsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
