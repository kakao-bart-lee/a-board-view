import { useState } from 'react';
import { useAuth } from '../AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function SignUp() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, gender, birthYear: parseInt(birthYear, 10) }),
    });
    if (res.ok) {
      const user = await res.json();
      const tokenRes = await fetch(`${API}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (tokenRes.ok) {
        const data = await tokenRes.json();
        login(data.token);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender" />
      <input value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="Birth Year" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
