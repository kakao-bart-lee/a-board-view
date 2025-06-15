import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API } from '../api';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to fetch token');
      const data = await res.json();
      login(data.token);
      setError('');
    } catch (err) {
      setError('Login failed');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      <button type="submit">Login</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
