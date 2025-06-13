import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/posts/${id}`)
      .then(res => res.json())
      .then(setPost);
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: comment }),
    });
    setComment('');
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
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
