import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to process request');
      setMessage(`Password reset instructions sent to ${email}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f7fff9_0%,_#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col rounded-[32px] border border-green-100 bg-white shadow-2xl lg:flex-row">
        <div className="flex-1 bg-gradient-to-br from-green-600 to-green-800 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-100">Secure recovery</p>
          <h1 className="mt-3 text-3xl font-semibold">Reset your password securely.</h1>
          <p className="mt-4 text-sm leading-7 text-green-50">We will send a recovery link to your inbox so you can regain access to your account quickly.</p>
        </div>
        <div className="flex-1 p-8">
          <p className="text-sm font-semibold text-green-600">Forgot password</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recover access</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>
            {error ? <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
            {message ? <p className="rounded-2xl bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}
            <button className="w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white">Send reset link</button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Remembered your password? <Link to="/login" className="font-semibold text-green-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
