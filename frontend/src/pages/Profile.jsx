import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const API_BASE = 'http://localhost:5000';

export default function Profile() {
  const { id }           = useParams();
  const { user, login, token } = useAuth();
  const navigate         = useNavigate();
  const fileInputRef     = useRef(null);

  const profileId = id || user?.id;
  const isOwner   = user?.id === Number(profileId);

  const [profile,   setProfile]   = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saveMsg,   setSaveMsg]   = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [editName,   setEditName]   = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editYear,   setEditYear]   = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/auth/profile/${profileId}`);
        setProfile(data.user);
        setQuestions(data.questions);
        setAnswers(data.answers);
        setStats(data.stats);
        setEditName(data.user.name || '');
        setEditBranch(data.user.branch || '');
        setEditYear(data.user.year || '');
      } catch {
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    if (profileId) fetchProfile();
  }, [profileId]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const { data } = await API.put('/auth/profile', {
        name:   editName,
        branch: editBranch,
        year:   editYear ? Number(editYear) : null
      });
      setProfile(data.user);
      // Update global auth context
      login(data.user, token, true);
      setSaveMsg('Profile updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (isOwner && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setSaveMsg('Only JPEG, PNG, GIF, or WebP images allowed');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMsg('Image must be under 5MB');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await API.post('/auth/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(data.user);
      login(data.user, token, true);
      setSaveMsg('Avatar updated!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Failed to upload avatar');
      setTimeout(() => setSaveMsg(''), 3000);
    } finally {
      setAvatarUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const timeAgo = (dateStr) => {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const days  = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    if (months > 0) return `${months}mo ago`;
    if (days > 0)   return `${days}d ago`;
    return 'Today';
  };

  const avatarSrc = profile?.avatar_url
    ? `${API_BASE}${profile.avatar_url}`
    : null;

  if (loading) return (
    <div className="prof-root">
      <Navbar />
      <div className="prof-loading">
        <div className="prof-skel header" />
        <div className="prof-skel body"   />
      </div>
    </div>
  );

  return (
    <div className="prof-root">
      <Navbar />
      <div className="prof-body">

        {/* ── LEFT: Profile Card ── */}
        <aside className="prof-sidebar">

          {/* Avatar */}
          <div className="prof-card">
            <div
              className={`prof-avatar ${isOwner ? 'editable' : ''} ${avatarUploading ? 'uploading' : ''}`}
              onClick={handleAvatarClick}
              title={isOwner ? 'Click to change avatar' : ''}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={profile?.name}
                  className="prof-avatar-img"
                />
              ) : (
                profile?.name?.charAt(0).toUpperCase()
              )}

              {/* Upload overlay — owner only */}
              {isOwner && (
                <div className="prof-avatar-overlay">
                  {avatarUploading ? (
                    <div className="prof-avatar-spinner" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div className="prof-name">{profile?.name}</div>
            <div className="prof-email">{profile?.email}</div>
            {profile?.branch && (
              <div className="prof-badge">{profile.branch}{profile.year ? ` · Year ${profile.year}` : ''}</div>
            )}
            <div className="prof-joined">
              Joined {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>

            {/* Avatar upload message */}
            {saveMsg && (
              <div className={`prof-save-msg ${saveMsg.includes('!') ? 'success' : 'error'}`} style={{ marginTop: 12 }}>
                {saveMsg}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="prof-card">
            <div className="prof-card-title">Stats</div>
            <div className="prof-stats">
              <div className="prof-stat">
                <div className="prof-stat-num">{profile?.reputation || 0}</div>
                <div className="prof-stat-label">Reputation</div>
              </div>
              <div className="prof-stat">
                <div className="prof-stat-num">{stats?.total_questions || 0}</div>
                <div className="prof-stat-label">Questions</div>
              </div>
              <div className="prof-stat">
                <div className="prof-stat-num">{stats?.total_answers || 0}</div>
                <div className="prof-stat-label">Answers</div>
              </div>
              <div className="prof-stat">
                <div className="prof-stat-num">{stats?.accepted_answers || 0}</div>
                <div className="prof-stat-label">Accepted</div>
              </div>
            </div>
          </div>

          {/* Edit Profile — owner only */}
          {isOwner && (
            <div className="prof-card">
              <div className="prof-card-title">Edit Profile</div>
              {!editing ? (
                <button className="prof-edit-btn" onClick={() => setEditing(true)}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="prof-edit-form">
                  <div className="prof-field">
                    <label className="prof-label">Name</label>
                    <input
                      className="prof-input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Branch</label>
                    <input
                      className="prof-input"
                      value={editBranch}
                      onChange={e => setEditBranch(e.target.value)}
                      placeholder="e.g. CSE, ECE"
                    />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Year</label>
                    <input
                      className="prof-input"
                      type="number"
                      value={editYear}
                      onChange={e => setEditYear(e.target.value)}
                      placeholder="1-4"
                      min={1} max={4}
                    />
                  </div>
                  <div className="prof-edit-actions">
                    <button
                      className="prof-cancel-btn"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="prof-save-btn"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ── RIGHT: Activity ── */}
        <main className="prof-main">

          {/* Tabs */}
          <div className="prof-tabs">
            <button
              className={`prof-tab ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions ({stats?.total_questions || 0})
            </button>
            <button
              className={`prof-tab ${activeTab === 'answers' ? 'active' : ''}`}
              onClick={() => setActiveTab('answers')}
            >
              Answers ({stats?.total_answers || 0})
            </button>
          </div>

          {/* Questions tab */}
          {activeTab === 'questions' && (
            <div className="prof-list">
              {questions.length === 0 ? (
                <div className="prof-empty">
                  <div className="prof-empty-icon">🤔</div>
                  <p>No questions asked yet</p>
                  <button
                    className="prof-ask-btn"
                    onClick={() => navigate('/ask')}
                  >
                    Ask your first question
                  </button>
                </div>
              ) : (
                questions.map(q => (
                  <div
                    key={q.id}
                    className={`prof-item ${q.is_solved ? 'solved' : ''}`}
                    onClick={() => navigate(`/question/${q.id}`)}
                  >
                    <div className="prof-item-stats">
                      <span className={`prof-item-stat ${q.vote_score > 0 ? 'positive' : ''}`}>
                        {q.vote_score} votes
                      </span>
                      <span className={`prof-item-stat ${q.is_solved ? 'solved' : q.answer_count > 0 ? 'answered' : ''}`}>
                        {q.answer_count} answers
                      </span>
                      <span className="prof-item-stat muted">
                        {q.view_count} views
                      </span>
                    </div>
                    <div className="prof-item-content">
                      <div className="prof-item-title">{q.title}</div>
                      <div className="prof-item-meta">
                        <div className="prof-item-tags">
                          {q.tags?.map(t => (
                            <span key={t} className="prof-item-tag">{t}</span>
                          ))}
                        </div>
                        <span className="prof-item-time">{timeAgo(q.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Answers tab */}
          {activeTab === 'answers' && (
            <div className="prof-list">
              {answers.length === 0 ? (
                <div className="prof-empty">
                  <div className="prof-empty-icon">💬</div>
                  <p>No answers given yet</p>
                </div>
              ) : (
                answers.map(a => (
                  <div
                    key={a.id}
                    className={`prof-item ${a.is_accepted ? 'solved' : ''}`}
                    onClick={() => navigate(`/question/${a.question_id}`)}
                  >
                    <div className="prof-item-stats">
                      <span className={`prof-item-stat ${a.vote_score > 0 ? 'positive' : ''}`}>
                        {a.vote_score} votes
                      </span>
                      {a.is_accepted && (
                        <span className="prof-item-stat solved">✓ accepted</span>
                      )}
                    </div>
                    <div className="prof-item-content">
                      <div className="prof-item-title">{a.question_title}</div>
                      <div className="prof-item-body">
                        {a.body?.slice(0, 120)}...
                      </div>
                      <div className="prof-item-time">{timeAgo(a.created_at)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}