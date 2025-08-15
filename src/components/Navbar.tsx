// src/components/Navbar.tsx

import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ForumIcon from '@mui/icons-material/Forum';
import LayersIcon from '@mui/icons-material/Layers';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Social Feed', icon: <ForumIcon />, path: '/feed' },
  { text: 'Collections', icon: <LayersIcon />, path: '/collections' },
  { text: 'Marketplace', icon: <StorefrontIcon />, path: '/marketplace' },
  { text: 'Trading', icon: <SwapHorizIcon />, path: '/trading' },
  { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: 'white',
        borderRight: '1px solid #e0e0e0',
        p: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}
    >
      <Box sx={{ p: 2, pb: 4 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          HatakeSocial
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Navbar;