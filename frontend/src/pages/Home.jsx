import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import '../styles/Home.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page });
      if (search) params.append('search', search);
      if (activeTag) params.append('tag', activeTag);

      const { data } = await API.get(`/questions?${params}`);
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const { data } = await API.get('/questions/tags');
      setTags(data.tags);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTags(); }, []);
  useEffect(() => { fetchQuestions(); }, [sort, activeTag, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  return (
    <div className="home-root">
      <Navbar />
      <div className="home-body">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">Browse Tags</div>
            <div className="tag-list">
              <button
                className={`tag-btn ${activeTag === '' ? 'active' : ''}`}
                onClick={() => { setActiveTag(''); setPage(1); }}
              >
                All Questions
              </button>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className={`tag-btn ${activeTag === tag.name ? 'active' : ''}`}
                  onClick={() => { setActiveTag(tag.name); setPage(1); }}
                >
                  {tag.name}
                  <span className="tag-count">{tag.usage_count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-card stats-card">
            <div className="sidebar-title">Your Stats</div>
            <div className="user-stat">
              <span className="user-stat-label">Reputation</span>
              <span className="user-stat-value">{user?.reputation || 0}</span>
            </div>
            <div className="user-stat">
              <span className="user-stat-label">Member since</span>
              <span className="user-stat-value">
                {user?.created_at ? new Date(user.created_at).getFullYear() : '2025'}
              </span>
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className="feed">

          {/* Search + Sort bar */}
          <div className="feed-header">
            <form className="search-bar" onSubmit={handleSearch}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <div className="sort-bar">
              {['newest', 'votes', 'unanswered'].map(s => (
                <button
                  key={s}
                  className={`sort-btn ${sort === s ? 'active' : ''}`}
                  onClick={() => { setSort(s); setPage(1); }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <button
              className="ask-btn"
              onClick={() => navigate('/ask')}
            >
              + Ask Question
            </button>
          </div>

          {/* Questions list */}
          {loading ? (
            <div className="loading-state">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤔</div>
              <h3>No questions found</h3>
              <p>Be the first to ask a question!</p>
              <button className="ask-btn" onClick={() => navigate('/ask')}>
                Ask Question
              </button>
            </div>
          ) : (
            <>
              {questions.map(q => (
                <QuestionCard key={q.id} question={q} />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="page-btn"
                  >
                    ← Prev
                  </button>
                  <span className="page-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}