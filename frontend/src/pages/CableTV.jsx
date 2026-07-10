import { useState } from 'react';
import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';

const plans = [
  { name: 'Dstv', price: 19000 },
  { name: 'GoTV', price: 8500 },
  { name: 'Startimes', price: 4200 },
];

export default function CableTV({ user, onLogout }) {
  const [smartCard, setSmartCard] = useState('');
  const [busyPlan, setBusyPlan] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const subscribe = async (plan) => {
    if (!smartCard.trim()) {
      setError('Please enter a smart card number first.');
      return;
    }

    setBusyPlan(plan.name);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/services/cable-tv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ smart_card: smartCard, package: plan.name, amount: plan.price }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setMessage(`${plan.name} subscription submitted for ${smartCard}.`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusyPlan('');
    }
  };

  return (
    <AppShell title="Cable TV" subtitle="Manage your subscriptions and renew on time." user={user} onLogout={onLogout}>
      <PageCard title="Cable subscriptions" description="Renew your package with a few taps and instant confirmation.">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Smart card number</label>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="1234567890"
            value={smartCard}
            onChange={(event) => setSmartCard(event.target.value)}
          />
        </div>
        {message ? <p className="mb-4 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-[24px] border border-green-100 bg-white p-5">
              <p className="text-lg font-semibold text-slate-900">{plan.name} - ₦{plan.price.toLocaleString()}</p>
              <p className="mt-2 text-sm text-slate-600">Reliable service and instant delivery.</p>
              <button
                className="mt-4 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-green-300"
                onClick={() => subscribe(plan)}
                disabled={busyPlan === plan.name}
              >
                {busyPlan === plan.name ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}
