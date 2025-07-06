import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Upload from './pages/Upload.jsx';
import Feed from './pages/Feed.jsx';
import Profile from './pages/Profile.jsx';
import './index.css';

// Main entry: sets up routing for the app with App as layout
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Feed />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="upload" element={<Upload />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
