import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '◉' },
  { label: 'Wallet', to: '/wallet', icon: '◌' },
  { label: 'Buy Data', to: '/buy-data', icon: '⬢' },
  { label: 'Buy Airtime', to: '/buy-airtime', icon: '◍' },
  { label: 'Electricity', to: '/electricity', icon: '⚡' },
  { label: 'Cable TV', to: '/cable-tv', icon: '📺' },
  { label: 'Transactions', to: '/transactions', icon: '↗' },
  { label: 'Profile', to: '/profile', icon: '◎' },
  { label: 'Admin', to: '/admin', icon: '▣' },
];

export default function AppShell({ children, title, subtitle, actions, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jalal-token');
    localStorage.removeItem('jalal-user');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(135deg,_#f8fffb_0%,_#f1f5f9_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full bg-emerald-950 px-5 py-6 text-emerald-50 lg:w-72 lg:min-h-screen lg:px-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">JALAL DATA HUB</p>
            <h2 className="mt-2 text-2xl font-semibold">Banking-grade VTU</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-800/80'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-xs">›</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-emerald-800/70 bg-emerald-900/60 p-4">
            <p className="text-sm font-semibold">Need help?</p>
            <p className="mt-2 text-sm text-emerald-200">Our support team is online 24/7 for your transfers and service requests.</p>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-medium text-emerald-600">Welcome back</p>
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <button
                onClick={handleLogout}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="rounded-[28px] border border-emerald-100 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Account</p>
                <p className="text-lg font-semibold text-slate-900">{user?.name || 'Aisha Ola'}</p>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {user?.role === 'admin' ? 'Admin access' : 'Verified user'}
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
