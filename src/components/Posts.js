import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useApi } from '../api';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const api = useApi();
  useEffect(() => {
    api('/posts')
      .then(res => res.json())
      .then(setPosts);
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
    </div>
  );
}
