import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../api';
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const api = useApi();
  useEffect(() => {
    api(`/posts/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Login required');
          }
          throw new Error('Failed to load post');
        }
        try {
          return await res.json();
        } catch {
          return null;
        }
      })
      .then((data) => {
        setPost(data);
        setError('');
      })
      .catch((err) => {
        setPost(null);
        setError(err.message);
      });
  }, [id, api]);

  const submitComment = async (e) => {
    e.preventDefault();
    await api(`/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: comment }),
    });
    const res = await api(`/posts/${id}`);
    if (res.ok) {
      setPost(await res.json());
    }
    setComment('');
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Typography variant="body1" gutterBottom>
        {post.text}
      </Typography>
      <form onSubmit={submitComment} style={{ marginBottom: 16 }}>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button type="submit" variant="contained">
          Add Comment
        </Button>
      </form>
      <List>
        {(post.comments || []).map(c => (
          <ListItem key={c.id} disablePadding>
            <ListItemText primary={c.text} />
          </ListItem>
        ))}
      </List>
      {error && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </div>
  );
}
