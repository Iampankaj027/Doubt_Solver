import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, isLoggedIn } = useAuth();
  const [socket,      setSocket]      = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    // Connect to socket
    const s = io('http://localhost:5000', {
      transports: ['websocket']
    });

    s.on('connect', () => {
      console.log('🔌 Socket connected');
      s.emit('join', user.id);
    });

    // Listen for new notifications
    s.on('notification', (notification) => {
      setNotifications(prev => [{ ...notification, id: Date.now(), is_read: false }, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Browser notification (if permitted)
      if (Notification.permission === 'granted') {
        new Notification('KNOT', {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [isLoggedIn, user]);

  const clearUnread = () => setUnreadCount(0);

  return (
    <SocketContext.Provider value={{
      socket,
      notifications,
      setNotifications,
      unreadCount,
      setUnreadCount,
      clearUnread
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);