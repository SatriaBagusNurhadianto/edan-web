import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('EDAN ErrorBoundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: '#32283d' }}>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 28 }}>Terjadi kesalahan</h1>
          <p style={{ color: '#776d7f', marginTop: 8 }}>Muat ulang halaman atau coba lagi nanti.</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '10px 16px', background: '#e94e9b', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            Muat ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
