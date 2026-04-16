import { useNavigate } from 'react-router-dom';
import '../styles/QuestionCard.css';

const API_BASE = 'http://localhost:5000';

export default function QuestionCard({ question }) {
  const navigate = useNavigate();

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 60)  return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    return `${days}d ago`;
  };

  const avatarSrc = question.avatar_url
    ? `${API_BASE}${question.avatar_url}`
    : null;

  return (
    <div
      className={`qcard ${question.is_solved ? 'solved' : ''}`}
      onClick={() => navigate(`/question/${question.id}`)}
    >
      {/* Vote + Answer counts */}
      <div className="qcard-meta">
        <div className={`qcard-stat ${question.vote_score > 0 ? 'positive' : ''}`}>
          <span className="qcard-stat-num">{question.vote_score}</span>
          <span className="qcard-stat-label">votes</span>
        </div>
        <div className={`qcard-stat ${question.is_solved ? 'solved' : question.answer_count > 0 ? 'answered' : ''}`}>
          <span className="qcard-stat-num">{question.answer_count}</span>
          <span className="qcard-stat-label">answers</span>
        </div>
        <div className="qcard-stat">
          <span className="qcard-stat-num">{question.view_count}</span>
          <span className="qcard-stat-label">views</span>
        </div>
      </div>

      {/* Content */}
      <div className="qcard-content">
        <h3 className="qcard-title">{question.title}</h3>
        <p className="qcard-body">
          {question.body?.replace(/<[^>]*>/g, '').slice(0, 150)}...
        </p>

        <div className="qcard-footer">
          <div className="qcard-tags">
            {question.tags?.map(tag => (
              <span key={tag} className="qcard-tag">{tag}</span>
            ))}
          </div>
          <div className="qcard-author">
            <div className="qcard-avatar">
              {avatarSrc ? (
                <img src={avatarSrc} alt={question.user_name} className="qcard-avatar-img" />
              ) : (
                question.user_name?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="qcard-author-name">{question.user_name}</span>
            <span className="qcard-time">{timeAgo(question.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}