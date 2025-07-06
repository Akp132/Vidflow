import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api, { setToken } from './api';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import './App.css';

// App layout with navigation and authentication handling
function App() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  // On mount, set the token from localStorage if present
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    if (token) {
      api.get('/auth/profile')
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  // Handle logout: clear token and redirect to login
  function handleLogout() {
    localStorage.removeItem('token');
    setToken();
    setUser(null);
    navigate('/login');
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1} sx={{ width: '100%', left: 0, overflowX: 'hidden' }}>
        <Container maxWidth={false} disableGutters sx={{ px: 0 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                <Button color="inherit" component={Link} to="/" sx={{ mr: 1 }}>Feed</Button>
                <Button color="inherit" component={Link} to="/upload" sx={{ mr: 1 }}>Upload</Button>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 2,
                    color: 'primary.main',
                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                    textAlign: 'center',
                    textDecoration: 'none',
                    lineHeight: 1.1,
                  }}
                  component={Link}
                  to="/"
                  style={{ textDecoration: 'none' }}
                >
                  Vidflow
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                {!user && <Button color="inherit" component={Link} to="/signup" sx={{ mr: 1 }}>Signup</Button>}
                {!user && <Button color="inherit" component={Link} to="/login" sx={{ mr: 1 }}>Login</Button>}
                {user && (
                  <>
                    <IconButton onClick={handleMenu} color="inherit" size="large">
                      <Avatar sx={{ bgcolor: '#1976d2' }}>{user.name?.[0]?.toUpperCase() || '?'}</Avatar>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                      <MenuItem disabled>{user.name}</MenuItem>
                      <MenuItem onClick={handleLogout}><LogoutIcon fontSize="small" sx={{ mr: 1 }} />Logout</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: 'background.default', py: 4, overflowX: 'hidden' }}>
        <Container maxWidth="md">
          {/* Render matched route component here */}
          <Outlet />
        </Container>
      </Box>
    </>
  );
}

export default App;
