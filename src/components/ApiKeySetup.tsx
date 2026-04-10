import React, { useState } from 'react';

interface ApiKeySetupProps {
  onKeySet: (key: string) => void;
}

export default function ApiKeySetup({ onKeySet }: ApiKeySetupProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.startsWith('AIza')) {
      setError('Invalid key — Gemini API keys start with "AIza".');
      return;
    }
    localStorage.setItem('logos-gemini-key', key);
    onKeySet(key);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f2ed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontSize: '4rem',
        color: '#1a1a1a',
        lineHeight: 1,
        marginBottom: '1.5rem',
      }}>
        λόγος
      </h1>

      <div style={{
        width: '4rem',
        height: '1px',
        backgroundColor: '#d4af7a',
        marginBottom: '2rem',
      }} />

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontSize: '1.5rem',
          color: '#1a1a1a',
          marginBottom: '0.75rem',
        }}>
          Enter your Gemini API Key
        </h2>

        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(26,26,26,0.6)',
          lineHeight: 1.6,
          marginBottom: '0.5rem',
        }}>
          Your key is stored locally in your browser and never sent to our servers — only directly to Google's Gemini API.
        </p>

        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            color: '#d4af7a',
            marginBottom: '1.75rem',
            textDecoration: 'none',
          }}
        >
          Get your free key at aistudio.google.com/apikey →
        </a>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(''); }}
            placeholder="AIza..."
            autoComplete="off"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e0d8',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#d4af7a')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e0d8')}
          />

          {error && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', textAlign: 'left', margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: '0.75rem',
              border: '1px solid #d4af7a',
              borderRadius: '9999px',
              backgroundColor: '#d4af7a',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
