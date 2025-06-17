import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api';
import { Typography, TextField, Button } from '@mui/material';

export default function CreatePost() {
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const api = useApi();
  const submit = async (e) => {
    e.preventDefault();
    await api('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    navigate('/');
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Write Post
      </Typography>
      <TextField
        multiline
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
}
