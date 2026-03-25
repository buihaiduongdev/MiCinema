import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-950">
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
