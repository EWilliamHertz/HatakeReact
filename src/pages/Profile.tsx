// src/pages/Profile.tsx

import React from 'react';
import { Box, Typography, Card, Avatar, Grid, Chip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';

const Profile = () => {
  const userData = {
    username: 'tcg_collector',
    reputation: 4.8,
    joined: 'Joined 2023',
    location: 'San Francisco, CA',
    trades: 127,
    followers: 342,
    following: 89,
    posts: 56,
    bio: 'Passionate TCG collector and competitive player. Specializing in vintage cards and tournament-winning deck builds. Always looking for fair trades and helping new players learn the game.',
    collectionStats: {
      totalCards: 2847,
      collectionValue: 15420,
      favoriteSet: 'Base Set Shadowless',
    },
    reputationBreakdown: {
      successfulTrades: 127,
      positiveReviews: '98%',
      responseTime: '< 2 hours',
    }
  };

  return (
    <Box>
      <Card sx={{ p: 4, mb: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Avatar sx={{ width: 120, height: 120, border: '4px solid #fff', boxShadow: 1 }} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 1 }}>{userData.username}</Typography>
            <VerifiedIcon color="primary" />
            <Chip label="Verified Trader" color="primary" sx={{ ml: 1 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarIcon fontSize="small" color="warning" />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>{userData.reputation} reputation</Typography>
            <Typography variant="body2" color="text.secondary">{userData.joined}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>{userData.location}</Typography>
          </Box>
          <Typography variant="body1" sx={{ maxWidth: 600, mt: 2 }}>{userData.bio}</Typography>
          <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{userData.trades}</Typography>
              <Typography variant="body2" color="text.secondary">Trades</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{userData.followers}</Typography>
              <Typography variant="body2" color="text.secondary">Followers</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{userData.following}</Typography>
              <Typography variant="body2" color="text.secondary">Following</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{userData.posts}</Typography>
              <Typography variant="body2" color="text.secondary">Posts</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Collection Stats
            </Typography>
            <Typography variant="body1">Total Cards: <Typography component="span" sx={{ fontWeight: 'bold' }}>{userData.collectionStats.totalCards}</Typography></Typography>
            <Typography variant="body1">Collection Value: <Typography component="span" sx={{ fontWeight: 'bold' }}>${userData.collectionStats.collectionValue.toLocaleString()}</Typography></Typography>
            <Typography variant="body1">Favorite Set: <Typography component="span" sx={{ fontWeight: 'bold' }}>{userData.collectionStats.favoriteSet}</Typography></Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reputation Breakdown
            </Typography>
            <Typography variant="body1">Successful Trades: <Typography component="span" sx={{ fontWeight: 'bold' }}>{userData.reputationBreakdown.successfulTrades}</Typography></Typography>
            <Typography variant="body1">Positive Reviews: <Typography component="span" sx={{ fontWeight: 'bold' }}>{userData.reputationBreakdown.positiveReviews}</Typography></Typography>
            <Typography variant="body1">Response Time: <Typography component="span" sx={{ fontWeight: 'bold' }}>{userData.reputationBreakdown.responseTime}</Typography></Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;