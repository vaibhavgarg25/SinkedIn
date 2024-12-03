"use client";
import { useState } from 'react';

const SadnessChecker = () => {
  const [post, setPost] = useState('');
  const [isSad, setIsSad] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const analyzePost = async () => {
    if (post.length > 1000) {
      alert("Post is too long. Please shorten it.");
      return;
    }

    setLoading(true);
    setIsSad(null);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/routes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: post }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const data = await response.json();
      if (!data || typeof data.sad !== "boolean") {
        throw new Error("Unexpected API response format");
      }

      setIsSad(data.sad ? 1 : 0);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setErrorMessage("Could not analyze sentiment. Please try again.");
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
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isSad !== null && (
        <p style={{ marginTop: '20px', fontSize: '18px' }}>
          {isSad === 1 ? 'The post is Sad 😔' : 'The post is Not Sad 😊'}
        </p>
      )}
    </div>
  );
};

export default SadnessChecker;
