import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/QuestionDetail.css';

export default function QuestionDetail() {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [question,  setQuestion]  = useState(null);
  const [answers,   setAnswers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [answerBody,setAnswerBody]= useState('');
  const [submitting,setSubmitting]= useState(false);
  const [error,     setError]     = useState('');

  const fetchQuestion = async () => {
    try {
      const { data } = await API.get(`/questions/${id}`);
      setQuestion(data.question);
    } catch {
      navigate('/home');
    }
  };

  const fetchAnswers = async () => {
    try {
      const { data } = await API.get(`/answers/${id}`);
      setAnswers(data.answers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchQuestion(), fetchAnswers()]);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (answerBody.trim().length < 10) {
      return setError('Answer must be at least 10 characters');
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post(`/answers/${id}`, { body: answerBody.trim() });
      setAnswerBody('');
      await fetchAnswers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (answerId) => {
    try {
      await API.patch(`/answers/${answerId}/accept`);
      await Promise.all([fetchQuestion(), fetchAnswers()]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept answer');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Delete this answer?')) return;
    try {
      await API.delete(`/answers/${answerId}`);
      await fetchAnswers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const timeAgo = (dateStr) => {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) return (
    <div className="qd-root">
      <Navbar />
      <div className="qd-loading">
        <div className="qd-skeleton title" />
        <div className="qd-skeleton body"  />
        <div className="qd-skeleton body short" />
      </div>
    </div>
  );

  return (
    <div className="qd-root">
      <Navbar />
      <div className="qd-body">

        {/* ── QUESTION ── */}
        <div className="qd-question">

          {/* Header */}
          <div className="qd-q-header">
            {question.is_solved && (
              <span className="qd-solved-badge">✅ Solved</span>
            )}
            <h1 className="qd-q-title">{question.title}</h1>
            <div className="qd-q-meta">
              <span>Asked {timeAgo(question.created_at)}</span>
              <span>·</span>
              <span>{question.view_count} views</span>
              <span>·</span>
              <span>{question.answer_count} answers</span>
            </div>
          </div>

          {/* Body */}
          <div className="qd-q-body">
            {question.body}
          </div>

          {/* Tags + Author */}
          <div className="qd-q-footer">
            <div className="qd-tags">
              {question.tags?.map(tag => (
                <span key={tag} className="qd-tag">{tag}</span>
              ))}
            </div>
            <div className="qd-author-card">
              <div className="qd-author-label">Asked by</div>
              <div className="qd-author-info">
                <div className="qd-avatar">
                  {question.user_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="qd-author-name">{question.user_name}</div>
                  <div className="qd-author-rep">
                    ⭐ {question.reputation} reputation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete question (owner only) */}
          {user?.id === question.user_id && (
            <button
              className="qd-delete-btn"
              onClick={async () => {
                if (!window.confirm('Delete this question?')) return;
                await API.delete(`/questions/${id}`);
                navigate('/home');
              }}
            >
              🗑 Delete Question
            </button>
          )}
        </div>

        {/* ── ANSWERS ── */}
        <div className="qd-answers-section">
          <h2 className="qd-answers-title">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          {answers.length === 0 ? (
            <div className="qd-no-answers">
              <div className="qd-no-answers-icon">💬</div>
              <p>No answers yet. Be the first to help!</p>
            </div>
          ) : (
            answers.map(answer => (
              <div
                key={answer.id}
                className={`qd-answer ${answer.is_accepted ? 'accepted' : ''}`}
              >
                {answer.is_accepted && (
                  <div className="qd-accepted-badge">✅ Accepted Answer</div>
                )}

                <div className="qd-answer-body">{answer.body}</div>

                <div className="qd-answer-footer">
                  <div className="qd-answer-meta">
                    <div className="qd-avatar sm">
                      {answer.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="qd-answer-author">{answer.user_name}</span>
                    <span className="qd-answer-time">
                      {timeAgo(answer.created_at)}
                    </span>
                    <span className="qd-answer-rep">
                      ⭐ {answer.reputation}
                    </span>
                  </div>

                  <div className="qd-answer-actions">
                    {/* Accept button — only question owner */}
                    {user?.id === question.user_id &&
                     !answer.is_accepted && (
                      <button
                        className="qd-accept-btn"
                        onClick={() => handleAccept(answer.id)}
                      >
                        ✓ Accept
                      </button>
                    )}
                    {/* Delete button — answer owner */}
                    {user?.id === answer.user_id && (
                      <button
                        className="qd-delete-ans-btn"
                        onClick={() => handleDeleteAnswer(answer.id)}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── POST ANSWER ── */}
        <div className="qd-post-answer">
          <h2 className="qd-answers-title">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              className={`qd-answer-input ${error ? 'error' : ''}`}
              placeholder="Write your answer here... Be detailed and helpful!"
              value={answerBody}
              onChange={e => { setAnswerBody(e.target.value); setError(''); }}
              rows={8}
            />
            {error && <div className="qd-answer-error">{error}</div>}
            <div className="qd-answer-submit-row">
              <span className="qd-char-count">{answerBody.length} chars</span>
              <button
                type="submit"
                className="qd-submit-btn"
                disabled={submitting}
              >
                {submitting
                  ? <span className="qd-spinner" />
                  : '🚀 Post Answer'
                }
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}