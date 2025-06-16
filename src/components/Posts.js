import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useApi } from '../api';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const api = useApi();
  useEffect(() => {
    api('/posts')
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Login required');
          }
          throw new Error('Failed to fetch posts');
        }
        try {
          return await res.json();
        } catch {
          return [];
        }
      })
      .then((data) => {
        setPosts(data);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
        setPosts([]);
      });
  }, [api]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      <Button
        variant="contained"
        component={RouterLink}
        to="/create"
        sx={{ mb: 2 }}
      >
        Write Post
      </Button>
      <List>
        {posts.map(p => (
          <ListItem key={p.id} disablePadding>
            <ListItemText>
              <Button component={RouterLink} to={`/posts/${p.id}`}>{p.text}</Button>
            </ListItemText>
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
