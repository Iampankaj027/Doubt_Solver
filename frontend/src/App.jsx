import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute    from './components/ProtectedRoute';
import Auth              from './pages/Auth';
import Home              from './pages/Home';
import AskQuestion       from './pages/AskQuestion';
import QuestionDetail    from './pages/QuestionDetail';

function App() {
  return (
    <AuthProvider>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;