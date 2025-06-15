import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API } from '../api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gender,
          birthYear: parseInt(birthYear, 10),
        }),
      });
      if (!res.ok) throw new Error('Failed to create user');

      const user = await res.json();
      const tokenRes = await fetch(`${API}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!tokenRes.ok) throw new Error('Failed to fetch token');

      const data = await tokenRes.json();
      login(data.token);
      setError('');
    } catch (err) {
      setError('Sign up failed');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <label>
        Gender
        <select
          aria-label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
      <input value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="Birth Year" />
      <button type="submit">Sign Up</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
