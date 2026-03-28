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
    t.className = `toast ${type} show`;
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
      btn.innerHTML = `<span class="btn-inner"><span class="spinner"></span> Please wait...</span>`;
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

    if (!email)    return setFieldError('signinEmail', 'signinEmailErr', 'Email is required');
    if (!password) return setFieldError('pw1', 'signinPwErr', 'Password is required');

    const originalHTML = `<span class="btn-inner">Sign in <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>`;
    setBtnLoading('signinBtn', true);
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

    if (!name)               return setFieldError('signupName',  'signupNameErr',  'Name is required');
    if (!email)              return setFieldError('signupEmail', 'signupEmailErr', 'Email is required');
    if (password.length < 6) return setFieldError('pw2', 'signupPwErr', 'Min 6 characters');

    const originalHTML = `<span class="btn-inner">Create account <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>`;
    setBtnLoading('signupBtn', true);
    showToast('Creating your account...', 'loading', 0);

    try {
      const { data } = await API.post('/auth/signup', { name, email, password, branch: branch || undefined });
      login(data.user, data.token, true);
      showToast(`Welcome to DoubtSolver, ${data.user.name}!`, 'success');
      setTimeout(() => navigate('/home'), 1200);
    } catch (err) {
      setBtnLoading('signupBtn', false, originalHTML);
      const msg = err.response?.data?.message || 'Signup failed';
      if (msg.toLowerCase().includes('email')) setFieldError('signupEmail', 'signupEmailErr', msg);
      else setFieldError('pw2', 'signupPwErr', msg);
      showToast(msg, 'error');
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
        pill.classList.remove('right');
        btnIn.classList.add('active'); btnUp.classList.remove('active');
        fIn.classList.remove('hidden'); fUp.classList.add('hidden');
      } else {
        pill.classList.add('right');
        btnUp.classList.add('active'); btnIn.classList.remove('active');
        fUp.classList.remove('hidden'); fIn.classList.add('hidden');
      }
    };

    window.togglePw = (id, btn) => {
      const inp = document.getElementById(id);
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.style.color = inp.type === 'text' ? 'var(--rose)' : 'var(--text-muted)';
    };

    window.toggleTheme = () => {
      const html = document.documentElement;
      const btn  = document.getElementById('themeToggle');
      if (html.classList.contains('light-mode')) {
        html.classList.remove('light-mode');
        btn.classList.add('dark-mode');
        localStorage.setItem('ds_theme', 'dark');
      } else {
        html.classList.add('light-mode');
        btn.classList.remove('dark-mode');
        localStorage.setItem('ds_theme', 'light');
      }
    };

    window.handleSignin = handleSignin;
    window.handleSignup = handleSignup;

    const saved = localStorage.getItem('ds_theme') || 'dark';
    if (saved === 'light') {
      document.documentElement.classList.add('light-mode');
      const btn = document.getElementById('themeToggle');
      if (btn) btn.classList.remove('dark-mode');
    }

    const card  = document.getElementById('formCard');
    const panel = document.querySelector('.panel-right');
    if (!card || !panel) return;

    let cx = 0, cy = 0, tx = 0, ty = 0;
    const onMove = e => {
      const r = card.getBoundingClientRect();
      tx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * 7;
      ty = -((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 7;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    panel.addEventListener('mousemove',  onMove);
    panel.addEventListener('mouseleave', onLeave);

    let rafId;
    const tilt = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      card.style.transform = `perspective(900px) rotateX(${cx}deg) rotateY(${cy}deg) scale3d(1.012,1.012,1.012)`;
      rafId = requestAnimationFrame(tilt);
    };
    tilt();

    return () => {
      panel.removeEventListener('mousemove',  onMove);
      panel.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: authHTML }} />;
}

const authHTML = `
<style>
  :root {
    --rose: #d437bd;
    --rose-dim: #c41f5a;
    --rose-glow: rgba(255,45,120,0.35);
    --rose-soft: rgba(255,45,120,0.12);
    --rose-border: rgba(255,45,120,0.22);
    --gold: #e8c87a;
    --black: #06030a;
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --glass-border: rgba(255,255,255,0.09);
    --glass-border-bright: rgba(255,255,255,0.16);
    --text-primary: #f7eef3;
    --text-secondary: rgba(247,238,243,0.55);
    --text-muted: rgba(247,238,243,0.3);
  }
  html.light-mode {
    --rose: #d62489;
    --rose-dim: #a81a4f;
    --rose-glow: rgba(214,36,137,0.2);
    --rose-soft: rgba(214,36,137,0.06);
    --rose-border: rgba(214,36,137,0.2);
    --gold: #d4a017;
    --black: #f4f6f9;
    --surface: rgba(255,255,255,0.8);
    --glass-border: rgba(0,0,0,0.08);
    --glass-border-bright: rgba(0,0,0,0.12);
    --text-primary: #111827;
    --text-secondary: #4b5563;
    --text-muted: #9ca3af;
  }
  html.light-mode .bg { background: #f4f6f9 !important; }
  html.light-mode .orb1 { background: radial-gradient(circle, rgba(214,36,137,0.15) 0%, transparent 70%) !important; }
  html.light-mode .orb2 { background: radial-gradient(circle, rgba(214,36,137,0.1) 0%, transparent 70%) !important; }
  html.light-mode .orb3 { background: radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 70%) !important; }
  html.light-mode .bg-grid { background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px) !important; }
  html.light-mode .form-card { background: rgba(255,255,255,0.7) !important; box-shadow: 0 0 0 1px rgba(255,255,255,0.8) inset, 0 30px 60px rgba(0,0,0,0.06) !important; }
  html.light-mode .field-input { background: rgba(255,255,255,0.8) !important; border: 1px solid rgba(0,0,0,0.1) !important; color: #111827 !important; }
  html.light-mode .tab-wrap { background: rgba(0,0,0,0.04) !important; }
  html.light-mode .tab-pill { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.05) !important; }
  html.light-mode .btn-social { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; }
  html.light-mode .stats, html.light-mode .testimonial { background: rgba(255,255,255,0.6) !important; }
  html.light-mode .brand-icon { background: #ffffff !important; }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; min-height: 100vh; font-family: 'Outfit', sans-serif; background: var(--black); color: var(--text-primary); overflow-x: hidden; transition: background 0.4s ease, color 0.4s ease; }

  .bg { position: fixed; inset: 0; z-index: 0; background: radial-gradient(ellipse 80% 60% at 20% 10%, #1a0010 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 90%, #1a000d 0%, transparent 55%), radial-gradient(ellipse 100% 80% at 50% 50%, #0d0007 0%, #06030a 100%); transition: background 0.6s ease; }
  .bg-orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
  .orb1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(180,20,70,0.5) 0%, rgba(255,45,120,0.15) 50%, transparent 70%); top: -250px; left: -200px; animation: orbDrift1 12s ease-in-out infinite; }
  .orb2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,45,120,0.3) 0%, rgba(150,10,50,0.1) 50%, transparent 70%); bottom: -150px; right: -100px; animation: orbDrift2 15s ease-in-out infinite; }
  .orb3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(232,200,122,0.12) 0%, transparent 70%); top: 50%; left: 55%; animation: orbDrift3 10s ease-in-out infinite; }
  @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-60px) scale(1.08)} 66%{transform:translate(-20px,30px) scale(0.95)} }
  @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-50px,40px) scale(1.1)} }
  @keyframes orbDrift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-30px)} }
  .bg-grid { position: fixed; inset: 0; z-index: 0; background-image: linear-gradient(rgba(255,45,120,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.04) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%); }
  .bg-noise { position: fixed; inset: 0; z-index: 1; opacity: 0.025; pointer-events: none; }
  .page { position: relative; z-index: 2; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; }
  .panel-left { display: flex; flex-direction: column; justify-content: space-between; padding: 56px 64px; position: relative; overflow: hidden; }
  .panel-left::after { content: ''; position: absolute; top: 0; right: 0; width: 1px; height: 100%; background: linear-gradient(180deg, transparent 0%, var(--rose-border) 30%, rgba(232,200,122,0.2) 60%, transparent 100%); }
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #2a0015, #4d0028); border: 1px solid var(--rose-border); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 0 20px var(--rose-glow), inset 0 1px 0 rgba(255,255,255,0.08); position: relative; }
  .brand-icon::before { content: ''; position: absolute; inset: -1px; border-radius: 14px; background: linear-gradient(135deg, rgba(255,45,120,0.4), transparent 60%); z-index: -1; }
  .brand-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--text-primary); letter-spacing: 0.5px; }
  .brand-sub { font-size: 10px; font-weight: 400; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-muted); margin-top: 1px; }
  .hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px 0; }
  .hero-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .eyebrow-line { width: 32px; height: 1px; background: linear-gradient(90deg, var(--rose), transparent); }
  .eyebrow-text { font-size: 10px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--rose); }
  .hero-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(42px,5vw,62px); font-weight: 300; line-height: 1.1; color: var(--text-primary); margin-bottom: 10px; }
  .hero-heading em { font-style: italic; color: var(--rose); }
  .hero-heading .gold { color: var(--gold); }
  .hero-desc { font-size: 14px; font-weight: 300; color: var(--text-secondary); line-height: 1.75; max-width: 340px; margin-top: 20px; margin-bottom: 48px; }
  .stats { display: flex; border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; background: rgba(255,255,255,0.025); backdrop-filter: blur(12px); max-width: 400px; }
  .stat { flex: 1; padding: 20px 24px; border-right: 1px solid var(--glass-border); position: relative; }
  .stat:last-child { border-right: none; }
  .stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--rose-border), transparent); }
  .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 500; color: var(--rose); line-height: 1; }
  .stat-label { font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px; margin-top: 4px; }
  .testimonial { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 50px; padding: 10px 18px 10px 10px; max-width: fit-content; margin-top: 24px; }
  .testi-avatars { display: flex; }
  .testi-avatar { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--black); margin-right: -8px; background: linear-gradient(135deg, #2a0015, #800040); display: flex; align-items: center; justify-content: center; font-size: 10px; color: rgba(255,255,255,0.6); font-weight: 500; }
  .testi-avatars .testi-avatar:last-child { margin-right: 0; }
  .testi-text { font-size: 11px; color: var(--text-secondary); line-height: 1.4; }
  .testi-text strong { color: var(--text-primary); font-weight: 500; }
  .panel-right { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 64px; position: relative; }
  .form-card { width: 100%; max-width: 420px; background: rgba(255,255,255,0.04); backdrop-filter: blur(40px) saturate(180%); -webkit-backdrop-filter: blur(40px) saturate(180%); border: 1px solid var(--glass-border-bright); border-radius: 28px; padding: 44px 42px; position: relative; overflow: hidden; box-shadow: 0 0 0 1px rgba(255,45,120,0.06) inset, 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(180,20,70,0.15); animation: cardReveal 0.9s cubic-bezier(0.16,1,0.3,1) both; will-change: transform; }
  @keyframes cardReveal { from{opacity:0;transform:translateY(30px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  .form-card::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), rgba(255,45,120,0.4), rgba(255,255,255,0.2), transparent); }
  .form-card::after { content: ''; position: absolute; top: -80px; right: -80px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,45,120,0.18), transparent 70%); pointer-events: none; }
  .tab-wrap { display: flex; background: rgba(0,0,0,0.35); border: 1px solid var(--glass-border); border-radius: 12px; padding: 4px; margin-bottom: 38px; position: relative; }
  .tab-pill { position: absolute; top: 4px; left: 4px; width: calc(50% - 4px); height: calc(100% - 8px); background: linear-gradient(135deg, rgba(255,45,120,0.2), rgba(180,20,70,0.15)); border: 1px solid var(--rose-border); border-radius: 9px; transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 0 16px rgba(255,45,120,0.2); }
  .tab-pill.right { transform: translateX(100%); }
  .tab-btn { flex: 1; padding: 11px; background: none; border: none; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; position: relative; z-index: 2; transition: color 0.2s; letter-spacing: 0.3px; }
  .tab-btn.active { color: var(--text-primary); }
  .form-title { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 400; color: var(--text-primary); margin-bottom: 5px; letter-spacing: -0.3px; }
  .form-sub { font-size: 12px; font-weight: 300; color: var(--text-secondary); margin-bottom: 32px; line-height: 1.5; }
  .field { margin-bottom: 16px; }
  .field-label { display: block; font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
  .input-shell { position: relative; display: flex; align-items: center; }
  .input-shell .input-icon { position: absolute; left: 15px; width: 14px; height: 14px; color: rgba(255,45,120,0.4); pointer-events: none; }
  .field-input { width: 100%; padding: 14px 16px 14px 42px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 300; color: var(--text-primary); outline: none; transition: all 0.25s ease; }
  .field-input::placeholder { color: var(--text-muted); }
  .field-input:focus { border-color: var(--rose-border); background: rgba(255,45,120,0.05); box-shadow: 0 0 0 3px rgba(255,45,120,0.08); }
  .field-input.error { border-color: rgba(239,68,68,0.5); background: rgba(239,68,68,0.05); }
  .field-error { font-size: 11px; color: #fca5a5; margin-top: 6px; padding-left: 4px; display: none; }
  .eye-toggle { position: absolute; right: 13px; background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; padding: 4px; transition: color 0.2s; }
  .eye-toggle:hover { color: var(--rose); }
  .meta-row { display: flex; justify-content: space-between; align-items: center; margin: 20px 0 28px; }
  .check-wrap { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .custom-check { width: 16px; height: 16px; background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border-bright); border-radius: 5px; appearance: none; cursor: pointer; position: relative; transition: all 0.2s; }
  .custom-check:checked { background: var(--rose); border-color: var(--rose); box-shadow: 0 0 10px var(--rose-glow); }
  .custom-check:checked::after { content: ''; position: absolute; left: 4.5px; top: 2px; width: 5px; height: 8px; border: 1.5px solid white; border-top: none; border-left: none; transform: rotate(40deg); }
  .check-label { font-size: 12px; color: var(--text-secondary); }
  .forgot { font-size: 12px; color: var(--rose); text-decoration: none; font-weight: 400; transition: opacity 0.2s; }
  .forgot:hover { opacity: 0.7; }
  .btn-main { width: 100%; padding: 15px; background: linear-gradient(135deg, #c41f5a 0%, #ff2d78 50%, #e8266b 100%); border: none; border-radius: 13px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; color: white; letter-spacing: 0.5px; cursor: pointer; position: relative; overflow: hidden; transition: all 0.3s ease; box-shadow: 0 6px 30px rgba(255,45,120,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset; }
  .btn-main::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%); border-radius: inherit; }
  .btn-main::after { content: ''; position: absolute; top: -50%; left: -60%; width: 30%; height: 200%; background: rgba(255,255,255,0.15); transform: skewX(-20deg); transition: left 0.5s ease; }
  .btn-main:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,45,120,0.55); }
  .btn-main:hover::after { left: 130%; }
  .btn-main:active { transform: translateY(0); }
  .btn-main:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; z-index: 1; }
  .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
  .div-line { flex: 1; height: 1px; background: var(--glass-border); }
  .div-text { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); }
  .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .btn-social { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 11px; font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 400; color: var(--text-secondary); cursor: pointer; transition: all 0.2s ease; }
  .btn-social:hover { background: rgba(255,255,255,0.07); border-color: var(--glass-border-bright); color: var(--text-primary); transform: translateY(-1px); }
  .form-footer { text-align: center; margin-top: 24px; font-size: 12px; color: var(--text-muted); }
  .form-footer a { color: var(--rose); text-decoration: none; font-weight: 500; }
  .form-footer a:hover { opacity: 0.75; }
  .f-panel.hidden { display: none; }
  .deco-circle { position: fixed; border-radius: 50%; border: 1px solid rgba(255,45,120,0.08); pointer-events: none; z-index: 0; }
  .dc1 { width: 800px; height: 800px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
  .dc2 { width: 500px; height: 500px; top: 50%; left: 50%; transform: translate(-50%,-50%); border-color: rgba(232,200,122,0.06); }
  .dc3 { width: 200px; height: 200px; top: 10%; right: 5%; }
  .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(80px); z-index: 9999; padding: 14px 24px; border-radius: 14px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; backdrop-filter: blur(20px); border: 1px solid; opacity: 0; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); pointer-events: none; white-space: nowrap; }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .toast.success { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.3); color: #6ee7b7; }
  .toast.error { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #fca5a5; }
  .toast.loading { background: rgba(255,45,120,0.12); border-color: rgba(255,45,120,0.25); color: var(--text-secondary); }
  .theme-toggle { position: fixed; top: 28px; right: 28px; z-index: 1000; width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.05); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; color: var(--text-primary); }
  .theme-toggle:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
  .theme-toggle svg { width: 20px; height: 20px; transition: transform 0.4s ease; }
  .theme-toggle.dark-mode svg { transform: rotate(180deg); }
  @media (max-width: 768px) { .page{grid-template-columns:1fr} .panel-left{display:none} .panel-right{padding:40px 24px} .form-card{padding:36px 28px} }
</style>

<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

<div class="bg"></div>
<div class="bg-orb orb1"></div>
<div class="bg-orb orb2"></div>
<div class="bg-orb orb3"></div>
<div class="bg-grid"></div>
<div class="bg-noise"></div>
<div class="deco-circle dc1"></div>
<div class="deco-circle dc2"></div>
<div class="deco-circle dc3"></div>
<div class="toast" id="toast"></div>

<button class="theme-toggle dark-mode" id="themeToggle" onclick="toggleTheme()" title="Toggle theme">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
</button>

<div class="page">
  <div class="panel-left">
    <div class="brand">
      <div class="brand-icon">🎓</div>
      <div class="brand-text">
        <div class="brand-name">DoubtSolver</div>
        <div class="brand-sub">Academic Community</div>
      </div>
    </div>
    <div class="hero">
      <div class="hero-eyebrow">
        <div class="eyebrow-line"></div>
        <span class="eyebrow-text">Est. for Curious Minds</span>
      </div>
      <h1 class="hero-heading">Where every<br /><em>question</em> finds<br />its <span class="gold">answer.</span></h1>
      <p class="hero-desc">Join 50,000+ students collaborating, learning, and solving academic doubts together — from your college community, to the world.</p>
      <div class="stats">
        <div class="stat"><div class="stat-num">50K+</div><div class="stat-label">Doubts solved</div></div>
        <div class="stat"><div class="stat-num">120+</div><div class="stat-label">Colleges</div></div>
        <div class="stat"><div class="stat-num">4.9★</div><div class="stat-label">Student rating</div></div>
      </div>
      <div class="testimonial">
        <div class="testi-avatars">
          <div class="testi-avatar">A</div>
          <div class="testi-avatar">R</div>
          <div class="testi-avatar">K</div>
        </div>
        <div class="testi-text"><strong>3,200 students</strong> joined this week</div>
      </div>
    </div>
    <div style="font-size:11px;color:var(--text-muted);letter-spacing:0.5px;">© 2025 DoubtSolver. Built for scholars.</div>
  </div>

  <div class="panel-right">
    <div class="form-card" id="formCard">
      <div class="tab-wrap">
        <div class="tab-pill" id="tabPill"></div>
        <button class="tab-btn active" id="btnSignin" onclick="switchTab('signin')">Sign in</button>
        <button class="tab-btn" id="btnSignup" onclick="switchTab('signup')">Sign up</button>
      </div>

      <div class="f-panel" id="fSignin">
        <div class="form-title">Welcome back 👋</div>
        <div class="form-sub">Sign in to continue your learning journey</div>
        <form onsubmit="handleSignin(event)">
          <div class="field">
            <label class="field-label">Email address</label>
            <div class="input-shell">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              <input class="field-input" type="email" id="signinEmail" placeholder="you@college.edu" required />
            </div>
            <div class="field-error" id="signinEmailErr"></div>
          </div>
          <div class="field">
            <label class="field-label">Password</label>
            <div class="input-shell">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="field-input" type="password" id="pw1" placeholder="••••••••" required />
              <button class="eye-toggle" onclick="togglePw('pw1',this)" tabindex="-1" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="field-error" id="signinPwErr"></div>
          </div>
          <div class="meta-row">
            <label class="check-wrap"><input type="checkbox" class="custom-check" id="rememberMe" /><span class="check-label">Remember me</span></label>
            <a href="#" class="forgot" onclick="handleForgot(event)">Forgot password?</a>
          </div>
          <button type="submit" class="btn-main" id="signinBtn">
            <span class="btn-inner">Sign in <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
          </button>
        </form>
        <div class="divider"><div class="div-line"></div><span class="div-text">or continue with</span><div class="div-line"></div></div>
        <div class="social-row">
          <button class="btn-social">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button class="btn-social">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
            Phone OTP
          </button>
        </div>
        <div class="form-footer">Don't have an account? <a href="#" onclick="switchTab('signup');return false;">Sign up free</a></div>
      </div>

      <div class="f-panel hidden" id="fSignup">
        <div class="form-title">Join the community 🌸</div>
        <div class="form-sub">Create your account and start learning today</div>
        <form onsubmit="handleSignup(event)">
          <div class="field">
            <label class="field-label">Full name</label>
            <div class="input-shell">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <input class="field-input" type="text" id="signupName" placeholder="Your full name" required />
            </div>
            <div class="field-error" id="signupNameErr"></div>
          </div>
          <div class="field">
            <label class="field-label">College email</label>
            <div class="input-shell">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              <input class="field-input" type="email" id="signupEmail" placeholder="you@college.edu" required />
            </div>
            <div class="field-error" id="signupEmailErr"></div>
          </div>
          <div class="field">
            <label class="field-label">Password</label>
            <div class="input-shell">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="field-input" type="password" id="pw2" placeholder="Create a strong password (min 6)" required />
              <button class="eye-toggle" onclick="togglePw('pw2',this)" tabindex="-1" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="field-error" id="signupPwErr"></div>
          </div>
          <div class="field">
            <label class="field-label">Branch (optional)</label>
            <div class="input-shell">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <input class="field-input" type="text" id="signupBranch" placeholder="e.g. CSE, ECE, MBA" />
            </div>
          </div>
          <div style="margin-bottom:20px"></div>
          <button type="submit" class="btn-main" id="signupBtn">
            <span class="btn-inner">Create account <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
          </button>
        </form>
        <div class="divider"><div class="div-line"></div><span class="div-text">or continue with</span><div class="div-line"></div></div>
        <div class="social-row">
          <button class="btn-social">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button class="btn-social">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
            Phone OTP
          </button>
        </div>
        <div class="form-footer">Already have an account? <a href="#" onclick="switchTab('signin');return false;">Sign in</a></div>
      </div>
    </div>
  </div>
</div>
`;
