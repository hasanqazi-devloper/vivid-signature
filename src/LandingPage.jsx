import { useState, useEffect, useRef } from "react";
import CheckoutButton from "./CheckoutButton.jsx";
import { useAuth } from "./AuthContext.jsx";
import useResponsive from "./hooks/useResponsive.js";
import PoweredByBadge from './components/PoweredByBadge';

/* ═══════════════════════════════════════════════════════════════
   VIVID SIGNATURE PRO™ — PREMIUM LANDING PAGE
   Full WCS Prestige Standard: Cosmic BG, Glassmorphism, Motion Borders
   ═══════════════════════════════════════════════════════════════ */

const TIERS = [
  {
    name: "Starter",
    price: { monthly: 9.99, yearly: 99.99 },
    badge: null,
    borderClass: "motion-border-purple",
    color: "#a855f7",
    features: [
      "1 Admin Account",
      "Up to 1 Employee",
      "Company Logo / Photo Upload",
      "3 Social Icons (of 30)",
      "Email-Safe Font Stack",
      "Basic Color Palette",
      "Email-Safe Wide + Compact Layouts",
      "Gmail • Outlook • Apple Mail Ready",
    ],
    excluded: [
      "Disclaimer Section",
      "Advanced Mobile Glass Cards",
      "Outline / CTA Refinements",
      "Team Controls",
    ],
  },
  {
    name: "Professional",
    price: { monthly: 24.99, yearly: 249.99 },
    badge: "BEST VALUE",
    borderClass: "motion-border-blue",
    color: "#3b82f6",
    features: [
      "3 Admin Accounts",
      "Up to 10 Employees",
      "10 Social Icons (of 30)",
      "Logo & Photo Upload",
      "Full Email-Safe Font Set",
      "Custom Color Palette",
      "Disclaimer Section",
      "Wide, Banner, Rectangle, Compact Layouts",
      "Mobile Glass + Glass Mini Layouts",
      "Outline + Solid Booking CTAs",
    ],
    excluded: [
      "UTM Link Analytics",
      "Multiple Phone / Email",
      "Enterprise Seat Controls",
    ],
  },
  {
    name: "Business",
    price: { monthly: 44.99, yearly: 449.00 },
    badge: "POPULAR",
    borderClass: "motion-border-gold",
    color: "#dcc49b",
    features: [
      "5 Admin Accounts",
      "Up to 20 Employees",
      "20 Social Icons (of 30)",
      "Everything in Professional",
      "Wide Mini Executive Panel",
      "Google Calendar / Booking Link Support",
      "UTM Campaign Parameters",
      "Link Analytics Tracking",
      "Priority Email Support",
    ],
    excluded: ["All Social Icon Shapes", "Multiple Phone / Email"],
  },
  {
    name: "Enterprise",
    price: { monthly: 99.99, yearly: 999.99 },
    badge: "ALL ACCESS",
    borderClass: "motion-border-green",
    color: "#22c55e",
    features: [
      "10 Admin Accounts",
      "Up to 50 Employees",
      "All 30 Social Icons",
      "All Safe Icon Shapes",
      "Multiple Phone / Email",
      "Everything in Business",
      "Dedicated Brand Guardrails",
      "Google Analytics Integration",
      "White-Glove Onboarding",
      "Dedicated Support Channel",
    ],
    excluded: [],
  },
];

const FEATURES_GRID = [
  { icon: "✉️", title: "One-Click Deploy", desc: "Auto-inject to Gmail, Outlook, and Apple Mail in seconds.", accent: "#2dd4bf", border: "motion-border-teal" },
  { icon: "🎨", title: "Premium Glass Panels", desc: "Static glass-inspired layouts engineered to stay intact in real inboxes.", accent: "#a855f7", border: "motion-border-purple" },
  { icon: "⚡", title: "Inbox-Safe Formatting", desc: "Built around the subset of HTML and CSS Gmail, Outlook, and Apple Mail actually keep.", accent: "#dcc49b", border: "motion-border-gold" },
  { icon: "🔗", title: "30 Social Platforms", desc: "LinkedIn, Instagram, X, TikTok, YouTube, and 25 more.", accent: "#3b82f6", border: "motion-border-blue" },
  { icon: "📅", title: "Booking CTAs", desc: "Add solid or outline booking buttons plus clean scheduling links.", accent: "#22c55e", border: "motion-border-green" },
  { icon: "👥", title: "Team Management", desc: "Admin controls for consistent signatures across your org.", accent: "#06b6d4", border: "motion-border-cyan" },
  { icon: "📱", title: "Mobile-First Cards", desc: "Smaller glass cards and larger executive panels tuned for mobile, tablet, and desktop previews.", accent: "#10b981", border: "motion-border-emerald" },
  { icon: "📊", title: "Link Analytics", desc: "Track every click with UTM parameters and Google Analytics integration.", accent: "#f59e0b", border: "motion-border-gold" },
  { icon: "🔐", title: "AES-256 Encryption", desc: "Every signature, logo, and contact detail encrypted at rest and in transit — zero exposure, zero compromise.", accent: "#dcc49b", border: "motion-border-gold" },
  { icon: "🛡️", title: "AEGIS Titanium V3™", desc: "Proprietary dual-architecture framework that isolates your brand data from every other account on the platform.", accent: "#3b82f6", border: "motion-border-blue" },
  { icon: "📋", title: "Compliance Ready", desc: "Built to HIPAA, SOC 2, and financial data standards — protecting medical, dental, legal, and CRE professionals.", accent: "#2dd4bf", border: "motion-border-teal" },
  { icon: "🔑", title: "Access Control", desc: "Role-based admin permissions so only the right people touch the brand. Lock it down at the org level.", accent: "#8b5cf6", border: "motion-border-violet" },
];

/* ─── DEEP SPACE VOID ENGINE ─── */
function CosmicCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let dpr = 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    // ── STARS (300+ mix of tiny and large) ──
    const stars = [];
    for (let i = 0; i < 350; i++) {
      const isLarge = Math.random() < 0.08;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: isLarge ? 1.5 + Math.random() * 2.5 : 0.15 + Math.random() * 0.7,
        alpha: isLarge ? 0.6 + Math.random() * 0.4 : 0.15 + Math.random() * 0.5,
        speed: Math.random() * 0.0008 + 0.0002,
        phase: Math.random() * Math.PI * 2,
        color: isLarge
          ? (Math.random() < 0.4 ? [220, 196, 155] : Math.random() < 0.5 ? [147, 197, 253] : [200, 180, 255])
          : [255, 255, 255],
        hasRays: isLarge && Math.random() < 0.5,
      });
    }

    // ── NEBULA CLOUDS ──
    const nebulae = [
      // Deep purple nebula — large, dominant
      { x: 0.15, y: 0.25, rx: 0.35, ry: 0.25, r: 80, g: 20, b: 120, a: 0.04 },
      { x: 0.7, y: 0.6, rx: 0.3, ry: 0.2, r: 60, g: 15, b: 100, a: 0.035 },
      { x: 0.4, y: 0.8, rx: 0.4, ry: 0.15, r: 90, g: 25, b: 130, a: 0.03 },
      // Blue nebula wisps
      { x: 0.8, y: 0.2, rx: 0.25, ry: 0.2, r: 30, g: 60, b: 160, a: 0.03 },
      { x: 0.3, y: 0.5, rx: 0.2, ry: 0.3, r: 20, g: 50, b: 140, a: 0.025 },
      { x: 0.6, y: 0.15, rx: 0.15, ry: 0.1, r: 50, g: 80, b: 180, a: 0.02 },
      // Subtle gold dust near center
      { x: 0.5, y: 0.35, rx: 0.12, ry: 0.08, r: 220, g: 196, b: 155, a: 0.015 },
    ];

    // ── SHOOTING STARS ──
    let shootingStars = [];
    let particles = [];

    // "View Pricing" CTA is roughly at 58% x, 82% y of viewport
    const CTA_X_RATIO = 0.58;
    const CTA_Y_RATIO = 0.82;

    const spawnShooter = () => {
      if (shootingStars.length >= 4) return;
      if (Math.random() > 0.025) return;

      const w = canvas.width, h = canvas.height;
      const isLarge = Math.random() < 0.4;
      const isTargeted = Math.random() < 0.4; // 40% aim at View Pricing CTA
      const isBlackHoleTargeted = !isTargeted && Math.random() < 0.3; // 18% aim at Black Hole (Reverse)

      let sx, sy, vx, vy;

      if (isTargeted) {
        // Spawn from top/corners, arc toward CTA
        const side = Math.random();
        if (side < 0.33) {
          sx = Math.random() * w * 0.3; sy = Math.random() * h * 0.1; // top-left
        } else if (side < 0.66) {
          sx = w * 0.4 + Math.random() * w * 0.2; sy = 0; // top-center
        } else {
          sx = w * 0.7 + Math.random() * w * 0.3; sy = Math.random() * h * 0.15; // top-right
        }
        const tx = w * CTA_X_RATIO + (Math.random() - 0.5) * 60;
        const ty = h * CTA_Y_RATIO + (Math.random() - 0.5) * 30;
        const dx = tx - sx, dy = ty - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = isLarge ? 5 + Math.random() * 4 : 3 + Math.random() * 3;
        vx = (dx / dist) * speed;
        vy = (dy / dist) * speed;
      } else if (isBlackHoleTargeted) {
        // Spawn nearby and aim TOWARDS the black hole (reverse shooting stars)
        const bhX = w * 0.85, bhY = h * 0.12;
        const spawnAngle = Math.random() * Math.PI * 2;
        const spawnDist = w * 0.15 + Math.random() * w * 0.2;
        sx = bhX + Math.cos(spawnAngle) * spawnDist;
        sy = bhY + Math.sin(spawnAngle) * spawnDist;
        const dx = bhX - sx, dy = bhY - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = isLarge ? 4 + Math.random() * 3 : 2 + Math.random() * 3;
        vx = (dx / dist) * speed;
        vy = (dy / dist) * speed;
      } else {
        // Random deep-space shooting stars
        const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4);
        const speed = isLarge ? 6 + Math.random() * 6 : 3 + Math.random() * 4;
        sx = Math.random() * w * 0.9;
        sy = Math.random() * h * 0.4;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      shootingStars.push({
        x: sx, y: sy, vx, vy, life: 1,
        decay: isLarge ? 0.005 + Math.random() * 0.005 : 0.012 + Math.random() * 0.012,
        width: isLarge ? 2.5 + Math.random() * 2 : 0.8 + Math.random() * 0.8,
        tailLen: isLarge ? 100 + Math.random() * 140 : 30 + Math.random() * 40,
        isLarge, isTargeted,
        color: isTargeted ? [220, 196, 155] : (Math.random() < 0.7 ? [220, 196, 155] : [180, 200, 255]),
      });
    };

    const spawnBurstParticles = (x, y, color, isBig) => {
      const count = isBig ? 14 + Math.floor(Math.random() * 12) : 6 + Math.floor(Math.random() * 8);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = isBig ? 1 + Math.random() * 3.5 : 0.5 + Math.random() * 2;
        particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: isBig ? 0.8 + Math.random() * 0.4 : 0.5 + Math.random() * 0.4,
          decay: isBig ? 0.012 + Math.random() * 0.015 : 0.02 + Math.random() * 0.02,
          r: isBig ? 1 + Math.random() * 2.5 : 0.5 + Math.random() * 1.5,
          color,
        });
      }
    };

    // ── DRAW LOOP ──
    const draw = (time) => {
      const w = canvas.width / dpr, h = canvas.height / dpr;

      // Absolute black void
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // ── MILKY WAY GALACTIC BAND (diagonal across screen) ──
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(-0.5); // ~30 degree tilt
      // Core band — bright dense center
      const mwGrad = ctx.createLinearGradient(0, -h * 0.06, 0, h * 0.06);
      mwGrad.addColorStop(0, "rgba(0,0,0,0)");
      mwGrad.addColorStop(0.3, "rgba(180,160,220,0.015)");
      mwGrad.addColorStop(0.45, "rgba(200,190,240,0.03)");
      mwGrad.addColorStop(0.5, "rgba(220,210,255,0.045)");
      mwGrad.addColorStop(0.55, "rgba(200,190,240,0.03)");
      mwGrad.addColorStop(0.7, "rgba(180,160,220,0.015)");
      mwGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = mwGrad;
      ctx.fillRect(-w, -h * 0.12, w * 2, h * 0.24);
      // Wider purple haze around band
      const mwOuter = ctx.createLinearGradient(0, -h * 0.18, 0, h * 0.18);
      mwOuter.addColorStop(0, "rgba(0,0,0,0)");
      mwOuter.addColorStop(0.35, "rgba(60,20,100,0.012)");
      mwOuter.addColorStop(0.5, "rgba(80,30,130,0.02)");
      mwOuter.addColorStop(0.65, "rgba(60,20,100,0.012)");
      mwOuter.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = mwOuter;
      ctx.fillRect(-w, -h * 0.25, w * 2, h * 0.5);
      // Dense star dust along band
      for (let i = 0; i < 200; i++) {
        const sx = (Math.random() - 0.5) * w * 1.8;
        const sy = (Math.random() - 0.5) * h * 0.08;
        const sr = Math.random() * 0.5 + 0.1;
        const sa = Math.random() * 0.35 + 0.05;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
      }
      ctx.restore();

      // ── NEBULA CLOUDS (slow drift) ──
      nebulae.forEach((n, i) => {
        const drift = Math.sin(time * 0.00008 + i * 1.5) * 0.02;
        const cx = (n.x + drift) * w;
        const cy = n.y * h;
        const rx = n.rx * w;
        const ry = n.ry * h;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, ry / rx);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        grad.addColorStop(0, `rgba(${n.r},${n.g},${n.b},${n.a * 1.5})`);
        grad.addColorStop(0.4, `rgba(${n.r},${n.g},${n.b},${n.a})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
        ctx.restore();
      });

      // ── DISTANT ROARING ICE COMET (TOP LEFT) ──
      const cometX = w * 0.15;
      const cometY = h * 0.2;
      const cometTailX = cometX - 80;
      const cometTailY = cometY - 40;
      const cometGrad = ctx.createLinearGradient(cometX, cometY, cometTailX, cometTailY);
      cometGrad.addColorStop(0, "rgba(180, 220, 255, 0.8)");
      cometGrad.addColorStop(0.2, "rgba(120, 180, 255, 0.4)");
      cometGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.moveTo(cometX, cometY);
      ctx.lineTo(cometTailX, cometTailY);
      ctx.strokeStyle = cometGrad;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cometX, cometY, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();


      // ── BLACK HOLE — TOP RIGHT (near Open Builder CTA) ──
      const bhX = w * 0.85, bhY = h * 0.12;
      const bhR = Math.min(w, h) * 0.10;

      // Accretion disk — spinning halo
      const accAngle = time * 0.0003;
      ctx.save();
      ctx.translate(bhX, bhY);
      ctx.rotate(accAngle);
      // Outer purple/gold ring
      for (let r = 0; r < 3; r++) {
        const ringR = bhR * (1.5 + r * 0.4);
        ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = r === 0
          ? `rgba(120,40,180,${0.06 - r * 0.015})`
          : r === 1
            ? `rgba(220,196,155,${0.04})`
            : `rgba(60,100,200,${0.025})`;
        ctx.lineWidth = 2 - r * 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // Outer accretion glow
      const ring = ctx.createRadialGradient(bhX, bhY, bhR * 0.4, bhX, bhY, bhR * 2.8);
      ring.addColorStop(0, "rgba(0,0,0,0.97)");
      ring.addColorStop(0.25, "rgba(100,30,160,0.05)");
      ring.addColorStop(0.45, "rgba(60,80,180,0.035)");
      ring.addColorStop(0.65, "rgba(220,196,155,0.02)");
      ring.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ring;
      ctx.fillRect(bhX - bhR * 3, bhY - bhR * 3, bhR * 6, bhR * 6);

      // Inner event horizon — absolute black
      const hole = ctx.createRadialGradient(bhX, bhY, 0, bhX, bhY, bhR * 0.8);
      hole.addColorStop(0, "rgba(0,0,0,1)");
      hole.addColorStop(0.6, "rgba(0,0,0,0.95)");
      hole.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hole;
      ctx.fillRect(bhX - bhR, bhY - bhR, bhR * 2, bhR * 2);

      // ── STARS (with gravitational orbit around black hole) ──
      const orbitSpeed = time * 0.00015; // slow global orbit
      stars.forEach((s) => {
        const pulse = Math.sin(time * s.speed + s.phase) * 0.35 + 0.65;
        const a = s.alpha * pulse;
        const [cr, cg, cb] = s.color;

        // Gravitational orbit — closer stars orbit faster
        const dx = s.x - bhX, dy = s.y - bhY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxOrbit = Math.min(w, h) * 0.6;
        const orbitStrength = Math.max(0, 1 - dist / maxOrbit);
        const angle = Math.atan2(dy, dx);
        const orbitAngle = angle + orbitSpeed * (orbitStrength * orbitStrength * 3);
        const drawX = bhX + Math.cos(orbitAngle) * dist;
        const drawY = bhY + Math.sin(orbitAngle) * dist;

        if (s.hasRays && s.r > 2) {
          ctx.save();
          ctx.globalAlpha = a * 0.4;
          ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
          ctx.lineWidth = 0.5;
          const len = s.r * 4;
          ctx.beginPath();
          ctx.moveTo(drawX - len, drawY); ctx.lineTo(drawX + len, drawY);
          ctx.moveTo(drawX, drawY - len); ctx.lineTo(drawX, drawY + len);
          ctx.stroke();
          ctx.restore();
        }

        if (s.r > 1.5) {
          const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, s.r * 3);
          glow.addColorStop(0, `rgba(${cr},${cg},${cb},${a * 0.3})`);
          glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = glow;
          ctx.fillRect(drawX - s.r * 3, drawY - s.r * 3, s.r * 6, s.r * 6);
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
        ctx.fill();
      });

      // ── SHOOTING STARS ──
      spawnShooter();
      shootingStars = shootingStars.filter((ss) => {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;

        if (ss.life <= 0) {
          if (ss.isLarge || ss.isTargeted) spawnBurstParticles(ss.x, ss.y, ss.color, ss.isTargeted);
          return false;
        }

        const [cr, cg, cb] = ss.color;
        const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.tailLen;
        const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.tailLen;

        const dx = tailX - ss.x;
        const dy = tailY - ss.y;
        const steps = 18; // Number of pixels in the tail
        for (let i = 0; i < steps; i++) {
          const px = ss.x + (dx * i) / steps;
          const py = ss.y + (dy * i) / steps;
          const size = (ss.width * ss.life) * (1.2 - i / steps);
          const alpha = ss.life * (1 - i / steps);
          if (alpha <= 0) continue;

          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          // Occasional glitchy offset to look like UI pixelation
          const glitchX = Math.random() > 0.75 ? (Math.random() - 0.5) * 8 : 0;
          const glitchY = Math.random() > 0.75 ? (Math.random() - 0.5) * 8 : 0;
          ctx.fillRect(px + glitchX, py + glitchY, size * 1.8, size * 1.8);
        }

        // Head glow
        if (ss.isLarge) {
          const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
          headGlow.addColorStop(0, `rgba(255,255,255,${ss.life * 0.9})`);
          headGlow.addColorStop(0.5, `rgba(${cr},${cg},${cb},${ss.life * 0.4})`);
          headGlow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = headGlow;
          ctx.fillRect(ss.x - 6, ss.y - 6, 12, 12);
        }

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.isLarge ? 2 : 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ss.life * 0.9})`;
        ctx.fill();

        return true;
      });

      // ── BURST PARTICLES ──
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= p.decay;
        if (p.life <= 0) return false;

        const [cr, cg, cb] = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.life * 0.7})`;
        ctx.fill();
        return true;
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default function LandingPage({ onEnterBuilder, onOpenAdmin, onNeedLogin }) {
  const { isMobile } = useResponsive();
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredTier, setHoveredTier] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredAccessIcon, setHoveredAccessIcon] = useState(false);
  const [hoveredUnlockBtn, setHoveredUnlockBtn] = useState(false);

  const [accessCode, setAccessCode] = useState('');
  const [accessStatus, setAccessStatus] = useState(null); // null | 'success' | 'error'
  const [accessLabel, setAccessLabel] = useState('');
  const { redeemAccessCode, accessCodeData } = useAuth();

  const handleRedeemCode = () => {
    if (!accessCode.trim()) return;
    const result = redeemAccessCode(accessCode);
    if (result.success) {
      setAccessStatus('success');
      setAccessLabel(result.label);
      setTimeout(() => onEnterBuilder(), 1200);
    } else {
      setAccessStatus('error');
      setTimeout(() => setAccessStatus(null), 2500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      color: "#f7f7f7",
      fontFamily: "'Space Grotesk', 'Rajdhani', 'Inter', sans-serif",
      overflowX: "hidden",
      position: "relative",
    }}>
      <CosmicCanvas />

      {/* ═══ GLASSMORPHIC NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: isMobile ? "8px 12px" : "8px 40px",
        background: "rgba(8,22,59,0.75)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(220,196,155,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="https://static.wixstatic.com/media/7f7b7e_f739ba198bd34d2dbc03f331462549d9~mv2.png"
            alt="Vivid Signature Logo"
            className="animate-signature-logo"
            style={{ height: "36px", width: "auto" }}
          />
          <span style={{
            fontSize: isMobile ? "13px" : "18px", fontWeight: 900, letterSpacing: "0.1em",
            fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase",
            color: "#f7f7f7", display: "flex", alignItems: "center"
          }}>
            Vivid Signature Pro™
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {!isMobile && <button onClick={onOpenAdmin} style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(96,165,250,0.3)",
            background: "linear-gradient(135deg, rgba(96,165,250,0.1), rgba(96,165,250,0.03))",
            backdropFilter: "blur(12px)",
            color: "#60a5fa", fontWeight: 700, fontSize: "12px", cursor: "pointer",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}>Admin Portal</button>}
          <button onClick={onEnterBuilder} style={{
            padding: isMobile ? "8px 14px" : "10px 28px", borderRadius: "8px", border: "1px solid rgba(220,196,155,0.4)",
            background: "linear-gradient(135deg, rgba(220,196,155,0.15), rgba(220,196,155,0.05))",
            backdropFilter: "blur(12px)",
            color: "#dcc49b", fontWeight: 700, fontSize: isMobile ? "11px" : "13px", cursor: "pointer",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}>Builder →</button>
        </div>
      </nav >

      {/* ═══ HERO ═══ */}
      <section style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: isMobile ? "100px 16px 50px" : "160px 20px 80px", position: "relative", zIndex: 1,
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,196,155,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 20px", borderRadius: "999px",
          background: "rgba(220,196,155,0.06)",
          border: "1px solid rgba(220,196,155,0.2)",
          backdropFilter: "blur(12px)",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
          color: "#dcc49b", marginBottom: "24px",
        }}>
          <span className="animate-pulse" style={{ color: "#22c55e", fontSize: "10px", filter: "drop-shadow(0 0 6px #22c55e)" }}>●</span>
          The Evolution of Professional Identity
        </div>

        <h1 style={{
          fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.1,
          letterSpacing: "0.02em", marginBottom: "16px",
          fontFamily: "'Orbitron', sans-serif",
          background: "linear-gradient(135deg, #f7f7f7 0%, #dcc49b 40%, #f3e3ad 60%, #f7f7f7 100%)",
          backgroundSize: "200% 200%",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "sheenSweep 4s ease-in-out infinite",
        }}>
          From the Ballpoint Pen<br />to the Glassmorphic Signature
        </h1>

        <p style={{
          fontSize: "clamp(12px, 1.2vw, 14px)", fontWeight: 400,
          fontFamily: "'Space Grotesk', sans-serif",
          color: "rgba(220,196,155,0.45)", maxWidth: "480px", lineHeight: 1.6,
          marginBottom: "14px", fontStyle: "italic", letterSpacing: "0.02em",
        }}>
          Lewis Waterman perfected the fountain pen in 1884 — giving the world its first reliable signature instrument. 140 years later, we engineered what comes next.
        </p>

        {/* ── Vivid Signature Video ── */}
        <video
          src="https://video.wixstatic.com/video/7f7b7e_825e0f079ff944e48ec26dd0a0abefcb/720p/mp4/file.mp4"
          autoPlay muted loop playsInline
          style={{
            width: "100%", maxWidth: "480px", display: "block",
            marginBottom: "36px",
            maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 50%, transparent 95%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 50%, transparent 95%)",
          }}
        />

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onEnterBuilder} style={{
            padding: "14px 40px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #dcc49b, #b8965a)",
            color: "#081e3b", fontWeight: 800, fontSize: "14px", cursor: "pointer",
            letterSpacing: "0.08em", textTransform: "uppercase",
            boxShadow: "0 8px 32px rgba(220,196,155,0.25), 0 0 20px rgba(220,196,155,0.1)",
            transition: "all 0.3s ease",
            position: "relative", overflow: "hidden",
          }}>
            <span style={{ position: "relative", zIndex: 1 }}>Start Building Free →</span>
          </button>
          <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "14px 40px", borderRadius: "12px",
            border: "1px solid rgba(220,196,155,0.3)",
            background: "rgba(220,196,155,0.04)",
            backdropFilter: "blur(12px)",
            color: "#dcc49b", fontWeight: 700, fontSize: "14px", cursor: "pointer",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}>View Pricing</button>
        </div>
      </section>

      {/* ── Identity Bridge ── */}
      <div style={{
        textAlign: "center", padding: "0 20px 60px", maxWidth: "560px", margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>
        <p style={{
          fontSize: "clamp(13px, 1.4vw, 16px)", fontWeight: 400,
          fontFamily: "'Space Grotesk', sans-serif",
          color: "rgba(247,247,247,0.55)", lineHeight: 1.7, margin: 0,
        }}>
          Your identity has always been your most valuable asset. Vivid Signature Pro™ brings it into the modern era — premium glassmorphic email signatures that command attention in every inbox.
        </p>
      </div>

      {/* ═══ FEATURES ═══ */}
      < section id="features" style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, textAlign: "center",
          letterSpacing: "0.04em", marginBottom: "12px",
          fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase",
          background: "linear-gradient(135deg, #f7f7f7 0%, #dcc49b 40%, #f3e3ad 60%, #f7f7f7 100%)",
          backgroundSize: "200% 200%",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "sheenSweep 4s ease-in-out infinite",
        }}>Everything You Need</h2>
        <p style={{
          fontSize: "15px", color: "rgba(247,247,247,0.45)", textAlign: "center",
          marginBottom: "50px", maxWidth: "560px", margin: "0 auto 50px",
        }}>
          From simple signatures to full enterprise identity management — Vivid has you covered.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px",
        }}>
          {FEATURES_GRID.map((f, i) => {
            const isHov = hoveredFeature === i;
            return (
              <div
                key={i}
                className={f.border}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  borderRadius: "16px",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHov ? "translateY(-6px) scale(1.03)" : "none",
                  boxShadow: isHov
                    ? `0 16px 48px rgba(0,0,0,0.4), 0 0 24px ${f.accent}18`
                    : undefined,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  className="glass-panel-smoke"
                  style={{
                    padding: "24px",
                    borderRadius: "16px",
                    background: isHov
                      ? `linear-gradient(180deg, ${f.accent}10 0%, rgba(5,20,41,0.85) 100%)`
                      : "rgba(5,20,41,0.7)",
                    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                    border: "none",
                    cursor: "default",
                    overflow: "hidden",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  {/* Icon Container — WCS Command Control Style */}
                  <div style={{
                    padding: "12px",
                    background: "#051429",
                    borderRadius: "12px",
                    border: `1px solid ${f.accent}33`,
                    display: "inline-flex",
                    marginBottom: "14px",
                    transition: "all 0.3s ease",
                    transform: isHov ? "scale(1.1) rotate(12deg)" : "none",
                    boxShadow: isHov ? `0 0 16px ${f.accent}25` : "none",
                  }}>
                    <span style={{ fontSize: "22px", filter: `drop-shadow(0 0 4px ${f.accent}66)` }}>{f.icon}</span>
                  </div>
                  <div style={{
                    fontSize: "15px", fontWeight: 700, marginBottom: "6px",
                    fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isHov ? f.accent : "#f7f7f7",
                    transition: "color 0.3s ease",
                  }}>{f.title}</div>
                  <div style={{
                    fontSize: "13px", color: "rgba(247,247,247,0.5)", lineHeight: 1.5,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section >

      {/* ═══ COMMUNITY ACCESS CODE ═══ */}
      <section style={{ padding: "0 20px 60px", maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="motion-border-gold" style={{
          background: "linear-gradient(135deg, rgba(220,196,155,0.08) 0%, rgba(5,20,41,0.6) 100%)",
          borderRadius: "20px",
          padding: "32px 36px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div
              onMouseEnter={() => setHoveredAccessIcon(true)}
              onMouseLeave={() => setHoveredAccessIcon(false)}
              style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "#051429",
                border: `1px solid ${hoveredAccessIcon ? "rgba(220,196,155,0.7)" : "rgba(220,196,155,0.3)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
                transition: "all 0.3s ease",
                transform: hoveredAccessIcon ? "scale(1.15) rotate(12deg)" : "scale(1) rotate(0deg)",
                boxShadow: hoveredAccessIcon ? "0 0 24px rgba(220,196,155,0.4), 0 0 48px rgba(220,196,155,0.15)" : "0 0 16px rgba(220,196,155,0.2)",
                cursor: "default",
              }}>
              <span style={{ filter: hoveredAccessIcon ? "drop-shadow(0 0 8px rgba(220,196,155,0.9))" : "drop-shadow(0 0 4px rgba(220,196,155,0.5))" }}>🔑</span>
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 900, color: "#f7f7f7", textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>Community Access</p>
              <p style={{ fontSize: "11px", color: "rgba(247,247,247,0.4)", margin: 0, marginTop: "2px" }}>Have an access code? Unlock enterprise features instantly.</p>
            </div>
          </div>

          {accessCodeData ? (
            <div style={{
              marginTop: "16px", padding: "14px 18px", borderRadius: "12px",
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ fontSize: "16px" }}>✅</span>
              <div>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 900, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em" }}>Access Active — {accessCodeData.label}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "rgba(247,247,247,0.5)", marginTop: "2px" }}>Enterprise features unlocked. Remove branding requires a paid plan.</p>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "16px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px" }}>
              <input
                type="text"
                value={accessCode}
                onChange={e => { setAccessCode(e.target.value.toUpperCase()); setAccessStatus(null); }}
                onKeyDown={e => e.key === 'Enter' && handleRedeemCode()}
                placeholder="ENTER ACCESS CODE"
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: "10px", fontSize: "13px",
                  fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  background: "rgba(5,20,41,0.8)", color: "#f7f7f7",
                  border: accessStatus === 'error' ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(220,196,155,0.2)",
                  outline: "none", fontFamily: "'Space Grotesk', sans-serif",
                }}
              />
              <button
                onClick={handleRedeemCode}
                onMouseEnter={() => setHoveredUnlockBtn(true)}
                onMouseLeave={() => setHoveredUnlockBtn(false)}
                style={{
                  padding: "12px 20px", borderRadius: "10px", fontSize: "12px", fontWeight: 900,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap",
                  background: accessStatus === 'success'
                    ? "rgba(34,197,94,0.2)"
                    : hoveredUnlockBtn
                      ? "linear-gradient(135deg, #dcc49b, #b8965a)"
                      : "linear-gradient(135deg, rgba(220,196,155,0.2), rgba(220,196,155,0.08))",
                  border: accessStatus === 'success' ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(220,196,155,0.4)",
                  color: accessStatus === 'success' ? "#22c55e" : hoveredUnlockBtn ? "#081e3b" : "#dcc49b",
                  transition: "all 0.25s ease",
                  transform: hoveredUnlockBtn && accessStatus !== 'success' ? "translateY(-2px) scale(1.04)" : "none",
                  boxShadow: hoveredUnlockBtn && accessStatus !== 'success' ? "0 8px 24px rgba(220,196,155,0.3), 0 0 16px rgba(220,196,155,0.15)" : "none",
                }}
              >
                {accessStatus === 'success' ? '✓ Unlocked' : accessStatus === 'error' ? 'Invalid Code' : 'Unlock →'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      < section style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }} id="pricing" >
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, textAlign: "center",
          letterSpacing: "0.04em", marginBottom: "12px",
          fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase",
          background: "linear-gradient(135deg, #f7f7f7 0%, #dcc49b 40%, #f3e3ad 60%, #f7f7f7 100%)",
          backgroundSize: "200% 200%",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "sheenSweep 4s ease-in-out infinite",
        }}>Simple, Transparent Pricing</h2>
        <p style={{
          fontSize: "15px", color: "rgba(247,247,247,0.45)", textAlign: "center",
          marginBottom: "40px", maxWidth: "560px", margin: "0 auto 40px",
        }}>
          Every plan includes premium email-safe signature panels. No hidden fees. Cancel anytime.
        </p>

        {/* Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "40px" }}>
          <span style={{ fontSize: "14px", fontWeight: !isYearly ? 700 : 500, color: !isYearly ? "#dcc49b" : "rgba(247,247,247,0.5)" }}>Monthly</span>
          <div
            onClick={() => setIsYearly(!isYearly)}
            style={{
              width: "52px", height: "28px", borderRadius: "14px", cursor: "pointer",
              background: isYearly ? "rgba(220,196,155,0.3)" : "rgba(220,196,155,0.12)",
              border: "1px solid rgba(220,196,155,0.3)", position: "relative",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{
              width: "22px", height: "22px", borderRadius: "11px",
              background: "#dcc49b", position: "absolute", top: "2px",
              left: isYearly ? "27px" : "2px",
              transition: "left 0.3s ease",
              boxShadow: "0 2px 8px rgba(220,196,155,0.3)",
            }} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: isYearly ? 700 : 500, color: isYearly ? "#dcc49b" : "rgba(247,247,247,0.5)" }}>Yearly</span>
          {isYearly && <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
            color: "#60a5fa", letterSpacing: "0.05em",
          }}>SAVE ~17%</span>}
        </div>

        {/* Tier Cards */}
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px", alignItems: "stretch",
        }}>
          {TIERS.map((tier, i) => {
            const isHovered = hoveredTier === i;
            const isGold = tier.color === "#dcc49b";
            const isBlue = tier.color === "#3b82f6";
            const borderColor = isHovered ? tier.color : "rgba(220,196,155,0.1)";

            return (
              <div
                key={i}
                className={tier.borderClass}
                onMouseEnter={() => setHoveredTier(i)}
                onMouseLeave={() => setHoveredTier(null)}
                style={{
                  borderRadius: "16px",
                  position: "relative",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "translateY(-8px) scale(1.02)" : "none",
                  boxShadow: isHovered
                    ? `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${tier.color}15`
                    : undefined,
                  zIndex: 1,
                }}
              >
                <div style={{
                  borderRadius: "16px",
                  background: isHovered
                    ? `linear-gradient(180deg, ${tier.color}12 0%, rgba(8,22,42,0.85) 100%)`
                    : "rgba(8,22,42,0.6)",
                  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                  border: "none",
                  display: "flex", flexDirection: "column",
                  padding: "28px 22px",
                  overflow: "hidden",
                  position: "relative",
                  height: "100%"
                }}>
                  {/* Metallic shine overlay on hover */}
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "linear-gradient(110deg, transparent 40%, rgba(220,196,155,0.06) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.5s",
                    animation: isHovered ? "sheenSweep 3s ease-in-out infinite" : "none",
                    borderRadius: "16px",
                  }} />

                  {/* Badge */}
                  {tier.badge && (
                    <div style={{
                      position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)",
                      padding: "4px 16px", borderRadius: "0 0 8px 8px",
                      fontSize: "10px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase",
                      background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`,
                      color: "#081e3b",
                      boxShadow: `0 4px 12px ${tier.color}33`,
                    }}>{tier.badge}</div>
                  )}

                  <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px", letterSpacing: "0.08em", fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase", marginTop: tier.badge ? "8px" : 0 }}>{tier.name}</div>
                  <div style={{
                    fontSize: isMobile ? "32px" : "40px", fontWeight: 900, marginBottom: "4px",
                    background: isGold
                      ? "linear-gradient(135deg, #dcc49b, #f3e3ad, #dcc49b)"
                      : isBlue ? "linear-gradient(135deg, #60a5fa, #93c5fd, #60a5fa)"
                        : "linear-gradient(135deg, #f7f7f7, #c0c8d0)",
                    backgroundClip: "text", WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    ${isYearly ? (tier.price.yearly / 12).toFixed(2) : tier.price.monthly.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(247,247,247,0.35)", marginBottom: "20px" }}>
                    per month {isYearly && `• billed $${tier.price.yearly.toFixed(2)}/yr`}
                  </div>
                  <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${tier.color}33, transparent)`, margin: "0 0 16px" }} />

                  {tier.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px", fontSize: "13px" }}>
                      <span style={{ color: tier.color, fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>✓</span>
                      <span style={{ color: "rgba(247,247,247,0.75)" }}>{f}</span>
                    </div>
                  ))}
                  {tier.excluded.map((f, j) => (
                    <div key={`x-${j}`} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px", fontSize: "13px" }}>
                      <span style={{ color: "rgba(247,247,247,0.15)", fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>✕</span>
                      <span style={{ color: "rgba(247,247,247,0.2)" }}>{f}</span>
                    </div>
                  ))}

                  <div style={{ flex: 1, minHeight: "16px" }} />
                  {tier.name === "Enterprise" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <a
                        href="mailto:info@vividsignature.com?subject=Vivid%20Signature%20Pro%20—%20Enterprise%20Inquiry"
                        style={{
                          display: "block", padding: "13px", borderRadius: "10px",
                          textAlign: "center", textDecoration: "none",
                          background: isHovered
                            ? `linear-gradient(135deg, ${tier.color}, ${tier.color}aa)`
                            : `linear-gradient(135deg, ${tier.color}33, ${tier.color}11)`,
                          color: isHovered ? "#081e3b" : tier.color,
                          fontWeight: 800, fontSize: "13px",
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          transition: "all 0.3s ease", boxSizing: "border-box",
                          boxShadow: isHovered ? `0 4px 20px ${tier.color}22` : "none",
                        }}
                      >
                        Contact Sales →
                      </a>
                      <div style={{ fontSize: "11px", textAlign: "center", color: `${tier.color}88`, letterSpacing: "0.04em" }}>
                        Custom pricing for teams 50+
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button onClick={onEnterBuilder} style={{
                        padding: "13px", borderRadius: "10px", border: "none",
                        background: isHovered
                          ? `linear-gradient(135deg, ${tier.color}, ${tier.color}aa)`
                          : `linear-gradient(135deg, ${tier.color}33, ${tier.color}11)`,
                        color: isHovered ? "#081e3b" : tier.color,
                        fontWeight: 800, fontSize: "13px", cursor: "pointer",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        transition: "all 0.3s ease", width: "100%",
                        boxShadow: isHovered ? `0 4px 20px ${tier.color}22` : "none",
                      }}>
                        Try Builder Free
                      </button>
                      <CheckoutButton
                        tier={tier.name.toLowerCase()}
                        billing={isYearly ? "yearly" : "monthly"}
                        label="Subscribe Now"
                        onNeedLogin={onNeedLogin}
                        style={{
                          padding: "10px", borderRadius: "10px", border: `1px solid ${tier.color}44`,
                          background: "transparent",
                          color: tier.color,
                          fontWeight: 700, fontSize: "12px", cursor: "pointer",
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          transition: "all 0.3s ease", width: "100%",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section >


      {/* ═══ CTA ═══ */}
      < section className="motion-border-gold" style={{
        textAlign: "center",
        background: "radial-gradient(ellipse at center, rgba(220,196,155,0.04) 0%, transparent 70%)",
        borderRadius: "24px", margin: "0 auto 60px", maxWidth: "900px", padding: isMobile ? "50px 20px" : "80px 40px",
        position: "relative", zIndex: 1,
        border: "none",
      }}>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900,
          marginBottom: "16px",
          background: "linear-gradient(135deg, #f7f7f7 0%, #dcc49b 40%, #f3e3ad 60%, #f7f7f7 100%)",
          backgroundSize: "200% 200%",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "sheenSweep 4s ease-in-out infinite",
        }}>Ready to Elevate Your Identity?</h2>
        <p style={{
          fontSize: "15px", color: "rgba(247,247,247,0.45)",
          marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px",
        }}>
          Join professionals who've upgraded from basic text signatures to premium brand statements that hold up in real inboxes.
        </p>
        <button onClick={onEnterBuilder}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px) scale(1.05)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(220,196,155,0.45), 0 0 30px rgba(220,196,155,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(220,196,155,0.25), 0 0 20px rgba(220,196,155,0.1)"; }}
          style={{
          padding: "16px 44px", borderRadius: "12px", border: "none",
          background: "linear-gradient(135deg, #dcc49b, #b8965a)",
          color: "#081e3b", fontWeight: 800, fontSize: "15px", cursor: "pointer",
          letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: "0 8px 32px rgba(220,196,155,0.25), 0 0 20px rgba(220,196,155,0.1)",
          transition: "all 0.3s ease",
        }}>Launch the Builder →</button>
      </section >

      {/* ═══ POWERED BY ═══ */}
      <div style={{ padding: '24px 0' }}>
        <PoweredByBadge />
      </div>

      {/* ═══ FOOTER ═══ */}
      < footer style={{
        padding: "30px 20px", textAlign: "center",
        borderTop: "1px solid rgba(220,196,155,0.08)",
        color: "rgba(247,247,247,0.45)", fontSize: "12px",
        position: "relative", zIndex: 10,
        background: "rgba(4,12,24,0.95)",
      }}>
        <div style={{ marginBottom: "6px" }}>
          <span style={{ color: "#dcc49b", fontWeight: 700 }}>Vivid Signature Pro™</span>{" "}
          | A ForgedOps.AI™ Product
        </div>
        <div>
          © 2026 Waterman Consulting Services. All Rights Reserved. | Built on the Rock. Engineered for the Future.
        </div>
        <div style={{ marginTop: "8px", fontSize: "11px" }}>
          <a href="https://forgedops.ai/privacy-policy.html" target="_blank" rel="noreferrer" style={{ color: "rgba(220,196,155,0.5)", textDecoration: "none" }}>Privacy Policy</a>
          {" | "}
          <a href="https://forgedops.ai/terms-of-service.html" target="_blank" rel="noreferrer" style={{ color: "rgba(220,196,155,0.5)", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </footer >



      {/* Inline keyframes for sheen animation */}
      < style > {`
        @keyframes sheenSweep {
          0% { background-position: 200% 200%; }
          50% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
      `}</style >
    </div >
  );
}
