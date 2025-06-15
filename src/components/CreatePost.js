import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api';

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
    <form onSubmit={submit}>
      <h2>Write Post</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write something" />
      <button type="submit">Submit</button>
    </form>
  );
}
