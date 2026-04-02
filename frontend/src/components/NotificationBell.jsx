import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import '../styles/NotificationBell.css';

export default function NotificationBell() {
  const navigate  = useNavigate();
  const { notifications, setNotifications, unreadCount, setUnreadCount, clearUnread } = useSocket();
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch notifications from DB on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/notifications');
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const handleOpen = async () => {
    setOpen(prev => !prev);
    if (!open && unreadCount > 0) {
      try {
        await API.patch('/notifications');
        clearUnread();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClick = (notif) => {
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'just now';
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return 'just now';
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'answer':  return '💬';
      case 'upvote':  return '⬆️';
      case 'comment': return '🗨️';
      case 'reply':   return '↩️';
      default:        return '🔔';
    }
  };

  return (
    <div className="notif-wrap" ref={ref}>
      {/* Bell button */}
      <button className="notif-bell" onClick={handleOpen}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span className="notif-header-title">Notifications</span>
            {unreadCount === 0 && (
              <span className="notif-header-sub">All caught up!</span>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <div className="notif-empty-icon">🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif, i) => (
                <div
                  key={notif.id || i}
                  className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                  onClick={() => handleClick(notif)}
                >
                  <div className="notif-icon">{getIcon(notif.type)}</div>
                  <div className="notif-content">
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-time">{timeAgo(notif.created_at)}</div>
                  </div>
                  <button
                    className="notif-delete"
                    onClick={(e) => handleDelete(e, notif.id)}
                    title="Remove"
                  >×</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}