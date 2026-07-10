import { useState } from 'react';
import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';

const amounts = [500, 1000, 2000, 5000, 10000, 20000];

export default function BuyAirtime({ user, onLogout }) {
  const [phone, setPhone] = useState('');
  const [busyAmount, setBusyAmount] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const buyAirtime = async (amount) => {
    if (!phone.trim()) {
      setError('Please enter a phone number first.');
      return;
    }

    setBusyAmount(amount);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/services/airtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Airtime purchase failed');
      }

      setMessage(`Airtime recharge sent to ${phone}.`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusyAmount(null);
    }
  };

  return (
    <AppShell title="Buy Airtime" subtitle="Recharge phones quickly with secure top-ups." user={user} onLogout={onLogout}>
      <PageCard title="Airtime recharge" description="Fast top-up for mobile numbers across all networks.">
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
        <div className="grid gap-4 md:grid-cols-3">
          {amounts.map((amount) => (
            <div key={amount} className="rounded-[24px] border border-green-100 bg-white p-5">
              <p className="text-lg font-semibold text-slate-900">₦{amount.toLocaleString()}</p>
              <p className="mt-2 text-sm text-slate-600">Delivered instantly to your recipient.</p>
              <button
                className="mt-4 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-green-300"
                onClick={() => buyAirtime(amount)}
                disabled={busyAmount === amount}
              >
                {busyAmount === amount ? 'Processing...' : 'Send'}
              </button>
            </div>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}
