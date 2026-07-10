import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import BuyData from './pages/BuyData';
import BuyAirtime from './pages/BuyAirtime';
import Electricity from './pages/Electricity';
import CableTV from './pages/CableTV';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('jalal-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('jalal-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onLogin={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute user={user}><Wallet user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/buy-data" element={<ProtectedRoute user={user}><BuyData user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/buy-airtime" element={<ProtectedRoute user={user}><BuyAirtime user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/electricity" element={<ProtectedRoute user={user}><Electricity user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/cable-tv" element={<ProtectedRoute user={user}><CableTV user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute user={user}><Transactions user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute user={user} requiredRole="admin"><AdminDashboard user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
