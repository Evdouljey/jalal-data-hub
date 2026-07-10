import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'ada@jalalhub.com', password: 'password123' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('jalal-token', data.token);
      localStorage.setItem('jalal-user', JSON.stringify(data.user));
      onLogin(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f7fff9_0%,_#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[36px] border border-green-100 bg-white shadow-2xl lg:flex-row">
        <div className="flex-1 bg-gradient-to-br from-green-600 to-green-800 p-8 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-100">Secure access</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Sign in to your JALAL DATA HUB account.</h1>
          <p className="mt-4 text-sm leading-7 text-green-50">Experience elegant utility payments with real-time confirmations and a smart wallet.</p>
        </div>
        <div className="flex-1 p-8 sm:p-10">
          <div className="mb-6">
            <p className="text-sm font-semibold text-green-600">Welcome back</p>
            <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </div>
            {error ? <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
            <button className="w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white">Continue</button>
          </form>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <p>No account yet? <Link to="/register" className="font-semibold text-green-700">Register here</Link></p>
            <Link to="/forgot-password" className="font-semibold text-green-700">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
