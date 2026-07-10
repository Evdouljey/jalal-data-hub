import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';

export default function Profile({ user, onLogout }) {
  return (
    <AppShell title="Profile" subtitle="Manage personal details, security preferences and verification status." user={user} onLogout={onLogout}>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <PageCard title="KYC status" description="Your account verification details.">
          <div className="rounded-[24px] border border-green-100 bg-green-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">Account owner</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{user?.name || 'Ada Okafor'}</p>
            <p className="mt-2 text-sm text-slate-600">{user?.email || 'ada@jalalhub.com'}</p>
            <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">KYC Verified • Security level: High</div>
          </div>
        </PageCard>

        <div className="space-y-6">
          <PageCard title="Edit profile" description="Update your personal and contact information.">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
                <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" defaultValue="0803 000 0000" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Preferred notification</label>
                <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" defaultValue="Email and SMS" />
              </div>
              <button className="rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white">Save profile</button>
            </div>
          </PageCard>

          <PageCard title="Change password" description="Update your password for stronger access control.">
            <div className="space-y-4">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Current password" />
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="New password" />
              <button className="rounded-2xl border border-green-200 px-4 py-3 font-semibold text-green-700">Change password</button>
            </div>
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
