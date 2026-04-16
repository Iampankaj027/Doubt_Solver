import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

export default function Auth() {
  const { login, isLoggedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      const thm = document.documentElement.getAttribute('data-theme');
      btn.style.color = inp.type === 'text' ? (thm === 'light' ? '#D07A48' : '#E8915A') : (thm === 'light' ? '#B0A49A' : '#5E544A');
    };
    window.handleSignin = handleSignin;
    window.handleSignup = handleSignup;
    window.handleForgot = handleForgot;
  }, []);

  // Theme toggle handler for the auth page's own toggle button
  useEffect(() => {
    window.toggleKnotTheme = () => {
      toggleTheme();
    };
  }, [toggleTheme]);

  // Update auth page class when theme changes
  useEffect(() => {
    const authEl = document.querySelector('.knot-auth');
    if (authEl) {
      authEl.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return <div dangerouslySetInnerHTML={{ __html: authHTML }} />;
}

const authHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

  .knot-auth * { box-sizing: border-box; margin: 0; padding: 0; }

  .knot-auth {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
    /* Default is the vibrant dark mode */
    background: #0f0704;
    position: relative;
    overflow: hidden;
    transition: background 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* ══ DEFAULT: THE "CREAMY WHITISH & ORANGE" LIGHT THEME ══ */
  .knot-auth[data-theme="light"], .knot-auth {
    background: #FEFAF6; /* Cream base */
  }

  /* Ambient Mesh Orbs */
  .knot-auth::before,
  .knot-auth::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    z-index: 0;
    pointer-events: none;
    transition: all 0.8s ease;
  }
  .knot-auth::before {
    width: 60vh; height: 60vh;
    background: rgba(255, 140, 0, 0.25); /* Bright Orange */
    top: -10vh; right: -5vw;
    animation: floatOrb 20s infinite ease-in-out alternate;
  }
  .knot-auth::after {
    width: 50vh; height: 50vh;
    background: rgba(255, 200, 150, 0.35); /* Peach Cream */
    bottom: -10vh; left: -10vw;
    animation: floatOrb 15s infinite ease-in-out alternate-reverse;
  }
  
  /* Dark mode overrides for orbs */
  .knot-auth[data-theme="dark"]::before { background: rgba(255, 100, 0, 0.15); }
  .knot-auth[data-theme="dark"]::after { background: rgba(180, 50, 0, 0.15); }
  .knot-auth[data-theme="dark"] { background: #120a06; }

  @keyframes floatOrb {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-30px, 50px) scale(1.1); }
    100% { transform: translate(40px, -40px) scale(0.95); }
  }

  /* ── LEFT PANEL ── */
  .knot-left {
    position: relative;
    z-index: 1;
    padding: 60px 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.3);
    border-right: 1px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.5s ease;
  }
  .knot-auth[data-theme="dark"] .knot-left {
    background: rgba(0, 0, 0, 0.2);
    border-right-color: rgba(255, 255, 255, 0.05);
  }

  .knot-brand {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #FF7B00;
    letter-spacing: -1.5px;
    text-transform: uppercase;
    text-shadow: 0 4px 12px rgba(255, 123, 0, 0.2);
    transition: all 0.4s ease;
  }
  .knot-auth[data-theme="dark"] .knot-brand { color: #FF9100; }

  .knot-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 0;
  }

  .knot-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }
  .knot-eyebrow-line {
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #FF7B00, transparent);
    border-radius: 3px;
  }
  .knot-eyebrow-text {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #FF7B00;
  }
  .knot-auth[data-theme="dark"] .knot-eyebrow-text { color: #FF9100; }

  .knot-heading {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 300;
    line-height: 1.1;
    color: #2F1E16; /* Deep espresso */
    margin-bottom: 24px;
    transition: color 0.4s ease;
  }
  .knot-auth[data-theme="dark"] .knot-heading { color: #FFF0E6; }
  
  .knot-heading em {
    font-style: italic;
    color: #FF7B00;
    font-weight: 500;
  }
  .knot-auth[data-theme="dark"] .knot-heading em { color: #FFAA55; }
  
  .knot-heading .gold {
    color: #FF6600;
    font-weight: 700;
    position: relative;
  }
  .knot-heading .gold::after {
    content: '';
    position: absolute;
    bottom: 5px; left: 0; width: 100%; height: 8px;
    background: rgba(255, 123, 0, 0.2);
    z-index: -1;
  }
  .knot-auth[data-theme="dark"] .knot-heading .gold { color: #FF9100; }
  .knot-auth[data-theme="dark"] .knot-heading .gold::after { background: rgba(255, 145, 0, 0.2); }

  .knot-desc {
    font-size: 16px;
    font-weight: 400;
    color: #5C4B43;
    line-height: 1.6;
    max-width: 420px;
    margin-bottom: 50px;
    transition: color 0.4s ease;
  }
  .knot-auth[data-theme="dark"] .knot-desc { color: #B3A095; }

  /* New premium stats design */
  .knot-stats {
    display: inline-flex;
    gap: 0;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.02);
    overflow: hidden;
    transition: all 0.4s ease;
  }
  .knot-auth[data-theme="dark"] .knot-stats {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
  .knot-stat {
    padding: 24px 32px;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    display: flex; flex-direction: column; justify-content: center;
  }
  .knot-auth[data-theme="dark"] .knot-stat { border-right-color: rgba(255, 255, 255, 0.05); }
  .knot-stat:last-child { border-right: none; }
  
  .knot-stat-num {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #FF6600;
    line-height: 1;
    margin-bottom: 6px;
  }
  .knot-auth[data-theme="dark"] .knot-stat-num { color: #FF9100; }
  
  .knot-stat-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #8F7669;
  }
  .knot-auth[data-theme="dark"] .knot-stat-label { color: #9E897D; }

  .knot-testimonial {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 50px;
    padding: 8px 24px 8px 8px;
    max-width: fit-content;
    margin-top: 32px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all 0.4s ease;
    box-shadow: 0 4px 15px rgba(255, 123, 0, 0.05);
  }
  .knot-auth[data-theme="dark"] .knot-testimonial {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .knot-testi-avatars { display: flex; }
  .knot-testi-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #FF9100, #FF5500);
    border: 2px solid #FFFAF5;
    margin-right: -12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: white; font-weight: 700;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .knot-auth[data-theme="dark"] .knot-testi-avatar { border-color: #120a06; border-width: 2px; }
  .knot-testi-avatars .knot-testi-avatar:last-child { margin-right: 0; }
  
  .knot-testi-text { font-size: 13px; color: #5C4B43; }
  .knot-auth[data-theme="dark"] .knot-testi-text { color: #B3A095; }
  .knot-testi-text strong { color: #2F1E16; font-weight: 700; }
  .knot-auth[data-theme="dark"] .knot-testi-text strong { color: #FFF0E6; }

  .knot-footer {
    font-size: 12px;
    font-weight: 500;
    color: #8F7669;
  }
  .knot-auth[data-theme="dark"] .knot-footer { color: #7B6858; }

  /* ── RIGHT PANEL ── */
  .knot-right {
    position: relative;
    z-index: 1;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 20px;
  }

  /* Theme Toggle Button */
  .knot-theme-btn {
    position: absolute; top: 32px; right: 32px;
    width: 48px; height: 48px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #FF6600;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 10;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 15px rgba(255, 123, 0, 0.1);
  }
  .knot-theme-btn:hover {
    transform: scale(1.1);
    background: #FFFFFF;
    border-color: #FF7B00;
    box-shadow: 0 8px 25px rgba(255, 123, 0, 0.2);
  }
  .knot-theme-btn:active { transform: scale(0.95); }
  
  .knot-auth[data-theme="dark"] .knot-theme-btn {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #FF9100;
  }
  .knot-auth[data-theme="dark"] .knot-theme-btn:hover { background: rgba(255,255,255,0.1); border-color: #FF9100; }
  .knot-theme-icon { transition: transform 0.5s ease; display: flex; }
  .knot-theme-btn:hover .knot-theme-icon { transform: rotate(45deg); }

  /* ══ TRANSLUCENT GLASSMORPHISM LOGIN TILE ══ */
  .knot-form-wrap {
    width: 100%; max-width: 460px;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(32px) saturate(200%);
    -webkit-backdrop-filter: blur(32px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 28px;
    padding: 48px 40px;
    box-shadow: 0 20px 60px rgba(255, 123, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .knot-auth[data-theme="dark"] .knot-form-wrap {
    background: rgba(20, 10, 5, 0.6);
    border-color: rgba(255, 100, 0, 0.15);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03);
  }
  

  /* Tabs */
  .knot-tabs {
    display: flex;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255,255,255,0.8);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 36px;
    position: relative;
  }
  .knot-auth[data-theme="dark"] .knot-tabs { background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.05); }

  .knot-tab-pill {
    position: absolute;
    top: 4px; bottom: 4px; left: 4px;
    width: calc(50% - 4px);
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .knot-tab-pill.right { transform: translateX(100%); }
  .knot-auth[data-theme="dark"] .knot-tab-pill { background: rgba(255, 100, 0, 0.15); box-shadow: none; }

  .knot-tab-btn {
    flex: 1; padding: 10px 0;
    background: none; border: none;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
    color: #8F7669; cursor: pointer; text-align: center;
    position: relative; z-index: 1; transition: color 0.3s;
  }
  .knot-tab-btn.active { color: #FF6600; }
  .knot-auth[data-theme="dark"] .knot-tab-btn { color: #7B6858; }
  .knot-auth[data-theme="dark"] .knot-tab-btn.active { color: #FF9100; }

  .knot-form-title {
    font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 700;
    color: #2F1E16; margin-bottom: 6px; letter-spacing: -0.5px;
  }
  .knot-auth[data-theme="dark"] .knot-form-title { color: #FFF0E6; }

  .knot-form-sub {
    font-size: 14px; color: #8F7669; font-weight: 400; margin-bottom: 32px; line-height: 1.5;
  }
  .knot-auth[data-theme="dark"] .knot-form-sub { color: #9E897D; }

  /* Fields */
  .knot-field { margin-bottom: 20px; }
  .knot-label {
    display: block; font-size: 12px; font-weight: 700;
    letter-spacing: 0.5px; color: #5C4B43; margin-bottom: 8px;
  }
  .knot-auth[data-theme="dark"] .knot-label { color: #B3A095; }

  .knot-input-wrap { position: relative; display: flex; align-items: center; }
  .knot-input-icon {
    position: absolute; left: 16px; width: 18px; height: 18px;
    color: #A38B7D; pointer-events: none; transition: color 0.3s;
  }

  /* Frosted Glass Inputs */
  .knot-input {
    width: 100%; padding: 14px 16px 14px 44px;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
    color: #2F1E16; outline: none; transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.01);
  }
  .knot-auth[data-theme="dark"] .knot-input {
    background: rgba(0, 0, 0, 0.2); border-color: rgba(255, 255, 255, 0.08); color: #FFF0E6;
  }

  .knot-input::placeholder { color: #A38B7D; font-weight: 400; }
  .knot-auth[data-theme="dark"] .knot-input::placeholder { color: #6E5A4E; }

  .knot-input:focus {
    background: #FFFFFF; border-color: #FF7B00;
    box-shadow: 0 0 0 4px rgba(255, 123, 0, 0.15);
  }
  .knot-auth[data-theme="dark"] .knot-input:focus {
    background: rgba(0,0,0,0.4); border-color: #FF9100;
    box-shadow: 0 0 0 4px rgba(255, 145, 0, 0.15);
  }
  .knot-input:focus ~ .knot-input-icon, .knot-input-icon:focus-within { color: #FF7B00; }
  .knot-auth[data-theme="dark"] .knot-input:focus ~ .knot-input-icon { color: #FF9100; }

  .knot-input.error { border-color: #FF3333; background: #FFF0F0; }
  .knot-auth[data-theme="dark"] .knot-input.error { background: rgba(255, 50, 50, 0.1); }

  .knot-field-error { font-size: 12px; color: #FF3333; margin-top: 6px; display: none; font-weight: 500;}

  .knot-eye {
    position: absolute; right: 14px; background: none; border: none; cursor: pointer;
    color: #A38B7D; display: flex; align-items: center; padding: 4px; transition: color 0.3s;
  }
  .knot-eye:hover { color: #FF7B00; }
  .knot-auth[data-theme="dark"] .knot-eye:hover { color: #FF9100; }

  /* Meta row */
  .knot-meta { display: flex; justify-content: space-between; align-items: center; margin: 20px 0 28px; }
  .knot-check-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .knot-check {
    width: 20px; height: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #E0CFC5;
    border-radius: 6px; appearance: none; cursor: pointer; position: relative; transition: all 0.2s;
  }
  .knot-auth[data-theme="dark"] .knot-check { background: rgba(0,0,0,0.3); border-color: #4A3A30; }

  .knot-check:checked { background: #FF6600; border-color: #FF6600; }
  .knot-auth[data-theme="dark"] .knot-check:checked { background: #FF9100; border-color: #FF9100; }

  .knot-check:checked::after {
    content: ''; position: absolute; left: 5px; top: 1px;
    width: 5px; height: 10px; border: 2px solid white; border-top: none; border-left: none; transform: rotate(40deg);
  }

  .knot-check-label { font-size: 14px; color: #5C4B43; font-weight: 500; }
  .knot-auth[data-theme="dark"] .knot-check-label { color: #B3A095; }

  .knot-forgot { font-size: 14px; color: #FF6600; text-decoration: none; font-weight: 600; transition: color 0.3s; }
  .knot-forgot:hover { color: #CC5200; }
  .knot-auth[data-theme="dark"] .knot-forgot { color: #FF9100; }
  .knot-auth[data-theme="dark"] .knot-forgot:hover { color: #FFB355; }

  /* Gradient Submit button */
  .knot-submit {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, #FF9100 0%, #FF5500 100%);
    border: none; border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700;
    color: #FFFFFF; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 10px 25px rgba(255, 100, 0, 0.3);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .knot-submit:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(255, 100, 0, 0.4);
    filter: brightness(1.1);
  }
  .knot-submit:active { transform: translateY(0); }
  .knot-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Divider */
  .knot-divider { display: flex; align-items: center; gap: 16px; margin: 28px 0; }
  .knot-div-line { flex: 1; height: 1px; background: rgba(0, 0, 0, 0.08); }
  .knot-auth[data-theme="dark"] .knot-div-line { background: rgba(255, 255, 255, 0.08); }
  .knot-div-text { font-size: 12px; color: #A38B7D; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

  /* Social buttons */
  .knot-social { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .knot-social-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 14px; background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
    color: #2F1E16; cursor: pointer; transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 4px 10px rgba(0,0,0,0.02);
  }
  .knot-auth[data-theme="dark"] .knot-social-btn {
    background: rgba(255, 255, 255, 0.03); border-color: rgba(255, 255, 255, 0.08); color: #FFF0E6;
  }
  .knot-social-btn:hover { border-color: rgba(0, 0, 0, 0.15); box-shadow: 0 6px 15px rgba(0,0,0,0.05); transform: translateY(-2px); }
  .knot-auth[data-theme="dark"] .knot-social-btn:hover { border-color: rgba(255, 255, 255, 0.15); background: rgba(255,255,255,0.06); }

  .knot-social-note { text-align: center; margin-top: 12px; font-size: 12px; color: #8F7669; }
  .knot-auth[data-theme="dark"] .knot-social-note { color: #6E5A4E; }

  .knot-footer-link { text-align: center; margin-top: 28px; font-size: 14px; color: #5C4B43; font-weight: 500;}
  .knot-auth[data-theme="dark"] .knot-footer-link { color: #B3A095; }
  .knot-footer-link a { color: #FF6600; text-decoration: none; font-weight: 700; transition: color 0.3s; }
  .knot-footer-link a:hover { color: #CC5200; text-decoration: underline; }
  .knot-auth[data-theme="dark"] .knot-footer-link a { color: #FF9100; }

  .knot-hidden { display: none; }

  /* Spinner */
  .knot-spinner {
    width: 18px; height: 18px;
    border: 3px solid rgba(255, 255, 255, 0.3); border-top-color: #FFFFFF;
    border-radius: 50%; animation: knotSpin 0.7s linear infinite; display: inline-block;
  }
  @keyframes knotSpin { to { transform: rotate(360deg); } }

  /* Toast */
  .knot-toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(80px);
    z-index: 9999; padding: 14px 28px; border-radius: 16px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    border: 1px solid; opacity: 0; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap; backdrop-filter: blur(25px); box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  }
  .knot-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  
  .knot-toast.success { background: rgba(56, 204, 140, 0.85); color: white; border-color: rgba(56, 204, 140, 1); }
  .knot-toast.error { background: rgba(255, 77, 77, 0.85); color: white; border-color: rgba(255, 77, 77, 1); }
  .knot-toast.loading { background: rgba(255, 123, 0, 0.85); color: white; border-color: rgba(255, 123, 0, 1); }

  /* Advanced Background Structure (Grid + Geometric Shape) */
  .knot-auth-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: 
      radial-gradient(rgba(255, 123, 0, 0.1) 1px, transparent 1px),
      linear-gradient(rgba(255, 123, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 123, 0, 0.03) 1px, transparent 1px);
    background-size: 24px 24px, 96px 96px, 96px 96px;
    background-position: center;
    mask-image: radial-gradient(circle at center, black 10%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 10%, transparent 80%);
    opacity: 0.8;
  }
  .knot-auth[data-theme="dark"] .knot-auth-grid {
    background-image: 
      radial-gradient(rgba(255, 145, 0, 0.15) 1px, transparent 1px),
      linear-gradient(rgba(255, 145, 0, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 145, 0, 0.05) 1px, transparent 1px);
    opacity: 0.5;
  }

  .knot-auth-geo {
    position: absolute;
    top: 50%;
    left: 45%;
    width: 900px;
    height: 900px;
    border: 1px solid rgba(255, 123, 0, 0.15);
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    transform: translate(-50%, -50%);
    animation: geoRotate 35s linear infinite;
    z-index: 0;
    pointer-events: none;
    box-shadow: inset 0 0 50px rgba(255, 123, 0, 0.04);
  }
  .knot-auth-geo::before {
    content: '';
    position: absolute;
    inset: -25px;
    border: 1px dashed rgba(255, 123, 0, 0.2);
    border-radius: 50% 40% 60% 40% / 50% 60% 40% 60%;
    animation: geoRotate 25s linear infinite reverse;
  }
  .knot-auth[data-theme="dark"] .knot-auth-geo {
    border-color: rgba(255, 145, 0, 0.2);
  }
  .knot-auth[data-theme="dark"] .knot-auth-geo::before {
    border-color: rgba(255, 145, 0, 0.25);
  }

  @keyframes geoRotate {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @media (max-width: 900px) {
    .knot-auth { grid-template-columns: 1fr; }
    .knot-left { display: none; }
    .knot-right { padding: 40px 20px; }
    .knot-form-wrap { padding: 40px 32px; }
  }
</style>

<div class="knot-toast" id="toast"></div>

<!-- Make default theme light -->
<div class="knot-auth" data-theme="light">
  <!-- ADVANCED BACKGROUND STRUCTURE -->
  <div class="knot-auth-grid"></div>
  <div class="knot-auth-geo"></div>

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
          <div class="knot-stat-label">Rating</div>
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

    <div class="knot-footer">© 2026 KNOT. Built for scholars.</div>
  </div>

  <!-- RIGHT -->
  <div class="knot-right">

    <button class="knot-theme-btn" onclick="toggleKnotTheme()" title="Toggle theme">
      <span class="knot-theme-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </span>
    </button>

    <div class="knot-form-wrap">
      <!-- Tabs -->
      <div class="knot-tabs">
        <div class="knot-tab-pill" id="tabPill"></div>
        <button class="knot-tab-btn active" id="btnSignin" onclick="switchTab('signin')">Sign In</button>
        <button class="knot-tab-btn"        id="btnSignup" onclick="switchTab('signup')">Sign Up</button>
      </div>

      <!-- SIGN IN -->
      <div id="fSignin">
        <div class="knot-form-title">Welcome back 👋</div>
        <div class="knot-form-sub">Sign in to continue your learning journey</div>
        <form onsubmit="handleSignin(event)">
          <div class="knot-field">
            <label class="knot-label">Email Address</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              <input class="knot-input" type="email" id="signinEmail" placeholder="you@college.edu" required />
            </div>
            <div class="knot-field-error" id="signinEmailErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">Password</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="knot-input" type="password" id="pw1" placeholder="••••••••" required />
              <button class="knot-eye" type="button" onclick="togglePw('pw1',this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
          <button type="submit" class="knot-submit" id="signinBtn">Sign In to Dashboard →</button>
        </form>
        
        <div class="knot-divider">
          <div class="knot-div-line"></div>
          <span class="knot-div-text">or connect with</span>
          <div class="knot-div-line"></div>
        </div>
        
        <div class="knot-social">
          <button type="button" class="knot-social-btn" onclick="alert('Google OAuth coming soon!')">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button type="button" class="knot-social-btn" onclick="alert('Phone OTP coming soon!')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
            Phone OTP
          </button>
        </div>
        <p class="knot-social-note">SSO features coming in next update</p>
        <div class="knot-footer-link">Don't have an account? <a href="#" onclick="switchTab('signup');return false;">Sign up free</a></div>
      </div>

      <!-- SIGN UP -->
      <div id="fSignup" class="knot-hidden">
        <div class="knot-form-title">Join KNOT ✨</div>
        <div class="knot-form-sub">Create your account and start your journey</div>
        <form onsubmit="handleSignup(event)">
          <div class="knot-field">
            <label class="knot-label">Full Name</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <input class="knot-input" type="text" id="signupName" placeholder="Your full name" required />
            </div>
            <div class="knot-field-error" id="signupNameErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">College Email</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              <input class="knot-input" type="email" id="signupEmail" placeholder="you@college.edu" required />
            </div>
            <div class="knot-field-error" id="signupEmailErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">Password</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="knot-input" type="password" id="pw2" placeholder="Min 6 characters" required />
              <button class="knot-eye" type="button" onclick="togglePw('pw2',this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="knot-field-error" id="signupPwErr"></div>
          </div>
          <div class="knot-field">
            <label class="knot-label">Branch (Optional)</label>
            <div class="knot-input-wrap">
              <svg class="knot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <input class="knot-input" type="text" id="signupBranch" placeholder="e.g. CSE, ECE, MBA" />
            </div>
          </div>
          <div style="margin-bottom:24px"></div>
          <button type="submit" class="knot-submit" id="signupBtn">Create Account & Join →</button>
        </form>

        <div class="knot-divider">
          <div class="knot-div-line"></div>
          <span class="knot-div-text">or connect with</span>
          <div class="knot-div-line"></div>
        </div>
        <div class="knot-social">
          <button type="button" class="knot-social-btn" onclick="alert('Google OAuth coming soon!')">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button type="button" class="knot-social-btn" onclick="alert('Phone OTP coming soon!')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
            Phone OTP
          </button>
        </div>
        <p class="knot-social-note">SSO features coming in next update</p>
        <div class="knot-footer-link">Already have an account? <a href="#" onclick="switchTab('signin');return false;">Sign in instead</a></div>
      </div>

    </div>
  </div>
</div>
`;
