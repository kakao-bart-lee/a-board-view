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
        {posts.map((p) => {
          const lines = (p.text || '').split(/\r?\n/);
          const first = lines[0] || '';
          const second = lines[1] || '';
          const third = lines[2] || '';
          const color = (p.gender || '').toLowerCase() === 'male' ? 'blue' : 'hotpink';
          const viewCount = p.viewCount || p.views || 0;
          const commentCount = p.comments ? p.comments.length : p.commentCount || 0;
          return (
            <ListItem key={p.id} disablePadding>
              <ListItemText>
                <Button
                  component={RouterLink}
                  to={`/posts/${p.id}`}
                  sx={{ textTransform: 'none', textAlign: 'left', display: 'block', py: 1 }}
                >
                  <Typography component="div" sx={{ fontWeight: 'bold' }}>
                    <span style={{ color }}>{'\u25CF'}</span> {first}
                  </Typography>
                  {second && <Typography component="div">{second}</Typography>}
                  {third && <Typography component="div">{third}</Typography>}
                  <Typography component="div" sx={{ mt: 1 }}>
                    <span role="img" aria-label="views">👁</span> {viewCount}{' '}
                    <span role="img" aria-label="comments">💬</span> {commentCount}
                  </Typography>
                </Button>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
      {error && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </div>
  );
}
