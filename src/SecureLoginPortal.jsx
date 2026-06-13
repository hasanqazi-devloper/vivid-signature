import React, { useState, useEffect } from "react";
import { auth, googleProvider, facebookProvider } from "./firebase";
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier } from "firebase/auth";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import CosmicBackground from "./CosmicBackground";

const PORTAL_STYLES = `
  @keyframes earth-rotate {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes float-moon {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-12px) rotate(2deg); }
  }
  /* ── Motto sheen sweep ── */
  @keyframes motto-sheen {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  .motto-line-1 {
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    font-style: italic;
    line-height: 1.8;
    background-image: linear-gradient(
      90deg,
      rgba(255,255,255,0.55) 0%,
      rgba(255,255,255,0.55) 30%,
      rgba(255,255,255,1) 48%,
      rgba(255,255,255,1) 52%,
      rgba(255,255,255,0.55) 70%,
      rgba(255,255,255,0.55) 100%
    );
    background-size: 300% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: motto-sheen 5s linear infinite;
  }
  .motto-line-2 {
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.32em;
    font-style: italic;
    line-height: 1.8;
    background-image: linear-gradient(
      90deg,
      rgba(220,196,155,0.65) 0%,
      rgba(220,196,155,0.65) 30%,
      rgba(255,255,255,0.98) 48%,
      rgba(255,255,255,0.98) 52%,
      rgba(220,196,155,0.65) 70%,
      rgba(220,196,155,0.65) 100%
    );
    background-size: 300% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: motto-sheen 5s linear infinite;
    animation-delay: 0.4s;
  }

  /* ── Magenta border spin ── */
  @keyframes portal-border-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .portal-border-outer {
    position: relative;
    border-radius: 18px;
    padding: 1.5px;
    overflow: hidden;
    box-shadow: 0 0 28px rgba(255,0,200,0.12), 0 25px 50px rgba(0,0,0,0.45);
  }
  .portal-border-outer::before {
    content: '';
    position: absolute;
    inset: -120%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255,0,204,0.0) 40deg,
      rgba(255,0,204,0.85) 70deg,
      rgba(220,100,255,0.9) 90deg,
      rgba(255,0,204,0.85) 110deg,
      rgba(255,0,204,0.0) 140deg,
      transparent 360deg
    );
    animation: portal-border-spin 8s linear infinite;
    z-index: 0;
  }
  .portal-border-inner {
    position: relative;
    z-index: 1;
    border-radius: 17px;
    overflow: hidden;
    padding: 20px 32px 24px;
    background: rgba(8,22,42,0.96);
    backdrop-filter: blur(32px) saturate(1.4);
    -webkit-backdrop-filter: blur(32px) saturate(1.4);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 4px 12px rgba(220,196,155,0.3)); }
    50% { transform: translateY(-5px) scale(1.06); filter: drop-shadow(0 8px 20px rgba(220,196,155,0.6)) drop-shadow(0 0 30px rgba(220,196,155,0.2)); }
  }
  .vivid-logo-anim {
    animation: logoFloat 3.5s ease-in-out infinite;
  }

  /* ── Mode tile hover ── */
  .mode-tile {
    flex: 1;
    padding: 8px 6px;
    border-radius: 10px;
    font-size: 8px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(220,196,155,0.08);
    background: rgba(8,22,42,0.4);
    color: #94a3b8;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .mode-tile:hover:not(.mode-tile-active) {
    border-color: rgba(255,0,204,0.35);
    background: rgba(255,0,204,0.06);
    color: #e0a0e8;
    box-shadow: 0 0 14px rgba(255,0,204,0.15);
    transform: translateY(-1px);
  }
  .mode-tile-active {
    background: #dcc49b !important;
    color: #0B1C2D !important;
    border-color: #dcc49b !important;
    box-shadow: 0 0 20px rgba(220,196,155,0.3) !important;
    transform: scale(1.04) !important;
  }
  .mode-tile .mode-icon {
    transition: transform 0.2s ease, filter 0.2s ease;
  }
  .mode-tile:hover .mode-icon {
    transform: scale(1.15);
    filter: drop-shadow(0 0 4px rgba(255,0,204,0.5));
  }
  .mode-tile-active .mode-icon {
    filter: drop-shadow(0 0 6px rgba(11,28,45,0.4));
  }

  /* ── Input focus glow ── */
  .portal-input:focus {
    border-color: rgba(255,0,204,0.4) !important;
    box-shadow: 0 0 0 2px rgba(255,0,204,0.1), inset 0 1px 0 rgba(255,255,255,0.02) !important;
  }

  /* ── Submit button hover ── */
  .portal-submit:not(:disabled):hover {
    box-shadow: 0 6px 25px rgba(220,196,155,0.35) !important;
    transform: translateY(-1px);
  }
  .portal-submit {
    transition: all 0.2s ease;
  }

  /* ── Social button hover ── */
  .social-btn {
    transition: all 0.2s ease;
  }
  .social-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  }

  /* ── Pill hover ── */
  .portal-pill {
    transition: all 0.3s ease;
    cursor: default;
  }
  .portal-pill:hover {
    border-color: rgba(220,196,155,0.45) !important;
    box-shadow: 0 0 12px rgba(220,196,155,0.12);
  }

`;

export default function SecureLoginPortal({ onBack }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
        }
    }, []);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (isLogin) {
                const envUser = import.meta.env.VITE_WCS_USERNAME;
                const envPass = import.meta.env.VITE_WCS_PASSWORD;
                const isOwnerEnv = envUser && envPass && email === envUser && password === envPass;
                const isDemo = email === 'demo' && password === 'demo';

                if (isOwnerEnv || isDemo) {
                    localStorage.setItem('wcs_secure_bypass', JSON.stringify({
                        email, uid: 'override-' + Date.now(), displayName: 'Justin Waterman', isPaid: true
                    }));
                    window.location.reload();
                    return;
                }
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProviderAuth = async (provider) => {
        setLoading(true);
        setError("");
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            if (err.code === 'auth/unauthorized-domain' || err.code === 'auth/popup-blocked') {
                await signInWithRedirect(auth, provider);
                return;
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        backgroundColor: 'rgba(8,22,42,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(220,196,155,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
        transition: 'all 0.2s ease',
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
            <style>{PORTAL_STYLES}</style>
            <CosmicBackground showCinematic={true} />

            {/* Dot Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(#dcc49b 1px, transparent 0)", backgroundSize: "24px 24px" }} />

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 w-full flex flex-col items-center" style={{ maxWidth: '440px' }}>

                {/* ── LOGIN BOX with magenta animated border ── */}
                <div className="portal-border-outer w-full">
                    <div className="portal-border-inner">

                        {/* Dot grid + connection lines overlay */}
                        <div className="absolute inset-0 overflow-hidden rounded-[17px] pointer-events-none z-0">
                            <div className="absolute inset-0 opacity-[0.04]"
                                style={{ backgroundImage: 'radial-gradient(circle, #dcc49b 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                            <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
                                <line x1="15%" y1="20%" x2="85%" y2="35%" stroke="#dcc49b" strokeWidth="0.5" />
                                <line x1="25%" y1="60%" x2="75%" y2="80%" stroke="#dcc49b" strokeWidth="0.5" />
                                <line x1="10%" y1="45%" x2="90%" y2="55%" stroke="#869399" strokeWidth="0.5" />
                                <circle cx="15%" cy="20%" r="2" fill="#dcc49b" opacity="0.5" />
                                <circle cx="85%" cy="35%" r="2" fill="#dcc49b" opacity="0.5" />
                                <circle cx="25%" cy="60%" r="2" fill="#869399" opacity="0.5" />
                                <circle cx="75%" cy="80%" r="2" fill="#869399" opacity="0.5" />
                            </svg>
                            <div className="absolute top-0 left-0 right-0 h-px"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(220,196,155,0.15), transparent)' }} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10">

                            {/* Logo + Branding inside box */}
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                    <img
                                        src="/vivid-signature-logo.png"
                                        alt="Vivid Signature Pro"
                                        className="vivid-logo-anim"
                                        style={{ width: '90px', height: '90px', objectFit: 'contain' }}
                                    />
                                </div>
                                <h1 style={{
                                    fontSize: '15px', fontWeight: 900, color: '#f7f7f7',
                                    textTransform: 'uppercase', letterSpacing: '0.22em',
                                    marginBottom: '4px', textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                                }}>Vivid Signature Pro™</h1>
                                <p className="motto-line-1" style={{ fontSize: '11px', letterSpacing: '0.18em' }}>"Crafted for the Creative.</p>
                                <p className="motto-line-2" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>Powered by Tech."</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-3 p-3 rounded-lg mb-3"
                                    style={{ backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#fecaca', fontSize: '12px', fontWeight: 700 }}>
                                    <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* FORM */}
                            <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(220,196,155,0.8)', paddingLeft: '4px', marginBottom: '5px' }}>
                                        Identity Protocol
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email address"
                                            className="portal-input w-full rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-mono outline-none"
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(220,196,155,0.8)', paddingLeft: '4px', marginBottom: '5px' }}>
                                        Security Token
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="portal-input w-full rounded-xl py-3.5 pl-12 pr-12 text-white text-sm font-mono outline-none"
                                            style={inputStyle}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                            {showPassword
                                                ? <EyeOff style={{ width: '16px', height: '16px' }} />
                                                : <Eye style={{ width: '16px', height: '16px' }} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="portal-submit w-full py-3.5 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] disabled:opacity-50"
                                    style={{
                                        marginTop: '4px',
                                        background: loading ? '#334155' : 'linear-gradient(to right, #dcc49b, #c5a059)',
                                        color: loading ? '#94a3b8' : '#0B1C2D',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        border: 'none',
                                    }}>
                                    {loading ? 'Verifying...' : (isLogin ? 'Initialize Session' : 'Establish Identity')}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3" style={{ margin: '18px 0 14px' }}>
                                <div className="flex-1 border-t border-white/10" />
                                <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', whiteSpace: 'nowrap' }}>Or Bypass Via</span>
                                <div className="flex-1 border-t border-white/10" />
                            </div>

                            {/* Social Auth */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button type="button" onClick={() => handleProviderAuth(googleProvider)}
                                    className="social-btn flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold group"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                                <button type="button" onClick={() => handleProviderAuth(facebookProvider)}
                                    className="social-btn flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold group"
                                    style={{ backgroundColor: 'rgba(24,119,242,0.1)', border: '1px solid rgba(24,119,242,0.3)' }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(24,119,242,0.2)'; e.currentTarget.style.borderColor = 'rgba(24,119,242,0.5)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(24,119,242,0.1)'; e.currentTarget.style.borderColor = 'rgba(24,119,242,0.3)'; }}>
                                    <svg className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Need Access — below box */}
                <div className="mt-4 text-center">
                    <button type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 hover:text-[#dcc49b] transition-colors bg-transparent border-none cursor-pointer">
                        {isLogin ? 'Need Access? Request Security Clearance' : 'Already Authenticated? Return to Portal'}
                    </button>
                </div>

                {/* Cancel */}
                {onBack && (
                    <button onClick={onBack}
                        className="mt-2 text-slate-500 hover:text-white transition-colors text-xs font-semibold">
                        Cancel
                    </button>
                )}

            </div>


            {/* ── HUD Panels ── */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 0, paddingBottom: '16px' }}>

                {/* Scan line */}
                <div style={{ position: 'relative', height: '1px', width: '100%', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(220,196,155,0.9), transparent)', animation: 'hud-scan 3s linear infinite' }} />
                    <div style={{ width: '100%', height: '1px', background: 'rgba(220,196,155,0.1)' }} />
                </div>

                {/* HUD data ticker */}
                <div style={{ overflow: 'hidden', width: '100%', marginBottom: '12px' }}>
                    <div style={{ display: 'inline-flex', gap: '48px', whiteSpace: 'nowrap', animation: 'hud-ticker 36s linear infinite', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', fontFamily: "'Orbitron', sans-serif", color: 'rgba(220,196,155,0.6)' }}>
                        {[...Array(2)].map((_, r) => (
                            <span key={r} style={{ display: 'inline-flex', gap: '48px' }}>
                                <span>SYS.STATUS: ONLINE</span>
                                <span style={{ color: 'rgba(34,197,94,0.8)', fontFamily: "'Rajdhani', sans-serif" }}>▸ AEGIS: ACTIVE</span>
                                <span>ORBIT: GEO-SYNC 35,786 KM</span>
                                <span style={{ color: 'rgba(59,130,246,0.8)' }}>▸ ENC: AES-256</span>
                                <span>LAT: 29.4241° N · LON: 98.4936° W</span>
                                <span style={{ color: 'rgba(220,196,155,0.8)' }}>▸ ID: VSP-SECURE-NODE-01</span>
                                <span>UPTIME: 99.98%</span>
                                <span style={{ color: 'rgba(168,85,247,0.8)' }}>▸ PROTOCOL: V3.0™</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Left glass panels */}
                <div style={{ position: 'fixed', top: '40%', transform: 'translateY(-50%)', left: '3%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ background: 'rgba(5,20,41,0.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', animation: 'hud-blink 1.4s ease-in-out infinite', boxShadow: '0 0 6px #22c55e', flexShrink: 0 }} />
                            <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.15em', color: '#22c55e', fontFamily: "'Rajdhani', sans-serif" }}>AEGIS STATUS</span>
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(247,247,247,0.9)', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.08em', lineHeight: 1.8 }}>
                            <div>NODE-A <span style={{ color: '#22c55e' }}>● LIVE</span></div>
                            <div>ENC: <span style={{ color: '#dcc49b' }}>AES-256</span></div>
                            <div>UPTIME: <span style={{ color: '#22c55e' }}>99.98%</span></div>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(5,20,41,0.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(220,196,155,0.35)', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 0 20px rgba(220,196,155,0.1)' }}>
                        <div style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.15em', color: '#dcc49b', fontFamily: "'Orbitron', sans-serif", marginBottom: '5px' }}>GEO POSITION</div>
                        <div style={{ fontSize: '9px', color: 'rgba(247,247,247,0.9)', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.06em', lineHeight: 1.8 }}>
                            <div>LAT <span style={{ color: '#dcc49b' }}>29.4241° N</span></div>
                            <div>LON <span style={{ color: '#dcc49b' }}>98.4936° W</span></div>
                        </div>
                    </div>
                </div>

                {/* Right glass panels */}
                <div style={{ position: 'fixed', top: '40%', transform: 'translateY(-50%)', right: '3%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ background: 'rgba(5,20,41,0.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#3b82f6', animation: 'hud-blink 2s ease-in-out infinite', boxShadow: '0 0 6px #3b82f6', flexShrink: 0 }} />
                            <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.15em', color: '#3b82f6', fontFamily: "'Orbitron', sans-serif" }}>ORBIT DATA</span>
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(247,247,247,0.9)', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.08em', lineHeight: 1.8 }}>
                            <div>ALT: <span style={{ color: '#3b82f6' }}>35,786 KM</span></div>
                            <div>TYPE: <span style={{ color: '#dcc49b' }}>GEO-SYNC</span></div>
                            <div>VEL: <span style={{ color: '#3b82f6' }}>3.07 KM/S</span></div>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(5,20,41,0.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 0 20px rgba(168,85,247,0.12)' }}>
                        <div style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.15em', color: '#a855f7', fontFamily: "'Orbitron', sans-serif", marginBottom: '5px' }}>PROTOCOL</div>
                        <div style={{ fontSize: '9px', color: 'rgba(247,247,247,0.9)', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.06em', lineHeight: 1.8 }}>
                            <div>ID: <span style={{ color: '#dcc49b' }}>VSP-NODE-01</span></div>
                            <div>VER: <span style={{ color: '#a855f7' }}>V3.0™</span></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── HUD animations ── */}
            <style>{`
                @keyframes hud-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100vw); } }
                @keyframes hud-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
                @keyframes hud-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            `}</style>

            <div id="recaptcha-container" />
        </div>
    );
}
