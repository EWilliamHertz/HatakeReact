// src/pages/Trading.tsx

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Trading = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Trading Center
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Create complex trades, negotiate deals, and build your reputation in the community.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Your Offer
            </Typography>
            <Box sx={{ p: 2, border: '2px dashed #ddd', borderRadius: 2, textAlign: 'center', cursor: 'pointer' }}>
              <AddCircleOutlineIcon color="action" sx={{ fontSize: 40 }} />
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Add cards from your collection
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>Browse Collection</Button>
            </Box>
            <TextField
              fullWidth
              label="Cash Offer (Optional)"
              type="number"
              defaultValue={0.00}
              variant="outlined"
              margin="normal"
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Your Request
            </Typography>
            <Box sx={{ p: 2, border: '2px dashed #ddd', borderRadius: 2, textAlign: 'center', cursor: 'pointer' }}>
              <AddCircleOutlineIcon color="action" sx={{ fontSize: 40 }} />
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Search for cards you want
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>Search Cards</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Trade Message
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Add a message to explain your trade offer..."
        />
      </Card>
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button variant="contained" color="primary" size="large">
          Create Trade
        </Button>
      </Box>
    </Box>
  );
};

export default Trading;