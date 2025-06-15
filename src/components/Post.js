import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../api';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const api = useApi();
  useEffect(() => {
    api(`/posts/${id}`)
      .then(res => res.json())
      .then(setPost);
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
      <p>{post.text}</p>
      <form onSubmit={submitComment}>
        <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" />
        <button type="submit">Add Comment</button>
      </form>
      <ul>
        {(post.comments || []).map(c => (
          <li key={c.id}>{c.text}</li>
        ))}
      </ul>
    </div>
  );
}
