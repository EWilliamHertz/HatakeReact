// src/pages/LandingPage.tsx

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          HatakeSocial
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          The ultimate social platform for Trading Card Game enthusiasts.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Manage your collection, discover new cards, trade securely, and connect with a global community of TCG players and collectors.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/dashboard"
          sx={{ py: 1.5, px: 4 }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default LandingPage;