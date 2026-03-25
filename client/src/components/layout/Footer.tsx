import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">▶</span>
              </div>
              <span className="text-xl font-bold text-white">MiCinema</span>
            </div>
            <p className="text-gray-400 text-sm">
              Nền tảng xem phim trực tuyến hàng đầu tại Việt Nam
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Điều hướng</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/movies" className="hover:text-yellow-400 transition-colors">
                  Phim
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-yellow-400 transition-colors">
                  Phòng chiếu
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-yellow-400 transition-colors">
                  Lịch chiếu
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-yellow-400 transition-colors">
                  Ưu đãi
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-yellow-400 transition-colors">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Chính sách riêng tư
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-500" />
                <span>support@rophim.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-yellow-500 mt-1" />
                <span>123 Đường ABC, TP. HCM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8" />

        {/* Social & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <p className="text-gray-500 text-sm text-center md:text-right">
            © {currentYear} MiCinema. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
