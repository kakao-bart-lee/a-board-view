import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Posts from './components/Posts';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

function Navigation() {
  const { token, logout } = useAuth();
  return (
    <nav>
      <Link to="/">Posts</Link> | <Link to="/signup">Sign Up</Link> |{' '}
      {token ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts/:id" element={<Post />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
