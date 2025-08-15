// src/pages/Dashboard.tsx

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useQuery } from 'react-query';
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Mock data for demonstration, will be replaced with real data fetching
const fetchDashboardData = async () => {
  // Fetch user data from 'users' collection
  const userRef = doc(db, 'users', 'user123'); // Example user ID
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : {};

  // Fetch recent activity from 'events' collection
  const q = query(collection(db, 'events'), orderBy('timestamp', 'desc'), limit(5));
  const querySnapshot = await getDocs(q);
  const recentActivity = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // This is a placeholder structure. The actual data would come from the Firebase.
  return {
    collectionValue: userData.collectionValue || 12450,
    activeTrades: 7,
    messages: 23,
    reputation: userData.reputation || 4.9,
    recentActivity: recentActivity,
  };
};

// Component for stat cards
const StatCard = ({ title, value, trend, trendText }: { title: string; value: any; trend: 'up' | 'down'; trendText: string }) => (
  <Card sx={{ p: 2, textAlign: 'center' }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
        {trend === 'up' ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />}
        <Typography variant="body2" color={trend === 'up' ? 'success.main' : 'error.main'}>
          {trendText}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data, isLoading, error } = useQuery('dashboardData', fetchDashboardData);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">An error occurred.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back! Here's what's happening in your TCG world.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Collection Value" value={`$${data.collectionValue.toLocaleString()}`} trend="up" trendText="+12.5% from last month" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Trades" value={data.activeTrades} trend="up" trendText="7 pending offers" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Messages" value={data.messages} trend="up" trendText="5 unread" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Reputation" value={data.reputation} trend="up" trendText="Based on 127 reviews" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box>
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity: any) => (
                  <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: activity.type === 'trade' ? 'primary.main' : 'info.main',
                        mr: 2,
                      }}
                    />
                    <Typography>{activity.description}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                      {activity.timeAgo}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No recent activity.</Typography>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" sx={{ py: 1.5 }}>
                  Add Cards to Collection
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="outlined" sx={{ py: 1.5 }}>
                  List Card for Sale
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="outlined" sx={{ py: 1.5 }}>
                  Browse Marketplace
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="outlined" sx={{ py: 1.5 }}>
                  Find Trading Partners
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;