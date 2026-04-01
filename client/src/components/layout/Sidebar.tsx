import { NavLink, useLocation } from 'react-router-dom';
import { adminRoutes } from '../../features/admin/routes';
import {
BarChart3,
  Users,
  Trophy,
  Film,
  Armchair,
  UtensilsCrossed,
  UserCircle,
  Ticket,
  LayoutDashboard,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const iconMap = {
BarChart3,
  Users,
  Trophy,
  Film,
  Armchair,
  UtensilsCrossed,
  UserCircle,
  Ticket,
};

const getIcon = (icon?: string) => {
  if (!icon) return LayoutDashboard;
  return iconMap[icon as keyof typeof iconMap] || LayoutDashboard;
};

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const adminRoot = adminRoutes.find((r) => r.path === 'admin');
  const items = adminRoot?.children ?? [];

  return (
    <aside className="bg-[#131b2e] h-screen w-64 fixed top-0 left-0 overflow-y-auto shadow-2xl flex flex-col py-6 z-40">
      <div className="px-6 sm:px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <span className="text-white font-extrabold">M</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-[#b3c5ff] tracking-tight">
            MiCinema
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#8c90a1]">
            Admin Portal
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 sm:px-5 space-y-1.5">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          const to = `/admin/${item.path}`;
          const isActive = location.pathname.startsWith(to);

          return (
            <NavLink
              key={item.path}
              to={to}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#b3c5ff] font-bold border-r-4 border-[#0066ff] bg-[#171f33]'
                  : 'text-[#c2c6d8] hover:text-[#dae2fd] hover:bg-[#171f33]'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 sm:px-5 mt-auto pt-6 space-y-1.5">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 text-[#c2c6d8] hover:text-[#dae2fd] hover:bg-[#171f33]"
        >
          <Settings size={18} />
          <span className="font-medium">Cài đặt</span>
        </button>
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 text-[#ffb4ac] hover:bg-[#93000a]/10"
        >
          <LogOut size={18} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
