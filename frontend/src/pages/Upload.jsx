import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// Video upload page for authenticated users
function Upload() {
  const [form, setForm] = useState({ title: '', description: '', file: null });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Handle text input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle file input
  function handleFile(e) {
    setForm({ ...form, file: e.target.files[0] });
  }

  // Handle form submission
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
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Please login first</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '2rem auto' }}>
      <fieldset>
        <legend>Upload Video</legend>
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Video File
          <input
            type="file"
            name="file"
            accept="video/mp4"
            onChange={handleFile}
            required
            style={{ width: '100%' }}
          />
        </label>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Upload</button>
      </fieldset>
    </form>
  );
}

export default Upload;
