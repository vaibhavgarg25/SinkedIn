"use client"
import { useState } from 'react';
const SadnessChecker = () => {
  const [post, setPost] = useState('');
  const [isSad, setIsSad] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);

  const analyzePost = async () => {
    setLoading(true);
    setIsSad(null); // Reset the result
    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: post }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const data = await response.json();
      setIsSad(data.sad ? 1 : 0);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setIsSad(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sadness Checker</h1>
      <textarea
        value={post}
        onChange={(e) => setPost(e.target.value)}
        placeholder="Type your post here..."
        style={{
          width: '100%',
          height: '100px',
          marginBottom: '10px',
          padding: '10px',
          fontSize: '16px',
        }}
      />
      <button
        onClick={analyzePost}
        disabled={loading || !post.trim()}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        {loading ? 'Analyzing...' : 'Check Sadness'}
      </button>
      {isSad !== null && (
        <p style={{ marginTop: '20px', fontSize: '18px' }}>
          {isSad === 1 ? 'The post is Sad 😔' : 'The post is Not Sad 😊'}
        </p>
      )}
    </div>
  );
};

export default SadnessChecker;
