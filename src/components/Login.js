import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API } from '../api';
import { Typography, TextField, Button, Alert } from '@mui/material';

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
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Login
      </Button>
      {error && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </form>
  );
}
