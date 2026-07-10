import { useState } from 'react';
import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';

const plans = [
  { name: '1GB Daily', amount: 1000, note: 'Fast activation' },
  { name: '5GB Weekly', amount: 3500, note: 'Best value' },
  { name: '10GB Monthly', amount: 6500, note: 'Great for work' },
  { name: '20GB Premium', amount: 10000, note: 'High-speed data' },
];

export default function BuyData({ user, onLogout }) {
  const [phone, setPhone] = useState('');
  const [busyPlan, setBusyPlan] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const buyData = async (plan) => {
    if (!phone.trim()) {
      setError('Please enter a phone number first.');
      return;
    }

    setBusyPlan(plan.name);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/services/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, amount: plan.amount, plan: plan.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Purchase failed');
      }

      setMessage(`Data purchase submitted for ${phone}.`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusyPlan('');
    }
  };

  return (
    <AppShell title="Buy Data" subtitle="Select a data plan and activate instantly." user={user} onLogout={onLogout}>
      <PageCard title="Data bundles" description="Reliable connectivity across all major networks.">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="0803xxxxxxx"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        {message ? <p className="mb-4 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-[24px] border border-green-100 bg-green-50 p-5">
              <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
              <p className="mt-2 text-sm text-slate-600">{plan.note}</p>
              <p className="mt-4 text-2xl font-semibold text-green-700">₦{plan.amount.toLocaleString()}</p>
              <button
                className="mt-4 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-green-300"
                onClick={() => buyData(plan)}
                disabled={busyPlan === plan.name}
              >
                {busyPlan === plan.name ? 'Processing...' : 'Buy now'}
              </button>
            </div>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}
