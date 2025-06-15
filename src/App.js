import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
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
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Posts
        </Button>
        <Button color="inherit" component={Link} to="/signup">
          Sign Up
        </Button>
        {token ? (
          <Button color="inherit" onClick={logout} data-testid="logout-button">
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Container sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts/:id" element={<Post />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
