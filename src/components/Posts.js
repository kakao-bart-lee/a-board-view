import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../api';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const api = useApi();
  useEffect(() => {
    api('/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <Link to="/create">Write Post</Link>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
