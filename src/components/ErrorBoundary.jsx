import React from 'react';
import Logo from './Logo';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error Boundary Caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-main, #F7FAF9)',
            padding: '2rem 1rem',
            fontFamily: 'var(--font-main, sans-serif)'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 50px rgba(6, 78, 73, 0.12)',
              border: '1px solid #E3ECE9',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Logo variant="teal" size="md" />
            </div>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#064E49', margin: '0 0 0.5rem' }}>
              Something Went Wrong
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#5A7570', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
              We encountered an unexpected display error while loading this page. You can reload the page or return to the secure sign-in screen.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '10px',
                  backgroundColor: '#008F83',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} /> Reload Page
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '10px',
                  backgroundColor: '#F0F7F6',
                  color: '#064E49',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid #DCE9E6',
                  cursor: 'pointer'
                }}
              >
                <LogIn size={16} /> Return to Login
              </button>
            </div>

            {this.state.error?.message && (
              <details style={{ marginTop: '1.5rem', textAlign: 'left', fontSize: '0.75rem', color: '#829A95' }}>
                <summary style={{ cursor: 'pointer', outline: 'none' }}>Technical Details</summary>
                <pre style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#F8FAFA', borderRadius: '6px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
