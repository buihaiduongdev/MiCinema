import { Outlet } from 'react-router-dom';
import { Avatar } from '@mantine/core';
import { HelpCircle, Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminLayout — Layout cho trang admin
 *
 * Cấu trúc: Sidebar bên trái + phần nội dung chính bên phải
 * Được bọc bởi <ProtectedRoute allowedRoles={['ADMIN', 'NHAN_VIEN']}> trong router
 */

export default function AdminLayout() {
  const { user } = useAuth();
  const displayName = user?.fullName || user?.email || 'Admin';

  return (
    <div className="min-h-screen w-full bg-[#0b1326] text-[#dae2fd] overflow-x-hidden">
      {/* Sidebar fixed, content shifted right */}
      <div className="flex min-h-screen">
        <Sidebar />
        {/* Content area shifted right */}
        <div className="flex-1 ml-64">
          {/* TopNavBar (sticky, not fixed) */}
          <header className="sticky top-0 z-40 h-16 bg-[#0b1326]/80 backdrop-blur-md shadow-sm">
            <div className="h-16 flex justify-between items-center px-6 md:px-8">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-full max-w-md group">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c90a1] group-focus-within:text-[#b3c5ff] transition-colors"
                    size={18}
                  />
                  <input
                    className="w-full bg-[#060e20] border-none rounded-full py-2 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066ff]/30 placeholder:text-[#8c90a1] transition-all"
                    placeholder="Tìm kiếm tài khoản, email..."
                    type="text"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-[#c2c6d8] hover:text-[#dae2fd] transition-colors"
                    type="button"
                  >
                    <Bell size={18} />
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-[#c2c6d8] hover:text-[#dae2fd] transition-colors"
                    type="button"
                  >
                    <HelpCircle size={18} />
                  </button>
                </div>

                <div className="h-8 w-[1px] bg-[#424656]/30 mx-1"></div>

                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-[#dae2fd]">
                      Admin Profile
                    </p>
                    <p className="text-[10px] text-[#8c90a1]">{displayName}</p>
                  </div>
                  <Avatar color="blue" radius="xl">
                    {displayName.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="py-8 min-w-0">
            <div className="max-w-screen-2xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
