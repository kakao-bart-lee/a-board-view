import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    navigate('/');
  };
  return (
    <form onSubmit={submit}>
      <h2>Write Post</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <button type="submit">Submit</button>
    </form>
  );
}
