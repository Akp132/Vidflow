import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardHeader, CardMedia, CardContent, Avatar, Typography, Button, Box, Skeleton, TextField } from '@mui/material';

// Feed page: shows uploads from people the user follows
export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFollowing, setShowFollowing] = useState(false); // Default to 'All'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    const endpoint = showFollowing ? '/videos/following' : '/videos';
    api.get(endpoint)
      .then(res => {
        if (isMounted) {
          setVideos(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVideos([]);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [showFollowing]);

  // Always show the toggle buttons
  const ToggleButtons = (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <Button
        variant={showFollowing ? 'contained' : 'outlined'}
        onClick={() => setShowFollowing(true)}
        sx={{ mr: 1 }}
      >
        Following
      </Button>
      <Button
        variant={!showFollowing ? 'contained' : 'outlined'}
        onClick={() => setShowFollowing(false)}
      >
        All
      </Button>
    </Box>
  );

  const filteredVideos = videos.filter(video => {
    const term = searchTerm.toLowerCase();
    return video.title.toLowerCase().includes(term) ||
           video.description.toLowerCase().includes(term) ||
           (video.uploader && video.uploader.name.toLowerCase().includes(term)) ||
           (Array.isArray(video.tags) && video.tags.some(tag => tag.toLowerCase().includes(term)));
  });

  if (loading) return (
    <section>
      {ToggleButtons}
      <Box>
        {[1,2,3].map(i => (
          <Card key={i} sx={{ maxWidth: 600, margin: '2rem auto' }}>
            <CardHeader avatar={<Skeleton variant="circular" width={40} height={40} />} title={<Skeleton width="40%" />} subheader={<Skeleton width="30%" />} />
            <Skeleton variant="rectangular" height={300} />
            <CardContent>
              <Skeleton width="80%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    </section>
  );

  return (
    <section>
      {ToggleButtons}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search by title, username, or tags"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: '100%', maxWidth: 600 }}
        />
      </Box>
      {filteredVideos.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>No uploads found.</Typography>
      ) : (
        filteredVideos.map(video => (
          <Card key={video._id} sx={{ maxWidth: 600, margin: '2rem auto' }}>
            <CardHeader
              avatar={<Avatar>{video.uploader?.name?.[0]?.toUpperCase() || '?'}</Avatar>}
              title={video.title}
              subheader={<span>By: {video.uploader ? <a href={`/profile/${video.uploader._id}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>{video.uploader.name}</a> : 'Unknown'} | {new Date(video.createdAt).toLocaleString()}</span>}
            />
            {video.mediaType === 'image' ? (
              <CardMedia
                component="img"
                image={video.url}
                alt={video.title}
                sx={{ maxHeight: 400, objectFit: 'contain', background: '#fafafa' }}
              />
            ) : (
              <CardMedia
                component="video"
                controls
                height="300"
                src={video.url}
              />
            )}
            <CardContent>
              <Typography variant="body2">{video.description}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </section>
  );
}
