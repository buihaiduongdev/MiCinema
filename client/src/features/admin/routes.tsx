/**
 * adminRoutes.ts - Route config cho Admin pages
 *
 * Thêm vào main router config của ứng dụng
 */

import { DashboardPage } from './statistics/pages';
import { UsersPage } from './users/pages';
import { MemberRankingPage } from './loyalty/pages';
import ManageBookingsPage from './bookings/pages/ManageBookingsPage';

export const adminRoutes = [
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
        name: 'Dashboard',
        icon: 'BarChart3',
      },
      {
        path: 'users',
        element: <UsersPage />,
        name: 'Quản lý tài khoản',
        icon: 'Users',
      },
      {
        path: 'bookings',
        element: <ManageBookingsPage />,
        name: 'Quản lý đặt vé',
        icon: 'Ticket',
      },
      {
        path: 'loyalty/ranking',
        element: <MemberRankingPage />,
        name: 'Bảng xếp hạng',
        icon: 'Trophy',
      },
    ],
  },
];
