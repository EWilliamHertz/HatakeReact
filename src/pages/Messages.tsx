// src/pages/Messages.tsx

import React from 'react';
import { Box, Typography, Card, Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';

const conversations = [
  { id: 1, name: 'CardMaster_92', lastMessage: 'Thanks for the offer! Let me think about it.', trade: true },
  { id: 2, name: 'PokemonCollector', lastMessage: 'Do you have any other cards from this set?', trade: false },
  { id: 3, name: 'MTG_Trader_Pro', lastMessage: 'The card arrived in perfect condition!', trade: true },
  { id: 4, name: 'YuGiOh_King', lastMessage: 'Would you be interested in a trade in the future?', trade: false },
  { id: 5, name: 'DragonBall_Fan', lastMessage: 'I can do $200 for the whole lot', trade: true },
];

const Messages = () => {
  return (
    <Box sx={{ display: 'flex', height: '80vh', mt: 4 }}>
      <Card sx={{ width: 300, overflowY: 'auto', p: 2, mr: 3 }}>
        <Typography variant="h6" gutterBottom>
          Messages
        </Typography>
        <List>
          {conversations.map((convo) => (
            <ListItem key={convo.id} disablePadding sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
              <ListItemAvatar>
                <Avatar>{convo.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={convo.name}
                secondary={convo.lastMessage}
              />
              {convo.trade && <Chip label="Trade" size="small" color="primary" />}
            </ListItem>
          ))}
        </List>
      </Card>

      <Card sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ForumIcon color="action" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          Select a conversation
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          Choose a conversation from the sidebar to start chatting with other TCG enthusiasts.
        </Typography>
      </Card>
    </Box>
  );
};

export default Messages;