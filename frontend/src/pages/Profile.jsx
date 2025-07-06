import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Card, CardHeader, CardMedia, CardContent, Avatar, Typography, Box, Button, Grid, CircularProgress } from '@mui/material';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.get(`/profile/${id}`)
      .then(res => {
        if (isMounted) {
          setProfile(res.data.user);
          setUploads(res.data.uploads);
          setFollowersCount(res.data.user.followers.length);
        }
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
    // Get current user
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/profile').then(res => setCurrentUser(res.data)).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (profile && currentUser) {
      setIsFollowing(profile.followers.includes(currentUser._id));
    }
  }, [profile, currentUser]);

  const handleFollow = async () => {
    await api.post(`/profile/${id}/follow`);
    setIsFollowing(true);
    setFollowersCount(f => f + 1);
  };
  const handleUnfollow = async () => {
    await api.post(`/profile/${id}/unfollow`);
    setIsFollowing(false);
    setFollowersCount(f => f - 1);
  };

  if (loading) return <Box sx={{ mt: 6, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!profile) return <Typography align="center" sx={{ mt: 6 }}>User not found.</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Card sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: 32 }}>{profile.name?.[0]?.toUpperCase() || '?'}</Avatar>
          <Box>
            <Typography variant="h5">{profile.name}</Typography>
            <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
            <Typography variant="body2" color="text.secondary">Followers: {followersCount} | Following: {profile.following.length}</Typography>
          </Box>
          {currentUser && currentUser._id !== profile._id && (
            isFollowing ?
              <Button variant="outlined" color="primary" sx={{ ml: 'auto' }} onClick={handleUnfollow}>Unfollow</Button>
              :
              <Button variant="contained" color="primary" sx={{ ml: 'auto' }} onClick={handleFollow}>Follow</Button>
          )}
        </Box>
      </Card>
      <Typography variant="h6" sx={{ mb: 2 }}>Uploads</Typography>
      <Grid container spacing={2}>
        {uploads.length === 0 && <Typography>No uploads yet.</Typography>}
        {uploads.map(video => (
          <Grid item xs={12} sm={6} key={video._id}>
            <Card>
              <CardHeader
                title={video.title}
                subheader={new Date(video.createdAt).toLocaleString()}
              />
              {video.mediaType === 'image' ? (
                <CardMedia
                  component="img"
                  image={video.url}
                  alt={video.title}
                  sx={{ maxHeight: 300, objectFit: 'contain', background: '#fafafa' }}
                />
              ) : (
                <CardMedia
                  component="video"
                  controls
                  height="200"
                  src={video.url}
                />
              )}
              <CardContent>
                <Typography variant="body2">{video.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
