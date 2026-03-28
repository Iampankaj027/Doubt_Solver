import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate('/home')} style={{cursor:'pointer'}}>
        <div className="nav-logo">🎓</div>
        <div className="nav-brand">
          <span className="nav-brand-name">DoubtSolver</span>
          <span className="nav-brand-sub">Academic Community</span>
        </div>
      </div>

      <div className="nav-center">
        <div className="nav-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search anything..." />
        </div>
      </div>

      <div className="nav-right">
        <button className="nav-ask-btn" onClick={() => navigate('/ask')}>
          + Ask
        </button>
        <div className="nav-avatar" onClick={() => navigate('/profile')}>
          {initials}
        </div>
        <button className="nav-logout" onClick={handleLogout} title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </nav>
  );
}