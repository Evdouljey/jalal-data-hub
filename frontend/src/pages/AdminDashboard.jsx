import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';
import StatTile from '../components/StatTile';

const adminStats = [
  { title: 'Total revenue', value: '₦4.2M', note: 'This month' },
  { title: 'Active agents', value: '132', note: 'Across 6 regions' },
  { title: 'Open disputes', value: '7', note: 'Needs review' },
];

const managementLists = ['User Management', 'Transaction Management', 'Wallet Funding', 'Analytics', 'API Settings'];

export default function AdminDashboard({ user, onLogout }) {
  return (
    <AppShell title="Admin Dashboard" subtitle="Monitor operations, revenue and service health from one secure control center." user={user} onLogout={onLogout}>
      <div className="grid gap-4 lg:grid-cols-3">
        {adminStats.map((stat) => (
          <StatTile key={stat.title} label={stat.title} value={stat.value} hint={stat.note} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Admin operations" description="Current control areas for the platform.">
          <div className="grid gap-3 md:grid-cols-2">
            {managementLists.map((item) => (
              <div key={item} className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-slate-700">{item}</div>
            ))}
          </div>
        </PageCard>
        <PageCard title="API settings" description="Secure integration and provider configuration.">
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3">Webhook status: Active</div>
            <div className="rounded-2xl bg-slate-50 p-3">Secret key rotation: Enabled</div>
            <div className="rounded-2xl bg-slate-50 p-3">Monitoring alerts: Live</div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
