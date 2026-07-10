import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';
import StatTile from '../components/StatTile';

const quickActions = [
  { label: 'Buy Data', to: '/buy-data' },
  { label: 'Airtime', to: '/buy-airtime' },
  { label: 'Electricity', to: '/electricity' },
  { label: 'Cable TV', to: '/cable-tv' },
];

const recentTransactions = [
  { label: 'Airtime top-up', time: '2 mins ago', amount: '₦5,000' },
  { label: 'Data bundle', time: '14 mins ago', amount: '₦2,000' },
  { label: 'Electricity bill', time: '1 hr ago', amount: '₦16,400' },
];

const notifications = ['KYC review completed', 'New wallet funding received', 'Airtime bundle delivered successfully'];

export default function Dashboard({ user, onLogout }) {
  return (
    <AppShell title="Dashboard" subtitle="Manage your wallet, payments and account activity from one secure panel." user={user} onLogout={onLogout} actions={<div className="rounded-2xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">Secure and verified</div>}>
      <div className="grid gap-4 lg:grid-cols-3">
        <StatTile label="Wallet balance" value="₦245,800" hint="Updated 2 mins ago" />
        <StatTile label="Completed services" value="1,284" hint="Across all utility types" />
        <StatTile label="Pending alerts" value="3" hint="Needs attention" tone="bg-amber-50 text-amber-700" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PageCard title="Recent transactions" description="Your latest payments and service activity." action={<Link to="/transactions" className="text-sm font-semibold text-green-700">View all</Link>}>
          <div className="space-y-3">
            {recentTransactions.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-800">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.time}</p>
                </div>
                <p className="font-semibold text-green-700">{item.amount}</p>
              </div>
            ))}
          </div>
        </PageCard>

        <div className="space-y-6">
          <PageCard title="Quick actions" description="Jump into the most common services.">
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.to} className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  {action.label}
                </Link>
              ))}
            </div>
          </PageCard>

          <PageCard title="Notifications" description="Important updates from your account.">
            <ul className="space-y-2 text-sm text-slate-700">
              {notifications.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">{item}</li>
              ))}
            </ul>
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
