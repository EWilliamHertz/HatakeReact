// src/pages/SocialFeed.tsx

import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, TextField, Button, Grid, Chip } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const fetchPosts = async () => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const createPost = async (postData: { userId: string; content: string; type: string; image?: string; username: string; reputation: number }) => {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

const SocialFeed = () => {
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('Discussion');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: posts, isLoading, error, refetch } = useQuery('posts', fetchPosts);
  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      setPostContent('');
      setImageFile(null);
      refetch();
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    if (postContent.trim() === '') return;

    let imageUrl = '';
    if (imageFile) {
      const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const newPost = {
      userId: 'user123', // Placeholder for current user
      username: 'CardMaster2024',
      reputation: 4.9,
      content: postContent,
      type: postType,
      image: imageUrl,
    };

    createPostMutation.mutate(newPost);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">An error occurred while fetching posts.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Social Feed
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Connect with the TCG community and share your passion.
      </Typography>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Share with the community
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar alt="User" src="/path/to/avatar.jpg" sx={{ mr: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What's happening in your TCG world?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </Box>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {['Discussion', 'Trade Offer', 'Card Pull', 'Deck Build'].map((type) => (
            <Grid item key={type}>
              <Chip
                label={type}
                onClick={() => setPostType(type)}
                color={postType === type ? 'primary' : 'default'}
                variant={postType === type ? 'filled' : 'outlined'}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" component="label" sx={{ mr: 2 }}>
            Add Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePost}
            disabled={!postContent.trim() || createPostMutation.isLoading}
            sx={{ ml: 'auto' }}
          >
            Post
          </Button>
        </Box>
      </Card>

      {posts?.map((post: any) => (
        <Card key={post.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar alt={post.username} src="/path/to/avatar.jpg" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {post.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.reputation} ★ {post.createdAt?.toDate().toLocaleString()}
              </Typography>
            </Box>
            <Chip label={post.type} sx={{ ml: 'auto' }} />
          </Box>
          <Typography sx={{ mt: 2 }}>{post.content}</Typography>
          {post.image && (
            <Box sx={{ mt: 2 }}>
              <img src={post.image} alt="Post" style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );
};

export default SocialFeed;