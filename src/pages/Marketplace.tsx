// src/pages/Marketplace.tsx

import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Chip, TextField } from '@mui/material';
import { useQuery } from 'react-query';

const fetchMarketplaceListings = async () => {
  // This would fetch from the 'seller_inventory' collection
  return [
    { id: 1, name: 'Black Lotus', set: 'Alpha', condition: 'Near Mint', price: 45000, image: 'https://i.imgur.com/QhXj0Xl.jpg' },
    { id: 2, name: 'Charizard', set: 'Base Set', condition: 'Mint', price: 8500, image: 'https://i.imgur.com/fGv1fVd.jpg' },
    { id: 3, name: 'Blue-Eyes White Dragon', set: 'LOB', condition: 'Light Play', price: 1200, image: 'https://i.imgur.com/8Tq1z5F.jpg' },
  ];
};

const Marketplace = () => {
  const { data: listings, isLoading, error } = useQuery('marketplaceListings', fetchMarketplaceListings);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">An error occurred.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Marketplace
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Discover rare cards, make secure trades, and grow your collection with trusted sellers.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>50K+</Typography>
          <Typography color="text.secondary">Active Listings</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>$2.5M</Typography>
          <Typography color="text.secondary">Monthly Volume</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>99.8%</Typography>
          <Typography color="text.secondary">Successful Trades</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>24/7</Typography>
          <Typography color="text.secondary">Escrow Protection</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <TextField fullWidth placeholder="Search cards, sets, or sellers..." />
      </Box>

      <Grid container spacing={3}>
        {listings?.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card>
              <CardMedia component="img" height="200" image={listing.image} alt={listing.name} />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{listing.name}</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    ${listing.price.toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {listing.set} · {listing.condition}
                </Typography>
                <Chip label="Escrow" size="small" color="success" sx={{ mt: 1 }} />
                <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;