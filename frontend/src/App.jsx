import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute     from './components/ProtectedRoute';
import Auth               from './pages/Auth';
import Home               from './pages/Home';
import AskQuestion        from './pages/AskQuestion';
import QuestionDetail     from './pages/QuestionDetail';
import Profile            from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/ask" element={
              <ProtectedRoute><AskQuestion /></ProtectedRoute>
            } />
            <Route path="/question/:id" element={
              <ProtectedRoute><QuestionDetail /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;