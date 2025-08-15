// src/pages/Collections.tsx

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, LinearProgress } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useQuery } from 'react-query';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchCollectionData = async () => {
  // Fetch collection value from the user's data
  const userRef = collection(db, 'users', 'user123', 'collection');
  const collectionSnapshot = await getDocs(userRef);

  const totalCards = collectionSnapshot.docs.length;
  const uniqueCards = new Set(collectionSnapshot.docs.map(doc => doc.data().cardId)).size;
  const collectionValue = collectionSnapshot.docs.reduce((sum, doc) => sum + doc.data().currentMarketValue, 0);

  // This is a placeholder for completion rate. In a real app, it would be based on
  // a specific set (e.g., Base Set Shadowless) and the total cards in that set.
  const completionRate = 67;

  return {
    totalCards,
    uniqueCards,
    collectionValue: collectionValue,
    completionRate,
    recentActivity: [
      { id: 1, type: 'added', card: 'Charizard VMAX', price: 89.99, time: '2 hours ago' },
      { id: 2, type: 'updated', card: 'Blastoise Holo', price: 125, time: '1 day ago' },
      { id: 3, type: 'added', card: 'Pikachu Illustrator', price: 2500, time: '3 days ago' },
      { id: 4, type: 'removed', card: 'Machamp Holo', price: 45.50, time: '1 week ago' },
    ],
    mostValuable: [
      { id: 1, rank: 1, card: 'Pikachu Illustrator', price: 2500, trend: '+15.2%' },
      { id: 2, rank: 2, card: 'Base Set Charizard', price: 350, trend: '-2.7%' },
      { id: 3, rank: 3, card: 'Trophy Pikachu', price: 180, trend: '+5.8%' },
      { id: 4, rank: 4, card: 'Rayquaza VMAX Alt', price: 156.75, trend: '+12.3%' },
    ]
  };
};

const Collections = () => {
  const { data, isLoading, error } = useQuery('collectionsData', fetchCollectionData);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">An error occurred.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        My Collection
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage your TCG collection, track values, and discover new cards.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Total Cards</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{data.totalCards}</Typography>
            <Typography variant="body2" color="text.secondary">{data.uniqueCards} unique cards</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Collection Value</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>${data.collectionValue.toLocaleString()}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpwardIcon color="success" sx={{ fontSize: '1rem' }} />
              <Typography variant="body2" color="success.main">+8.3% this month</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{data.completionRate}%</Typography>
            <LinearProgress variant="determinate" value={data.completionRate} color="primary" sx={{ height: 8, borderRadius: 4, mt: 1 }} />
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {data.recentActivity.map((activity) => (
                <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', my: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
                    {activity.type}
                  </Typography>
                  <Typography variant="body1">{activity.card}</Typography>
                  <Typography variant="body1" sx={{ ml: 'auto' }}>${activity.price.toFixed(2)}</Typography>
                </Box>
              ))}
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Most Valuable Cards
              </Typography>
              {data.mostValuable.map((card) => (
                <Box key={card.id} sx={{ display: 'flex', alignItems: 'center', my: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>{card.rank}.</Typography>
                  <Typography variant="body1">{card.card}</Typography>
                  <Typography variant="body1" sx={{ ml: 'auto', fontWeight: 'bold' }}>${card.price.toFixed(2)}</Typography>
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Collections;