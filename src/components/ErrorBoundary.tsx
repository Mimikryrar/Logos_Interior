import React from 'react';

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
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
            marginBottom: '1.5rem',
          }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: '1.25rem',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
          }}>
            The oracle has encountered an unexpected disturbance.
          </p>

          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(26,26,26,0.5)',
            marginBottom: '2rem',
          }}>
            Please refresh the page to continue.
          </p>

          <button
            onClick={() => window.location.reload()}
            style={{
              border: '1px solid #d4af7a',
              color: '#d4af7a',
              background: 'transparent',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
