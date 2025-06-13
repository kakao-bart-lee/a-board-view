import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Posts from './components/Posts';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import SignUp from './components/SignUp';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Posts</Link> | <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts/:id" element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;
