import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/AskQuestion.css';

const PREDEFINED_TAGS = [
  'DSA','DBMS','OS','CN','OOP',
  'Web Dev','AI/ML','Mathematics','Physics','General'
];

export default function AskQuestion() {
  const navigate = useNavigate();

  const [title,       setTitle]       = useState('');
  const [body,        setBody]        = useState('');
  const [selectedTags,setSelectedTags]= useState([]);
  const [customTag,   setCustomTag]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState({});

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : prev.length < 5
          ? [...prev, tag]
          : prev
    );
  };

  const addCustomTag = (e) => {
    e.preventDefault();
    const tag = customTag.trim();
    if (!tag) return;
    if (selectedTags.length >= 5) return;
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
    setCustomTag('');
  };

  const removeTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim())        errs.title = 'Title is required';
    if (title.length < 10)    errs.title = 'Title must be at least 10 characters';
    if (!body.trim())         errs.body  = 'Description is required';
    if (body.length < 20)     errs.body  = 'Description must be at least 20 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await API.post('/questions', {
        title: title.trim(),
        body:  body.trim(),
        tags:  selectedTags
      });
      navigate(`/question/${data.questionId}`);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to post question' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-root">
      <Navbar />
      <div className="ask-body">

        {/* Left — Form */}
        <div className="ask-main">
          <div className="ask-header">
            <h1 className="ask-title">Ask a Question</h1>
            <p className="ask-sub">Get help from 50,000+ students in your community</p>
          </div>

          <form className="ask-form" onSubmit={handleSubmit}>

            {/* Title */}
            <div className="ask-field">
              <label className="ask-label">
                Question Title
                <span className="ask-label-hint">Be specific and clear</span>
              </label>
              <input
                className={`ask-input ${errors.title ? 'error' : ''}`}
                type="text"
                placeholder="e.g. How does binary search work in a sorted array?"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(p => ({...p, title: ''})); }}
                maxLength={300}
              />
              <div className="ask-input-footer">
                {errors.title
                  ? <span className="ask-error">{errors.title}</span>
                  : <span />
                }
                <span className="ask-char-count">{title.length}/300</span>
              </div>
            </div>

            {/* Body */}
            <div className="ask-field">
              <label className="ask-label">
                Detailed Description
                <span className="ask-label-hint">Explain your doubt clearly</span>
              </label>
              <textarea
                className={`ask-textarea ${errors.body ? 'error' : ''}`}
                placeholder="Describe your doubt in detail. Include what you've already tried, what you expected, and what actually happened..."
                value={body}
                onChange={e => { setBody(e.target.value); setErrors(p => ({...p, body: ''})); }}
                rows={10}
              />
              <div className="ask-input-footer">
                {errors.body
                  ? <span className="ask-error">{errors.body}</span>
                  : <span />
                }
                <span className="ask-char-count">{body.length} chars</span>
              </div>
            </div>

            {/* Tags */}
            <div className="ask-field">
              <label className="ask-label">
                Tags
                <span className="ask-label-hint">Add up to 5 tags</span>
              </label>

              {/* Selected tags */}
              {selectedTags.length > 0 && (
                <div className="selected-tags">
                  {selectedTags.map(tag => (
                    <span key={tag} className="selected-tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="remove-tag"
                      >×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Predefined tags */}
              <div className="predefined-tags">
                {PREDEFINED_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`pre-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Custom tag input */}
              <div className="custom-tag-row">
                <input
                  className="ask-input small"
                  type="text"
                  placeholder="Add custom tag..."
                  value={customTag}
                  onChange={e => setCustomTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomTag(e)}
                  maxLength={30}
                />
                <button
                  type="button"
                  className="add-tag-btn"
                  onClick={addCustomTag}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="ask-submit-error">{errors.submit}</div>
            )}

            {/* Buttons */}
            <div className="ask-actions">
              <button
                type="button"
                className="ask-cancel-btn"
                onClick={() => navigate('/home')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ask-submit-btn"
                disabled={loading}
              >
                {loading
                  ? <span className="ask-spinner" />
                  : '🚀 Post Question'
                }
              </button>
            </div>

          </form>
        </div>

        {/* Right — Tips */}
        <aside className="ask-tips">
          <div className="tips-card">
            <div className="tips-title">✅ Writing a good question</div>
            <ul className="tips-list">
              <li>Summarize your problem in the title</li>
              <li>Describe what you expected vs what happened</li>
              <li>Include relevant code or formulas</li>
              <li>Show what you've already tried</li>
              <li>Add relevant tags for better visibility</li>
            </ul>
          </div>

          <div className="tips-card">
            <div className="tips-title">🏷️ Tag Guidelines</div>
            <ul className="tips-list">
              <li>Add up to 5 tags</li>
              <li>Use subject-specific tags (DSA, OS)</li>
              <li>Be specific — good tags get faster answers</li>
            </ul>
          </div>

          <div className="tips-card preview-card">
            <div className="tips-title">👁️ Preview</div>
            <div className="preview-title">
              {title || 'Your question title will appear here...'}
            </div>
            <div className="preview-tags">
              {selectedTags.map(t => (
                <span key={t} className="preview-tag">{t}</span>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}