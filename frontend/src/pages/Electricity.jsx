import { useState } from 'react';
import AppShell from '../components/AppShell';
import PageCard from '../components/PageCard';

export default function Electricity({ user, onLogout }) {
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const payElectricity = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/services/electricity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meter_number: meterNumber, amount: Number(amount) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Electricity payment failed');
      }

      setMessage(`Electricity payment for meter ${meterNumber} is being processed.`);
      setMeterNumber('');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="Electricity" subtitle="Pay your power bill without leaving the app." user={user} onLogout={onLogout}>
      <PageCard title="Electricity payments" description="Enter your meter number and amount to complete a secure payment in minutes.">
        <form onSubmit={payElectricity} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Meter number" value={meterNumber} onChange={(event) => setMeterNumber(event.target.value)} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="1" />
          </div>
          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-green-300" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Processing...' : 'Pay electricity'}
          </button>
        </form>
      </PageCard>
    </AppShell>
  );
}
