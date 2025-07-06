import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';

function Upload() {
  const [form, setForm] = useState({ title: '', description: '', file: null });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e) {
    const file = e.target.files[0];
    setForm({ ...form, file });
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
        setPreview(URL.createObjectURL(file));
      } else if (ext === 'mp4') {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('file', form.file);
    try {
      await api.post('/videos/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (err) {
      alert('Upload failed. Please try again.');
    }
  }

  if (!token) {
    return <Typography align="center" sx={{ mt: 6 }}>Please login first</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>Upload Media</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            multiline
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Select Video or Image File
            <input
              type="file"
              name="file"
              accept="video/mp4,image/jpeg,image/png,image/webp"
              onChange={handleFile}
              required
              hidden
            />
          </Button>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }} color={form.file ? 'text.primary' : 'text.secondary'}>
            {form.file ? form.file.name : 'No file selected'}
          </Typography>
          {preview && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              {form.file && ["jpg", "jpeg", "png", "webp"].includes(form.file.name.split('.').pop().toLowerCase()) ? (
                <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
              ) : (
                <video src={preview} controls style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
              )}
            </Box>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Upload
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Upload;
