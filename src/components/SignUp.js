import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API } from '../api';
import {
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
} from '@mui/material';

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
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <label htmlFor="gender-select">Gender</label>
        <select
          id="gender-select"
          aria-label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ padding: '8px', marginTop: 4 }}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </FormControl>
      <TextField
        value={birthYear}
        onChange={(e) => setBirthYear(e.target.value)}
        placeholder="Birth Year"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Sign Up
      </Button>
      {error && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </form>
  );
}
