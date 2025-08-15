// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SocialFeed from './pages/SocialFeed';
import Collections from './pages/Collections';
import Marketplace from './pages/Marketplace';
import Trading from './pages/Trading';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="*"
          element={
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/feed" element={<SocialFeed />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/trading" element={<Trading />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Box>
            </Box>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
