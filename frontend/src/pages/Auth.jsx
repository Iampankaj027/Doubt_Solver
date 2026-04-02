import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Auth() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/home');
  }, [isLoggedIn]);

  const showToast = (msg, type = 'loading', duration = 3500) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = `knot-toast ${type} show`;
    if (duration) setTimeout(() => t.classList.remove('show'), duration);
  };

  const setFieldError = (inputId, errId, msg) => {
    const inp = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (msg) {
      inp?.classList.add('error');
      if (err) { err.textContent = msg; err.style.display = 'block'; }
    } else {
      inp?.classList.remove('error');
      if (err) err.style.display = 'none';
    }
  };

  const setBtnLoading = (btnId, isLoading, originalHTML) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = `<span class="knot-spinner"></span> Please wait...`;
    } else {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const email    = document.getElementById('signinEmail')?.value.trim();
    const password = document.getElementById('pw1')?.value;
    const remember = document.getElementById('rememberMe')?.checked;

    setFieldError('signinEmail', 'signinEmailErr', '');
    setFieldError('pw1', 'signinPwErr', '');

    if (!email)    return setFieldError('signinEmail', 'signinEmailErr', 'Email is required');
    if (!password) return setFieldError('pw1', 'signinPwErr', 'Password is required');

    const originalHTML = `Sign in →`;
    setBtnLoading('signinBtn', true, originalHTML);
    showToast('Signing you in...', 'loading', 0);

    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.user, data.token, remember);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      setTimeout(() => navigate('/home'), 1200);
    } catch (err) {
      setBtnLoading('signinBtn', false, originalHTML);
      const msg = err.response?.data?.message || 'Invalid credentials';
      setFieldError('pw1', 'signinPwErr', msg);
      showToast(msg, 'error');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const name     = document.getElementById('signupName')?.value.trim();
    const email    = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('pw2')?.value;
    const branch   = document.getElementById('signupBranch')?.value.trim();

    setFieldError('signupName',  'signupNameErr',  '');
    setFieldError('signupEmail', 'signupEmailErr', '');
    setFieldError('pw2',         'signupPwErr',    '');

    if (!name)               return setFieldError('signupName',  'signupNameErr',  'Name is required');
    if (!email)              return setFieldError('signupEmail', 'signupEmailErr', 'Email is required');
    if (password.length < 6) return setFieldError('pw2',        'signupPwErr',    'Min 6 characters');

    const originalHTML = `Create account →`;
    setBtnLoading('signupBtn', true, originalHTML);
    showToast('Creating your account...', 'loading', 0);

    try {
      const { data } = await API.post('/auth/signup', { name, email, password, branch: branch || undefined });
      login(data.user, data.token, true);
      showToast(`Welcome to KNOT, ${data.user.name}!`, 'success');
      setTimeout(() => navigate('/home'), 1200);
    } catch (err) {
      setBtnLoading('signupBtn', false, originalHTML);
      const msg = err.response?.data?.message || 'Signup failed';
      if (msg.toLowerCase().includes('email')) setFieldError('signupEmail', 'signupEmailErr', msg);
      else setFieldError('pw2', 'signupPwErr', msg);
      showToast(msg, 'error');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail')?.value.trim();
    if (!email) return setFieldError('signinEmail', 'signinEmailErr', 'Enter your email first');
    showToast('Sending reset link...', 'loading', 0);
    try {
      await API.post('/auth/forgot-password', { email });
      showToast('Reset link sent! Check your email', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Email not found', 'error');
    }
  };

  useEffect(() => {
    window.switchTab = (tab) => {
      const pill  = document.getElementById('tabPill');
      const btnIn = document.getElementById('btnSignin');
      const btnUp = document.getElementById('btnSignup');
      const fIn   = document.getElementById('fSignin');
      const fUp   = document.getElementById('fSignup');
      if (tab === 'signin') {
        pill?.classList.remove('right');
        btnIn?.classList.add('active'); btnUp?.classList.remove('active');
        fIn?.classList.remove('hidden'); fUp?.classList.add('hidden');
      } else {
        pill?.classList.add('right');
        btnUp?.classList.add('active'); btnIn?.classList.remove('active');
        fUp?.classList.remove('hidden'); fIn?.classList.add('hidden');
      }
    };
    window.togglePw = (id, btn) => {
      const inp = document.getElementById(id);
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.style.color = inp.type === 'text' ? '#FF4500' : '#9ca3af';
    };
    window.handleSignin = handleSignin;
    window.handleSignup = handleSignup;
    window.handleForgot = handleForgot;
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: authHTML }} />;
}

const authHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  .knot-auth * { box-sizing: border-box; margin: 0; padding: 0; }

  .knot-auth {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'IBM Plex Sans', sans-serif;
    background: #fff;
  }

  /* ── LEFT PANEL ── */
  .knot-left {
    background: #FFF8F5;
    border-right: 1px solid #FFE4D6;
    padding: 48px 56px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .knot-brand {
    font-size: 26px;
    font-weight: 900;
    color: #FF4500;
    letter-spacing: -1px;
    text-transform: uppercase;
  }

  .knot-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0; }

  .knot-eyebrow {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
  }
  .knot-eyebrow-line {
    width: 28px; height: 2px;
    background: #FF4500;
    border-radius: 2px;
  }
  .knot-eyebrow-text {
    font-size: 11px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: #FF4500;
  }

  .knot-heading {
    font-family: 'IBM Plex Serif', serif;
    font-size: clamp(36px, 4vw, 54px);
    font-weight: 300;
    line-height: 1.15;
    color: #1C1C1C;
    margin-bottom: 20px;
  }
  .knot-heading em { font-style: italic; color: #FF4500; }
  .knot-heading .gold { color: #E07000; }

  .knot-desc {
    font-size: 15px; font-weight: 300;
    color: #6B6B6B; line-height: 1.7;
    max-width: 360px; margin-bottom: 40px;
  }

  .knot-stats {
    display: flex; gap: 0;
    border: 1px solid #FFE4D6;
    border-radius: 8px; overflow: hidden;
    background: #fff; max-width: 380px;
  }
  .knot-stat {
    flex: 1; padding: 16px 20px;
    border-right: 1px solid #FFE4D6;
  }
  .knot-stat:last-child { border-right: none; }
  .knot-stat-num {
    font-family: 'IBM Plex Serif', serif;
    font-size: 22px; font-weight: 400;
    color: #FF4500; line-height: 1;
  }
  .knot-stat-label {
    font-size: 11px; color: #9ca3af;
    margin-top: 4px; letter-spacing: 0.3px;
  }

  .knot-testimonial {
    display: flex; align-items: center; gap: 12px;
    background: #fff; border: 1px solid #FFE4D6;
    border-radius: 40px; padding: 8px 16px 8px 8px;
    max-width: fit-content; margin-top: 20px;
  }
  .knot-testi-avatars { display: flex; }
  .knot-testi-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: #FF4500;
    border: 2px solid #FFF8F5;
    margin-right: -8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: white; font-weight: 700;
  }
  .knot-testi-avatars .knot-testi-avatar:last-child { margin-right: 0; }
  .knot-testi-text { font-size: 12px; color: #6B6B6B; }
  .knot-testi-text strong { color: #1C1C1C; font-weight: 600; }

  .knot-footer { font-size: 11px; color: #9ca3af; }

  /* ── RIGHT PANEL ── */
  .knot-right {
    background: #fff;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 56px;
    position: relative;
  }

  /* Theme toggle */
  .knot-theme-btn {
    position: absolute; top: 24px; right: 24px;
    width: 36px; height: 36px;
    background: none; border: 1px solid #EDEFF1;
    border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #878A8C; transition: all 0.2s;
  }
  .knot-theme-btn:hover { border-color: #FF4500; color: #FF4500; }

  .knot-form-wrap { width: 100%; max-width: 400px; }

  /* Tabs */
  .knot-tabs {
    display: flex; gap: 0;
    border-bottom: 2px solid #EDEFF1;
    margin-bottom: 32px; position: relative;
  }
  .knot-tab-pill {
    position: absolute; bottom: -2px; left: 0;
    width: 50%; height: 2px;
    background: #FF4500;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .knot-tab-pill.right { transform: translateX(100%); }

  .knot-tab-btn {
    flex: 1; padding: 12px 0;
    background: none; border: none;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    color: #9ca3af; cursor: pointer;
    transition: color 0.2s; text-align: center;
  }
  .knot-tab-btn.active { color: #FF4500; font-weight: 700; }

  .knot-form-title {
    font-family: 'IBM Plex Serif', serif;
    font-size: 26px; font-weight: 400;
    color: #1C1C1C; margin-bottom: 4px;
  }
  .knot-form-sub {
    font-size: 13px; color: #9ca3af;
    margin-bottom: 24px; font-weight: 300;
  }

  /* Fields */
  .knot-field { margin-bottom: 14px; }
  .knot-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    color: #6B6B6B; margin-bottom: 6px;
  }
  .knot-input-wrap { position: relative; display: flex; align-items: center; }
  .knot-input-icon {
    position: absolute; left: 12px;
    width: 14px; height: 14px;
    color: #9ca3af; pointer-events: none;
  }
  .knot-input {
    width: 100%; padding: 12px 12px 12px 38px;
    background: #F6F7F8;
    border: 1px solid #EDEFF1;
    border-radius: 6px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 14px; color: #1C1C1C; outline: none;
    transition: all 0.2s;
  }
  .knot-input::placeholder { color: #9ca3af; }
  .knot-input:focus {
    background: #fff; border-color: #FF4500;
    box-shadow: 0 0 0 2px rgba(255,69,0,0.12);
  }
  .knot-input.error { border-color: #FF4500; background: #FFF5F2; }
  .knot-field-error {
    font-size: 11px; color: #FF4500;
    margin-top: 5px; display: none; padding-left: 2px;
  }
  .knot-eye {
    position: absolute; right: 10px;
    background: none; border: none; cursor: pointer;
    color: #9ca3af; display: flex; align-items: center;
    padding: 4px; transition: color 0.2s;
  }
  .knot-eye:hover { color: #FF4500; }

  /* Meta row */
  .knot-meta {
    display: flex; justify-content: space-between;
    align-items: center; margin: 16px 0 20px;
  }
  .knot-check-wrap { display: flex; align-items: center; gap: 7px; cursor: pointer; }
  .knot-check {
    width: 15px; height: 15px;
    background: #F6F7F8; border: 1px solid #EDEFF1;
    border-radius: 3px; appearance: none; cursor: pointer;
    position: relative; transition: all 0.2s; flex-shrink: 0;
  }
  .knot-check:checked { background: #FF4500; border-color: #FF4500; }
  .knot-check:checked::after {
    content: ''; position: absolute; left: 4px; top: 1px;
    width: 5px; height: 8px;
    border: 2px solid white; border-top: none; border-left: none;
    transform: rotate(40deg);
  }
  .knot-check-label { font-size: 12px; color: #6B6B6B; }
  .knot-forgot {
    font-size: 12px; color: #FF4500; text-decoration: none;
    font-weight: 500; transition: opacity 0.2s;
  }
  .knot-forgot:hover { opacity: 0.7; }

  /* Submit button */
  .knot-submit {
    width: 100%; padding: 13px;
    background: #FF4500; border: none;
    border-radius: 6px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    color: white; cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.3px;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .knot-submit:hover:not(:disabled) {
    background: #E03D00;
    box-shadow: 0 4px 16px rgba(255,69,0,0.3);
    transform: translateY(-1px);
  }
  .knot-submit:active { transform: translateY(0); }
  .knot-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Divider */
  .knot-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0;
  }
  .knot-div-line { flex: 1; height: 1px; background: #EDEFF1; }
  .knot-div-text { font-size: 11px; color: #9ca3af; letter-spacing: 1px; text-transform: uppercase; }

  /* Social */
  .knot-social { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .knot-social-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px; background: #F6F7F8;
    border: 1px solid #EDEFF1; border-radius: 6px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    color: #6B6B6B; cursor: pointer; transition: all 0.2s;
  }
  .knot-social-btn:hover {
    background: #fff; border-color: #FF4500;
    color: #1C1C1C;
  }
  .knot-social-note {
    text-align: center; margin-top: 8px;
    font-size: 11px; color: #9ca3af;
  }

  .knot-footer-link {
    text-align: center; margin-top: 20px;
    font-size: 13px; color: #9ca3af;
  }
  .knot-footer-link a {
    color: #FF4500; text-decoration: none; font-weight: 600;
  }
  .knot-footer-link a:hover { text-decoration: underline; }

  .knot-hidden { display: none; }

  /* Spinner */
  .knot-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white; border-radius: 50%;
    animation: knotSpin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes knotSpin { to { transform: rotate(360deg); } }

  /* Toast */
  .knot-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(60px);
    z-index: 9999; padding: 12px 22px;
    border-radius: 6px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    border: 1px solid; opacity: 0;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events: none; white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .knot-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .knot-toast.success { background: #F0FFF4; border-color: #86EFAC; color: #166534; }
  .knot-toast.error   { background: #FFF5F2; border-color: #FFB4A0; color: #FF4500; }
  .knot-toast.loading { background: #FFF8F5; border-color: #FFD0BC; color: #E03D00; }

  @media (max-width: 768px) {
    .knot-auth { grid-template-columns: 1fr; }
    .knot-left { display: none; }
    .knot-right { padding: 32px 24px; }
  }
</style>

<div class="knot-toast" id="toast"></div>

<div class="knot-auth">

  <!-- LEFT -->
  <div class="knot-left">
    <div class="knot-brand">KNOT</div>

    <div class="knot-hero">
      <div class="knot-eyebrow">
        <div class="knot-eyebrow-line"></div>
        <span class="knot-eyebrow-text">Est. for Curious Minds</span>
      </div>
      <h1 class="knot-heading">
        Where every<br />
        <em>question</em> finds<br />
        its <span class="gold">answer.</span>
      </h1>
      <p class="knot-desc">
        Join 50,000+ students collaborating, learning, and solving academic doubts together — from your college community, to the world.
      </p>
      <div class="knot-stats">
        <div class="knot-stat">
          <div class="knot-stat-num">50K+</div>
          <div class="knot-stat-label">Doubts solved</div>
        </div>
        <div class="knot-stat">
          <div class="knot-stat-num">120+</div>
          <div class="knot-stat-label">Colleges</div>
        </div>
        <div class="knot-stat">
          <div class="knot-stat-num">4.9★</div>
          <div class="knot-stat-label">Student rating</div>
        </div>
      </div>
      <div class="knot-testimonial">
        <div class="knot-testi-avatars">
          <div class="knot-testi-avatar">A</div>
          <div class="knot-testi-avatar">R</div>
          <div class="knot-testi-avatar">K</div>
        </div>
        <div class="knot-testi-text">
          <strong>3,200 students</strong> joined this week
        </div>
      </div>
    </div>

    <div class="knot-footer">© 2025 KNOT. Built for scholars.</div>
  </div>

  <!-- RIGHT -->
  <div class="knot-right">

    <div class="knot-form-wrap">
      <!-- Tabs -->
      <div class="knot-tabs">
        <div class="knot-tab-pill" id="tabPill"></div>
        <button class="knot-tab-btn active" id="btnSignin" onclick="switchTab('signin')">Sign in</button>
        <button class="knot-tab-btn"        id="btnSignup" onclick="switchTab('signup')">Sign up</button>
      </div>

      <!-- SIGN IN -->
      <div id="fSignin">
        <div class="knot-form-title">Welcome back 👋</div>
        <div class="knot-form-sub">Sign in to continue your learning journey</div>
        <form onsubmit="handleSignin(event)">
          <div class="knot-field">
            <label class="knot-label">Email address</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              <input class="knot-input" type="email" id="signinEmail" placeholder="you@college.edu" required />
            </div>
            <div class="knot-field-error" id="signinEmailErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">Password</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="knot-input" type="password" id="pw1" placeholder="••••••••" required />
              <button class="knot-eye" type="button" onclick="togglePw('pw1',this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="knot-field-error" id="signinPwErr"></div>
          </div>
          <div class="knot-meta">
            <label class="knot-check-wrap">
              <input type="checkbox" class="knot-check" id="rememberMe" />
              <span class="knot-check-label">Remember me</span>
            </label>
            <a href="#" class="knot-forgot" onclick="handleForgot(event)">Forgot password?</a>
          </div>
          <button type="submit" class="knot-submit" id="signinBtn">Sign in →</button>
        </form>
        <div class="knot-divider">
          <div class="knot-div-line"></div>
          <span class="knot-div-text">or continue with</span>
          <div class="knot-div-line"></div>
        </div>
        <div class="knot-social">
          <button class="knot-social-btn" onclick="alert('Google OAuth coming soon!')">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button class="knot-social-btn" onclick="alert('Phone OTP coming soon!')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
            Phone OTP
          </button>
        </div>
        <p class="knot-social-note">Google & Phone OTP coming in next update</p>
        <div class="knot-footer-link">Don't have an account? <a href="#" onclick="switchTab('signup');return false;">Sign up free</a></div>
      </div>

      <!-- SIGN UP -->
      <div id="fSignup" class="knot-hidden">
        <div class="knot-form-title">Join KNOT ✨</div>
        <div class="knot-form-sub">Create your account and start learning today</div>
        <form onsubmit="handleSignup(event)">
          <div class="knot-field">
            <label class="knot-label">Full name</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <input class="knot-input" type="text" id="signupName" placeholder="Your full name" required />
            </div>
            <div class="knot-field-error" id="signupNameErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">College email</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              <input class="knot-input" type="email" id="signupEmail" placeholder="you@college.edu" required />
            </div>
            <div class="knot-field-error" id="signupEmailErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">Password</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="knot-input" type="password" id="pw2" placeholder="Min 6 characters" required />
              <button class="knot-eye" type="button" onclick="togglePw('pw2',this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="knot-field-error" id="signupPwErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">Branch (optional)</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <input class="knot-input" type="text" id="signupBranch" placeholder="e.g. CSE, ECE, MBA" />
            </div>
          </div>
          <div style="margin-bottom:18px"></div>
          <button type="submit" class="knot-submit" id="signupBtn">Create account →</button>
        </form>
        <div class="knot-divider">
          <div class="knot-div-line"></div>
          <span class="knot-div-text">or continue with</span>
          <div class="knot-div-line"></div>
        </div>
        <div class="knot-social">
          <button class="knot-social-btn" onclick="alert('Google OAuth coming soon!')">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button class="knot-social-btn" onclick="alert('Phone OTP coming soon!')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
            Phone OTP
          </button>
        </div>
        <p class="knot-social-note">Google & Phone OTP coming in next update</p>
        <div class="knot-footer-link">Already have an account? <a href="#" onclick="switchTab('signin');return false;">Sign in</a></div>
      </div>

    </div>
  </div>
</div>
`;