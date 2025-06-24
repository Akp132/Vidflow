import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api, { setToken } from './api';
import './App.css';

// App layout with navigation and authentication handling
function App() {
  const navigate = useNavigate();

  // On mount, set the token from localStorage if present
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, []);

  // Handle logout: clear token and redirect to login
  function handleLogout() {
    localStorage.removeItem('token');
    setToken();
    navigate('/login');
  }

  return (
    <>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Feed</Link>
        <Link to="/upload" style={{ marginRight: '1rem' }}>Upload</Link>
        <Link to="/signup" style={{ marginRight: '1rem' }}>Signup</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
      </nav>
      {/* Render matched route component here */}
      <Outlet />
    </>
  );
}

export default App;
