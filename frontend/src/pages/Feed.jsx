import React, { useEffect, useState } from 'react';
import api from '../api';

// Feed page: shows all uploaded videos
export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get('/videos')
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
  }, []);

  if (loading) return <p>Loading videos…</p>;
  if (!videos.length) return <p>No videos found.</p>;

  return (
    <section>
      {videos.map(video => (
        <article key={video._id} style={{ border: '1px solid #ccc', margin: '1em 0', padding: '1em' }}>
          <h3>{video.title}</h3>
          <p>By: {video.uploader?.name || 'Unknown'} | Uploaded: {new Date(video.createdAt).toLocaleString()}</p>
          <video controls width={480} src={video.url} />
          {video.description && <p>{video.description}</p>}
        </article>
      ))}
    </section>
  );
}
