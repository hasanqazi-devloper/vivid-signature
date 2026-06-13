import React, { useEffect, useRef } from 'react';

const earthImg = 'https://static.wixstatic.com/media/7f7b7e_8f164ba8e4084c1d8e0789612b262d35~mv2.png';
const moonImg = 'https://static.wixstatic.com/media/7f7b7e_aeb6ab05c4fa4ff7ae082944155d01b7~mv2.png';

const CosmicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    window.addEventListener('resize', resize);
    resize();

    const STAR_COUNT = 400;
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const tier = Math.random();
      let size, opacity, speed, color;
      if (tier < 0.48) {
        size = 0.15 + Math.random() * 0.35;
        opacity = 0.3 + Math.random() * 0.5;
        speed = 0.02 + Math.random() * 0.04;
        color = 'rgba(240,244,255,';
      } else if (tier < 0.78) {
        size = 0.5 + Math.random() * 0.65;
        opacity = 0.45 + Math.random() * 0.45;
        speed = 0.04 + Math.random() * 0.07;
        color = Math.random() > 0.65 ? 'rgba(190,215,255,' : 'rgba(248,248,248,';
      } else if (tier < 0.94) {
        size = 1.1 + Math.random() * 0.9;
        opacity = 0.65 + Math.random() * 0.3;
        speed = 0.035 + Math.random() * 0.055;
        color = Math.random() > 0.5 ? 'rgba(168,196,220,' : 'rgba(160,210,255,';
      } else {
        size = 2.0 + Math.random() * 2.0;
        opacity = 0.85 + Math.random() * 0.15;
        speed = 0.015 + Math.random() * 0.03;
        color = Math.random() > 0.4 ? 'rgba(255,255,255,' : 'rgba(168,196,220,';
      }
      stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, size, opacity, speed, color });
    }

    const shootingStars = [];
    const particles = [];

    const createBurst = (x, y) => {
      for (let i = 0; i < 12; i++) {
        particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 1, color: Math.random() > 0.5 ? '#a8c4dc' : '#00f2ff' });
      }
    };

    const animate = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, vw, vh);
      const time = Date.now();

      stars.forEach(s => {
        const twinkle = s.opacity * (0.55 + Math.sin(time * 0.0008 + s.x * 0.009) * 0.45);
        if (s.size > 1.8) {
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
          halo.addColorStop(0, `${s.color}${(twinkle * 0.55).toFixed(2)})`);
          halo.addColorStop(0.4, `${s.color}${(twinkle * 0.2).toFixed(2)})`);
          halo.addColorStop(1, `${s.color}0)`);
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2); ctx.fill();
        } else if (s.size > 0.9) {
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
          halo.addColorStop(0, `${s.color}${(twinkle * 0.35).toFixed(2)})`);
          halo.addColorStop(1, `${s.color}0)`);
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `${s.color}${Math.min(twinkle, 1).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
        s.y += s.speed;
        if (s.y > vh) { s.y = 0; s.x = Math.random() * vw; }
      });

      if (Math.random() < 0.018) {
        shootingStars.push({ x: Math.random() * vw, y: Math.random() * vh * 0.6, vx: (Math.random() + 2) * 10, vy: (Math.random() - 0.5) * 2, life: 1, len: 2.5 + Math.random() * 1.5 });
      }

      shootingStars.forEach((s, idx) => {
        const tailLen = (s.len || 2) * s.vx;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - tailLen, s.y - s.vy * (s.len || 2));
        grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
        grad.addColorStop(0.3, `rgba(168,196,220,${s.life * 0.8})`);
        grad.addColorStop(1, `rgba(168,196,220,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - tailLen, s.y - s.vy * (s.len || 2)); ctx.stroke();
        s.x += s.vx; s.y += s.vy; s.life -= 0.02;
        if (Math.random() < 0.05 && s.life > 0.5) createBurst(s.x, s.y);
        if (s.life <= 0) shootingStars.splice(idx, 1);
      });

      particles.forEach((p, idx) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2); ctx.fill();
        p.x += p.vx; p.y += p.vy; p.life -= 0.05;
        if (p.life <= 0) particles.splice(idx, 1);
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Earth — top-left, partially off-screen */}
      <img src={earthImg} alt="" style={{
        position: 'absolute',
        width: '44vmin',
        height: '44vmin',
        top: 'calc(44vmin * -0.45)',
        left: 'calc(44vmin * -0.45)',
        zIndex: 1,
        objectFit: 'cover',
        display: 'block',
        filter: 'drop-shadow(0 0 40px rgba(30,90,255,0.5))',
      }} />

      {/* Moon — top-right, partially off-screen */}
      <img src={moonImg} alt="" style={{
        position: 'absolute',
        width: '18vmin',
        height: '18vmin',
        top: 'calc(18vmin * -0.2)',
        right: 'calc(18vmin * -0.2)',
        zIndex: 1,
        objectFit: 'cover',
        display: 'block',
        filter: 'drop-shadow(0 0 20px rgba(200,215,240,0.4))',
      }} />
    </div>
  );
};

export default CosmicBackground;
