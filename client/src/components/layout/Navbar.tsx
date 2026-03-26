import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'LỊCH CHIẾU', href: '/schedule' },
    { label: 'PHIM', href: '/movies' },
    { label: 'ƯU ĐÃI', href: '/offers' },
    { label: 'TIN TỨC PHIM', href: '/news' },
    { label: 'THÀNH VIÊN', href: '/member' },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 w-full z-50 border-b border-white/10 bg-slate-950 text-white shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">▶</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">MiCinema</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium hover:text-yellow-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              className="hidden lg:block h-11 w-60 xl:w-72 2xl:w-80 bg-white/25 text-white placeholder:text-white/80 px-4 rounded-lg text-sm border border-white/25 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />

            {/* Auth Buttons */}
            <div className="flex shrink-0 gap-2">
              <Link
                to="/login"
                className="flex h-10 items-center whitespace-nowrap px-3 lg:px-4 text-sm font-medium bg-white/10 border border-white/30 rounded hover:bg-white hover:text-slate-900 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center whitespace-nowrap px-3 lg:px-4 text-sm font-medium bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-all"
              >
                Đăng ký
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/15 rounded"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/15 bg-slate-900/90 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-3 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
