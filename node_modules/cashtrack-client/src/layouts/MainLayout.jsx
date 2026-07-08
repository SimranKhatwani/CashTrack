import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChartPie, FaCoins, FaFileInvoiceDollar, FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: FaChartPie },
  { to: '/income', label: 'Income', icon: FaCoins },
  { to: '/expense', label: 'Expense', icon: FaFileInvoiceDollar },
  { to: '/profile', label: 'Profile', icon: FaUserCircle }
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-violet-100 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => setMobileOpen(true)} className="rounded-2xl border border-violet-100 bg-violet-50 p-3 text-violet-700"><FaBars /></button>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-violet-500">CashTrack</p>
            <h2 className="text-sm font-semibold">{user?.name || 'User'}</h2>
          </div>
        </div>
      </header>
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-violet-100 bg-white/90 p-6 shadow-sm lg:block">
          <div className="mb-8 flex items-center gap-3 border-b border-violet-100 pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm">
              <FaUserCircle className="text-3xl" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-violet-500">CashTrack</p>
              <h2 className="text-lg font-semibold">{user?.name || 'User'}</h2>
            </div>
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'}`}>
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
          <button onClick={handleLogout} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"> <FaSignOutAlt /> Logout</button>
        </aside>
        {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-violet-100 bg-white p-6 shadow-xl transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-8 flex items-center gap-3 border-b border-violet-100 pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm"><FaUserCircle className="text-3xl" /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-violet-500">CashTrack</p>
              <h2 className="text-lg font-semibold">{user?.name || 'User'}</h2>
            </div>
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'}`}>
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
          <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"> <FaSignOutAlt /> Logout</button>
        </aside>
        <main className="flex-1 p-4 md:p-6 lg:p-8"> <Outlet /></main>
      </div>
    </div>
  );
}
