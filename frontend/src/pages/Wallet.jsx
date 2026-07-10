import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';
import StatTile from '../components/StatTile';

const history = [
  { id: 'W-201', type: 'Wallet funding', amount: '+₦50,000', status: 'Completed' },
  { id: 'W-202', type: 'Bill payment', amount: '-₦16,400', status: 'Completed' },
  { id: 'W-203', type: 'Refund', amount: '+₦3,200', status: 'Pending' },
];

export default function Wallet({ user, onLogout }) {
  return (
    <AppShell title="Wallet" subtitle="Fund your account, manage your balance and review transaction history." user={user} onLogout={onLogout}>
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[24px] border border-green-100 bg-gradient-to-br from-green-600 to-green-800 p-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-100">Available funds</p>
          <p className="mt-3 text-4xl font-semibold">₦245,800</p>
          <p className="mt-3 text-sm text-green-50">Your wallet is ready for instant utility payments and transfers.</p>
          <button className="mt-5 rounded-2xl bg-white px-4 py-3 font-semibold text-green-700">Fund wallet</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatTile label="Virtual account" value="0012345678" hint="Provider: JALAL" />
          <StatTile label="Daily spend" value="₦8,150" hint="Today" />
          <StatTile label="Pending credits" value="₦12,400" hint="Awaiting confirmation" />
          <StatTile label="Support status" value="24/7" hint="Fast response" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Transaction history" description="Recent wallet movement and funding activity.">
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-800">{item.type}</p>
                  <p className="text-sm text-slate-500">{item.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{item.amount}</p>
                  <p className="text-sm text-green-700">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="Virtual account" description="Use this placeholder account for wallet funding.">
          <div className="rounded-[24px] border border-green-100 bg-green-50 p-4">
            <p className="text-sm text-slate-600">Account name</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">JALAL DATA HUB</p>
            <p className="mt-4 text-sm text-slate-600">Account number</p>
            <p className="mt-1 text-2xl font-semibold text-green-700">0012345678</p>
            <p className="mt-4 text-sm text-slate-600">Bank</p>
            <p className="mt-1 font-semibold text-slate-900">GreenTrust Bank</p>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
