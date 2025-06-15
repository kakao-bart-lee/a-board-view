import { useState } from 'react';
import { useAuth } from '../AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function Login() {
  const [userId, setUserId] = useState('');
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      const data = await res.json();
      login(data.token);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      <button type="submit">Login</button>
    </form>
  );
}
