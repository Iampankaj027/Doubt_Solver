import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../styles/VoteButtons.css';

export default function VoteButtons({
  targetType,
  targetId,
  initialScore,
  initialVote = null,
  onVote
}) {
  const { isLoggedIn } = useAuth();
  const [score,       setScore]       = useState(initialScore || 0);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [loading,     setLoading]     = useState(false);

  const handleVote = async (voteType) => {
    if (!isLoggedIn) return alert('Please login to vote');
    if (loading) return;

    setLoading(true);
    try {
      const { data } = await API.post('/votes', {
        target_type: targetType,
        target_id:   targetId,
        vote_type:   voteType
      });

      setScore(data.new_score);

      if (data.action === 'removed') {
        setCurrentVote(null);
      } else {
        setCurrentVote(voteType);
      }

      if (onVote) onVote(data.new_score);

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-wrap">
      {/* Upvote */}
      <button
        className={`vote-btn up ${currentVote === 'up' ? 'active' : ''}`}
        onClick={() => handleVote('up')}
        disabled={loading}
        title="Upvote"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>

      {/* Score */}
      <span className={`vote-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}>
        {score}
      </span>

      {/* Downvote */}
      <button
        className={`vote-btn down ${currentVote === 'down' ? 'active' : ''}`}
        onClick={() => handleVote('down')}
        disabled={loading}
        title="Downvote"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </div>
  );
}