import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      gap: '16px',
      transition: 'background 0.5s ease, color 0.4s ease'
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        border: '3px solid var(--accent-soft)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Loading...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return isLoggedIn ? children : <Navigate to="/" replace />;
}