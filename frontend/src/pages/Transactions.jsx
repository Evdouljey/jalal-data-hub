import AppShell from '../components/AppShell';

const history = [
  { id: 'TRX-1042', type: 'Airtime top-up', amount: '₦5,000', status: 'Successful' },
  { id: 'TRX-1041', type: 'Data bundle', amount: '₦2,000', status: 'Successful' },
  { id: 'TRX-1040', type: 'Electricity', amount: '₦16,400', status: 'Pending' },
];

export default function Transactions({ user, onLogout }) {
  return (
    <AppShell title="Transactions" subtitle="Review every service payment and transfer in your history." user={user} onLogout={onLogout}>
      <div className="overflow-hidden rounded-[24px] border border-emerald-100">
        <table className="min-w-full divide-y divide-emerald-100 bg-white">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reference</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-t border-emerald-100">
                <td className="px-4 py-3 text-sm text-slate-700">{item.id}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{item.type}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{item.amount}</td>
                <td className="px-4 py-3 text-sm text-emerald-700">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
