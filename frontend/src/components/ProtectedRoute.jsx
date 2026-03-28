import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#06030a', color: '#f7eef3',
      fontFamily: 'Outfit, sans-serif', fontSize: '14px'
    }}>
      Loading...
    </div>
  );

  return isLoggedIn ? children : <Navigate to="/" replace />;
}