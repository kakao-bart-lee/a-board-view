import { useEffect, useState, useRef } from 'react';
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
  Menu,
  MenuItem,
} from '@mui/material';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [commentMenuAnchor, setCommentMenuAnchor] = useState(null);
  const api = useApi();
  const fetchedIdRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    fetchedIdRef.current = null;
  }, [api]);

  const openMenu = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const openCommentMenu = (e) => {
    setCommentMenuAnchor(e.currentTarget);
  };

  const closeCommentMenu = () => {
    setCommentMenuAnchor(null);
  };

  const startReply = (comment) => {
    setReplyTo(comment);
    setComment('');
    setTimeout(() => commentRef.current && commentRef.current.focus(), 0);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const renderComment = (c, depth) => {
    const cColor = (c.gender || '').toLowerCase() === 'male' ? 'blue' : 'hotpink';
    const time = timeAgo(c.createdAt || c.created || c.created_at);
    return (
      <div key={c.id}>
        <ListItem disablePadding alignItems="flex-start" sx={{ pl: depth * 2 }}>
          <ListItemText
            primary={
              <Typography component="span">
                <span style={{ color: cColor }}>{'\u25CF'}</span> {c.text}
              </Typography>
            }
            secondary={
              <span>
                {time && (
                  <Typography component="span" variant="caption" sx={{ mr: 1 }}>
                    {time}
                  </Typography>
                )}
                {depth === 0 && (
                  <Button
                    size="small"
                    sx={{ minWidth: 'auto', mr: 1 }}
                    onClick={() => startReply(c)}
                  >
                    답글
                  </Button>
                )}
                <Button size="small" onClick={openCommentMenu} sx={{ minWidth: 'auto' }}>
                  {'\u22EE'}
                </Button>
              </span>
            }
          />
        </ListItem>
        {replyTo && replyTo.id === c.id && (
          <form onSubmit={submitComment} style={{ marginBottom: 16 }}>
            <div style={{ paddingLeft: (depth + 1) * 16 }}>
            <Typography variant="caption" component="div" sx={{ mb: 1 }}>
              Replying to: {c.text}
              <Button size="small" onClick={cancelReply} sx={{ ml: 1 }}>
                Cancel
              </Button>
            </Typography>
            <TextField
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment"
              size="small"
              inputRef={commentRef}
              sx={{ mr: 1 }}
            />
            <Button type="submit" variant="contained">Add Comment</Button>
            </div>
          </form>
        )}
        {depth < 1 && (c.comments || c.replies || []).map((child) => renderComment(child, depth + 1))}
      </div>
    );
  };
  useEffect(() => {
    if (fetchedIdRef.current === id) return;
    fetchedIdRef.current = id;
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
        const normalize = (comments = []) =>
          comments.map((c) => ({
            ...c,
            comments: normalize(c.comments || c.replies || []),
            replies: c.replies || c.comments,
          }));
        if (data) {
          data.comments = normalize(data.comments);
        }
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
    const res = await api(`/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: comment, parentCommentId: replyTo?.id }),
    });
    let newComment = null;
    if (res.ok) {
      try {
        newComment = await res.json();
      } catch {
        newComment = null;
      }
    }
    if (newComment) {
      setPost((prev) => {
        if (!prev) return prev;
        const insert = (list) => {
          if (!replyTo) return [...list, newComment];
          return list.map((c) => {
            const children = c.comments || c.replies || [];
            if (c.id === replyTo.id) {
              const updated = [...children, newComment];
              return { ...c, comments: updated, replies: updated };
            }
            const updatedChildren = insert(children);
            return { ...c, comments: updatedChildren, replies: updatedChildren };
          });
        };
        return { ...prev, comments: insert(prev.comments || []) };
      });
    } else {
      const postRes = await api(`/posts/${id}`);
      if (postRes.ok) {
        setPost(await postRes.json());
      }
    }
    setComment('');
    setReplyTo(null);
  };

  if (!post) return <div>Loading...</div>;

  const lines = (post.text || '').split(/\r?\n/);
  const first = lines[0] || '';
  const rest = lines.slice(1).join('\n');
  const color = (post.gender || '').toLowerCase() === 'male' ? 'blue' : 'hotpink';
  const viewCount = post.viewCount || post.views || 0;
  const commentCount = post.comments ? post.comments.length : post.commentCount || 0;

  return (
    <div>
      <Typography component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        <span style={{ color }}>{'\u25CF'}</span> {first}
      </Typography>
      {rest && (
        <Typography variant="body1" gutterBottom>
          {rest}
        </Typography>
      )}
      <Typography component="div" sx={{ mb: 1 }}>
        <span role="img" aria-label="views">👁</span> {viewCount}{' '}
        <span role="img" aria-label="comments">💬</span> {commentCount}
        <Button
          size="small"
          onClick={openMenu}
          sx={{ ml: 1, minWidth: 'auto' }}
        >
          {'\u22EE'}
        </Button>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
          <MenuItem onClick={closeMenu}>신고하기</MenuItem>
          <MenuItem onClick={closeMenu}>이 사용자의 글 보지않기</MenuItem>
        </Menu>
      </Typography>
      {!replyTo && (
        <form onSubmit={submitComment} style={{ marginBottom: 16 }}>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment"
            size="small"
            inputRef={commentRef}
            sx={{ mr: 1 }}
          />
          <Button type="submit" variant="contained">Add Comment</Button>
        </form>
      )}
      <List>
        {(post.comments || []).map((c) => renderComment(c, 0))}
      </List>
      <Menu
        anchorEl={commentMenuAnchor}
        open={Boolean(commentMenuAnchor)}
        onClose={closeCommentMenu}
      >
        <MenuItem onClick={closeCommentMenu}>신고하기</MenuItem>
      </Menu>
      {error && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </div>
  );
}
