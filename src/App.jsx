import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { saveSignature } from "./db";
import CarbonParticles from "./CarbonParticles.jsx";
import {
  PenTool,
  Copy,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Linkedin,
  Sparkles,
  Shield,
  Check,
  X,
  Calendar,
  ExternalLink,
  Zap,
  ChevronDown,
  Lock,
  Unlock,
  CreditCard,
  Eye,
  EyeOff,
  Square,
  RectangleHorizontal,
  Monitor,
  Smartphone,
  Palette,
  Download,
  Send,
  Settings,
  Star,
  ArrowRight,
  Play,
  Layers,
  Minus,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Type,
  Tablet,
  BarChart2,
} from "lucide-react";

// ============================
// VIVID LOGO SVG
// ============================
const VividLogo = ({ size = 200, className = "" }) => (
  <img
    src="https://static.wixstatic.com/media/7f7b7e_0a344c34678f4ef9ab0892557b4eef82~mv2.gif"
    alt="Vivid Signature"
    className={`object-contain ${className}`}
    style={{ width: size, height: "auto" }}
  />
);

const EMAIL_SAFE_LAYOUTS = [
  { key: "executive", icon: Shield, label: "Executive" },
  { key: "horizontal", icon: RectangleHorizontal, label: "Wide" },
  { key: "banner", icon: Minus, label: "Banner" },
  { key: "rectangle", icon: BarChart2, label: "Rectangle" },
  { key: "compact", icon: Smartphone, label: "Compact" },
  { key: "mobile-glass-mini", icon: CreditCard, label: "Glass Mini" },
  { key: "slim-glass", icon: CreditCard, label: "Slim Glass" },
];

const EMAIL_SAFE_LAYOUT_KEYS = new Set(
  EMAIL_SAFE_LAYOUTS.map((layout) => layout.key),
);

const EMAIL_SAFE_FONTS = [
  "Segoe UI",
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Georgia",
  "Times New Roman",
  "Palatino",
  "Garamond",
];

const EMAIL_SAFE_FONT_SET = new Set(EMAIL_SAFE_FONTS);

const EMAIL_SAFE_SOCIAL_PLACEMENTS = [
  { key: "above-contact", label: "Above Contact" },
  { key: "below-contact", label: "Below Contact" },
  { key: "below-motto", label: "Below Motto" },
];

const EMAIL_SAFE_SOCIAL_PLACEMENT_KEYS = new Set(
  EMAIL_SAFE_SOCIAL_PLACEMENTS.map((placement) => placement.key),
);

const normalizeLayout = (layout) =>
  EMAIL_SAFE_LAYOUT_KEYS.has(layout) ? layout : "horizontal";

const normalizeFont = (font, fallback = "Segoe UI") =>
  EMAIL_SAFE_FONT_SET.has(font) ? font : fallback;

const normalizeLocationStyle = (value) => {
  if (value === "solid" || value === "solid-pill") return "solid-pill";
  if (value === "glass" || value === "soft-pill") return "soft-pill";
  return "text";
};

const normalizeEmailSafeConfig = (rawConfig = {}) => {
  const next = { ...rawConfig };
  // Legacy saved configs may still contain old names; coerce them into the email-safe set.
  next.calendarLayout =
    next.calendarLayout === "button_glass"
      ? "button_outline"
      : ["none", "text_link", "button_solid", "button_outline"].includes(
        next.calendarLayout,
      )
        ? next.calendarLayout
        : "button_solid";
  next.locationStyle = normalizeLocationStyle(next.locationStyle);
  next.bestRegardsFont = normalizeFont(next.bestRegardsFont, "Georgia");
  next.taglineFont = normalizeFont(next.taglineFont, "Georgia");
  next.sloganFont = normalizeFont(next.sloganFont, "Georgia");
  next.title2Font = normalizeFont(next.title2Font, "Segoe UI");
  next.nameFont = normalizeFont(next.nameFont, "Segoe UI");
  next.iconShape = ["circle", "rounded", "square"].includes(next.iconShape)
    ? next.iconShape
    : "rounded";
  next.iconEmailMode = "email-safe";
  next.socialPlacement = EMAIL_SAFE_SOCIAL_PLACEMENT_KEYS.has(
    next.socialPlacement,
  )
    ? next.socialPlacement
    : "below-contact";
  next.ctaStyle = next.ctaStyle === "outline" ? "outline" : "solid";
  next.imageMotion = "none";
  next.bestRegardsMotion = "none";
  next.borderGlow = "none";
  next.smokeEffect = "none";
  next.calendarEnabled = false;
  next.calendarStyle = "minimal";
  next.glassEnabled = true;
  next.glassMode = ["dark", "light", "frosted"].includes(next.glassMode)
    ? next.glassMode
    : "dark";
  return next;
};

const getPreviewWidth = (layout, device) => {
  const widthMap = {
    executive: { mobile: 340, tablet: 480, desktop: 500 },
    horizontal: { mobile: 340, tablet: 500, desktop: 560 },
    banner: { mobile: 340, tablet: 520, desktop: 620 },
    rectangle: { mobile: 340, tablet: 480, desktop: 540 },
    compact: { mobile: 320, tablet: 420, desktop: 460 },
    "mobile-glass-mini": { mobile: 300, tablet: 340, desktop: 360 },
    "slim-glass": { mobile: 320, tablet: 400, desktop: 420 },
  };

  return widthMap[normalizeLayout(layout)]?.[device] || 560;
};

// ============================
// HYPERDEEP SPACE BACKGROUND
// ============================
const ENTERPRISE_LOGOS = [
  "FORGED OPS",
  "AEGIS TITANIUM",
  "LIQD.PRO",
  "WCS ENTERPRISE",
  "VIVID SIGNATURE",
  "FORGED OPS AI",
  "CONSTRUCTION COMMAND",
];

export const HyperspaceBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height =
        document.documentElement.scrollHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Constellation nodes
    const nodeCount = 60;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 2 + 0.5,
      pulse: Math.random() * Math.PI * 2,
      color:
        Math.random() > 0.6 ? "teal" : Math.random() > 0.3 ? "blue" : "gold",
    }));

    // Deep space stars (tiny)
    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.8 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.002,
    }));

    // Shooting stars — enhanced
    const shootingStars = [];
    const shootingDebris = [];
    const starColors = [
      { head: "#a8c4dc", trail: "rgba(168, 196, 220," },
      { head: "#2dd4bf", trail: "rgba(45, 212, 191," },
      { head: "#e0e7ff", trail: "rgba(200, 210, 255," },
      { head: "#60A5FA", trail: "rgba(96, 165, 250," },
      { head: "#ef4444", trail: "rgba(239, 68, 68," },
      { head: "#facc15", trail: "rgba(250, 204, 21," },
      { head: "#22c55e", trail: "rgba(34, 197, 94," },
      { head: "#ffffff", trail: "rgba(255, 255, 255," },
    ];
    const spawnShootingStar = () => {
      if (shootingStars.length < 6 && Math.random() < 0.01) {
        const fromLeft = Math.random() > 0.5;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        shootingStars.push({
          x: fromLeft ? -50 : canvas.width + 50,
          y: Math.random() * canvas.height * 0.6,
          vx: fromLeft ? 4 + Math.random() * 7 : -(4 + Math.random() * 7),
          vy: 0.5 + Math.random() * 2,
          life: 0,
          maxLife: 100 + Math.random() * 100,
          trail: [],
          color,
        });
      }
    };

    // Exploding star particles — realistic light bursts, NOT star shapes
    const explodingStars = [];
    const spawnExplosion = () => {
      if (explodingStars.length < 3 && Math.random() < 0.003) {
        const cx = Math.random() * canvas.width;
        const cy = Math.random() * canvas.height * 0.7;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const particleCount = 20 + Math.floor(Math.random() * 15);
        const particles = Array.from({ length: particleCount }, () => ({
          angle: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 2.5,
          decay: 0.97 + Math.random() * 0.02,
          size: 0.5 + Math.random() * 1.5,
          dist: 0,
        }));
        explodingStars.push({ cx, cy, life: 0, maxLife: 120 + Math.random() * 80, particles, color });
      }
    };

    // Nebula gas clouds (static, very subtle)
    const nebulae = [
      { x: 0.3, y: 0.4, r: 0.15, c1: [80, 20, 120], c2: [30, 60, 140] },
      { x: 0.7, y: 0.6, r: 0.12, c1: [120, 40, 60], c2: [180, 80, 40] },
      { x: 0.5, y: 0.2, r: 0.18, c1: [20, 80, 100], c2: [60, 160, 140] },
      { x: 0.85, y: 0.75, r: 0.1, c1: [100, 20, 180], c2: [60, 20, 120] },
    ];

    // Geometric Stars (Vivid Signature)
    const geometricStars = [];
    const spawnGeometricStar = () => {
      if (geometricStars.length < 6 && Math.random() < 0.02) {
        geometricStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          life: 0,
          vy: (Math.random() - 0.5) * 0.1,
          maxLife: 300 + Math.random() * 200,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
          scale: 0.1,
          maxScale: 0.5 + Math.random() * 1.0,
          color: starColors[Math.floor(Math.random() * starColors.length)].head,
        });
      }
    };

    // Floating logos
    const floatingLogos = ENTERPRISE_LOGOS.map((text, i) => ({
      text,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.06,
      opacity: 0.04 + Math.random() * 0.04,
      size: 10 + Math.random() * 6,
      rotation: (Math.random() - 0.5) * 0.3,
    }));

    const connectDist = 180;

    const draw = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // === NEBULA GAS CLOUDS (ultra subtle, drift slowly) ===
      nebulae.forEach((neb, idx) => {
        const nx = (neb.x + Math.sin(time * 0.05 + idx) * 0.02) * canvas.width;
        const ny = (neb.y + Math.cos(time * 0.03 + idx * 2) * 0.015) * canvas.height;
        const nr = neb.r * Math.min(canvas.width, canvas.height);
        const nebGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        nebGrad.addColorStop(0, `rgba(${neb.c1.join(',')}, 0.04)`);
        nebGrad.addColorStop(0.5, `rgba(${neb.c2.join(',')}, 0.02)`);
        nebGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nebGrad;
        ctx.fillRect(nx - nr, ny - nr, nr * 2, nr * 2);
      });

      // === BLACK HOLE VORTEX (upper right) — ENHANCED ===
      const bhX = canvas.width * 0.82;
      const bhY = canvas.height * 0.12;
      const bhRadius = Math.min(canvas.width, canvas.height) * 0.08;

      // Accretion disk rings — 8 rings with color variation
      const ringColors = [
        [220, 196, 155], [200, 190, 160], [180, 200, 180],
        [120, 200, 190], [80, 180, 200], [100, 160, 210],
        [130, 120, 200], [160, 100, 180],
      ];
      for (let ring = 0; ring < 8; ring++) {
        const r = bhRadius * (1.6 + ring * 0.5);
        const ringAlpha = (0.1 - ring * 0.01) * (0.7 + 0.3 * Math.sin(time * 0.5 + ring));
        const rc = ringColors[ring];
        ctx.save();
        ctx.translate(bhX, bhY);
        ctx.rotate(time * (0.2 - ring * 0.02) * (ring % 2 === 0 ? 1 : -1));
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rc[0]}, ${rc[1]}, ${rc[2]}, ${Math.max(ringAlpha, 0)})`;
        ctx.lineWidth = 1.8 - ring * 0.15;
        ctx.stroke();
        ctx.restore();
      }

      // Photon sphere ring
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhRadius * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 220, 255, ${0.15 + 0.05 * Math.sin(time * 3)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Gravitational lensing arcs
      for (let i = 0; i < 6; i++) {
        const arcR = bhRadius * (1.4 + i * 0.35);
        const arcAlpha = (0.06 - i * 0.008) * (0.6 + 0.4 * Math.sin(time * 0.8 + i * 0.5));
        ctx.beginPath();
        ctx.arc(bhX, bhY, arcR, time * 0.1 + i * 0.5, time * 0.1 + i * 0.5 + Math.PI * 0.3);
        ctx.strokeStyle = `rgba(180, 200, 240, ${Math.max(arcAlpha, 0)})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Polar jet emissions
      const jetLen = bhRadius * 4;
      for (let side = -1; side <= 1; side += 2) {
        const jetGrad = ctx.createLinearGradient(bhX, bhY, bhX, bhY + side * jetLen);
        jetGrad.addColorStop(0, `rgba(120, 160, 255, ${0.06 + 0.02 * Math.sin(time * 2)})`);
        jetGrad.addColorStop(0.3, `rgba(80, 140, 220, 0.03)`);
        jetGrad.addColorStop(1, 'transparent');
        ctx.save();
        ctx.translate(bhX, bhY);
        ctx.rotate(time * 0.05);
        ctx.beginPath();
        ctx.moveTo(-3, 0);
        ctx.lineTo(-8, side * jetLen);
        ctx.lineTo(8, side * jetLen);
        ctx.lineTo(3, 0);
        ctx.closePath();
        ctx.fillStyle = jetGrad;
        ctx.fill();
        ctx.restore();
      }

      // Event horizon glow — deeper gradient
      const bhGlow = ctx.createRadialGradient(bhX, bhY, 0, bhX, bhY, bhRadius * 2.5);
      bhGlow.addColorStop(0, "rgba(0, 0, 0, 1)");
      bhGlow.addColorStop(0.2, "rgba(10, 0, 20, 0.98)");
      bhGlow.addColorStop(0.4, "rgba(20, 0, 40, 0.9)");
      bhGlow.addColorStop(0.6, "rgba(45, 212, 191, 0.06)");
      bhGlow.addColorStop(0.8, "rgba(168, 196, 220, 0.04)");
      bhGlow.addColorStop(1, "transparent");
      ctx.fillStyle = bhGlow;
      ctx.fillRect(bhX - bhRadius * 3, bhY - bhRadius * 3, bhRadius * 6, bhRadius * 6);

      // Core void — multi-stop gradient instead of flat black
      const coreGrad = ctx.createRadialGradient(bhX, bhY, 0, bhX, bhY, bhRadius * 0.6);
      coreGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
      coreGrad.addColorStop(0.7, "rgba(5, 0, 15, 0.98)");
      coreGrad.addColorStop(1, "rgba(15, 0, 30, 0.85)");
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // === 3D PLANET (upper-left area) ===
      const plX = canvas.width * 0.15;
      const plY = canvas.height * 0.18;
      const plR = Math.min(canvas.width, canvas.height) * 0.045;

      const plGrad = ctx.createRadialGradient(plX - plR * 0.3, plY - plR * 0.3, plR * 0.1, plX, plY, plR);
      plGrad.addColorStop(0, "rgba(60, 100, 160, 0.7)");
      plGrad.addColorStop(0.5, "rgba(30, 50, 90, 0.6)");
      plGrad.addColorStop(1, "rgba(5, 10, 25, 0.8)");
      ctx.beginPath();
      ctx.arc(plX, plY, plR, 0, Math.PI * 2);
      ctx.fillStyle = plGrad;
      ctx.fill();

      const atmoGrad = ctx.createRadialGradient(plX, plY, plR * 0.9, plX, plY, plR * 1.6);
      atmoGrad.addColorStop(0, "rgba(96, 165, 250, 0.08)");
      atmoGrad.addColorStop(0.5, "rgba(45, 212, 191, 0.04)");
      atmoGrad.addColorStop(1, "transparent");
      ctx.fillStyle = atmoGrad;
      ctx.fillRect(plX - plR * 2, plY - plR * 2, plR * 4, plR * 4);

      ctx.beginPath();
      ctx.arc(plX - plR * 0.15, plY - plR * 0.1, plR * 0.92, -0.8, 1.2);
      ctx.strokeStyle = "rgba(140, 180, 240, 0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tiny stars
      stars.forEach((s) => {
        s.pulse += s.speed;
        const a = s.opacity * (0.4 + 0.6 * Math.sin(s.pulse));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 230, ${a})`;
        ctx.fill();
      });

      // Node connections — with pulse and traveling dots
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const proximity = 1 - dist / connectDist;
            const pulseAlpha = proximity * 0.12 * (0.7 + 0.3 * Math.sin(time * 0.5 + (i + j) * 0.1));
            const lw = dist < connectDist * 0.5 ? 0.8 : 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(45, 180, 200, ${pulseAlpha})`;
            ctx.lineWidth = lw;
            ctx.stroke();

            // Traveling pulse dot on close connections
            if (dist < connectDist * 0.4) {
              const t = ((time * 0.3 + i * 0.1) % 1);
              const dotX = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const dotY = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
              ctx.beginPath();
              ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(45, 212, 191, ${proximity * 0.4})`;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.pulse += 0.015;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = canvas.width + 20;
        if (n.x > canvas.width + 20) n.x = -20;
        if (n.y < -20) n.y = canvas.height + 20;
        if (n.y > canvas.height + 20) n.y = -20;

        const glow = 0.4 + 0.6 * Math.sin(n.pulse);
        const colors = {
          teal: `rgba(45, 212, 191, ${0.5 * glow})`,
          blue: `rgba(96, 165, 250, ${0.4 * glow})`,
          gold: `rgba(168, 196, 220, ${0.5 * glow})`,
        };

        const haloGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        haloGrad.addColorStop(0, colors[n.color]);
        haloGrad.addColorStop(1, "transparent");
        ctx.fillStyle = haloGrad;
        ctx.fillRect(n.x - n.r * 6, n.y - n.r * 6, n.r * 12, n.r * 12);

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = colors[n.color].replace(/[\d.]+\)$/, "0.9)");
        ctx.fill();
      });

      // Shooting stars — enhanced with debris
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
        ss.trail.push({ x: ss.x, y: ss.y });
        if (ss.trail.length > 50) ss.trail.shift();

        const fadeIn = Math.min(ss.life / 10, 1);
        const fadeOut = Math.max(1 - (ss.life - ss.maxLife + 30) / 30, 0);
        const globalAlpha = fadeIn * fadeOut;

        // Spawn debris particles
        if (globalAlpha > 0.3 && Math.random() < 0.4) {
          shootingDebris.push({
            x: ss.x, y: ss.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: 0, maxLife: 20 + Math.random() * 20,
            color: ss.color,
          });
        }

        // Trail
        for (let t = 0; t < ss.trail.length - 1; t++) {
          const trailAlpha = (t / ss.trail.length) * globalAlpha * 0.6;
          ctx.beginPath();
          ctx.moveTo(ss.trail[t].x, ss.trail[t].y);
          ctx.lineTo(ss.trail[t + 1].x, ss.trail[t + 1].y);
          ctx.strokeStyle = `${ss.color.trail} ${trailAlpha})`;
          ctx.lineWidth = 1.5 * (t / ss.trail.length);
          ctx.stroke();
        }

        // Head — triple glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${globalAlpha * 0.95})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `${ss.color.trail} ${globalAlpha * 0.4})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `${ss.color.trail} ${globalAlpha * 0.1})`;
        ctx.fill();

        if (ss.life > ss.maxLife) shootingStars.splice(i, 1);
      }

      // Draw shooting star debris
      for (let i = shootingDebris.length - 1; i >= 0; i--) {
        const d = shootingDebris[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.96;
        d.vy *= 0.96;
        d.life++;
        const da = 1 - d.life / d.maxLife;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 0.5 + da * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `${d.color.trail} ${da * 0.5})`;
        ctx.fill();
        if (d.life > d.maxLife) shootingDebris.splice(i, 1);
      }

      // Exploding stars — realistic light bursts
      spawnExplosion();
      for (let i = explodingStars.length - 1; i >= 0; i--) {
        const ex = explodingStars[i];
        ex.life++;
        const lifeRatio = ex.life / ex.maxLife;
        const fadeAlpha = lifeRatio < 0.1 ? ex.life / (ex.maxLife * 0.1) : Math.max(1 - (lifeRatio - 0.3) / 0.7, 0);

        // Central flash (first 15 frames)
        if (ex.life < 15) {
          const flashAlpha = (1 - ex.life / 15) * 0.6;
          const flashR = 3 + ex.life * 2;
          const flashGrad = ctx.createRadialGradient(ex.cx, ex.cy, 0, ex.cx, ex.cy, flashR);
          flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          flashGrad.addColorStop(0.3, `${ex.color.trail} ${flashAlpha * 0.6})`);
          flashGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = flashGrad;
          ctx.fillRect(ex.cx - flashR, ex.cy - flashR, flashR * 2, flashR * 2);
        }

        // Particles radiating outward
        ex.particles.forEach(p => {
          p.dist += p.speed;
          p.speed *= p.decay;
          const px = ex.cx + Math.cos(p.angle) * p.dist;
          const py = ex.cy + Math.sin(p.angle) * p.dist;
          const pa = fadeAlpha * 0.6;
          // Tiny glow
          const pGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
          pGrad.addColorStop(0, `${ex.color.trail} ${pa * 0.8})`);
          pGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = pGrad;
          ctx.fillRect(px - p.size * 3, py - p.size * 3, p.size * 6, p.size * 6);
          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pa})`;
          ctx.fill();
        });

        if (ex.life >= ex.maxLife) explodingStars.splice(i, 1);
      }

      // Geometric Stars (Vivid V shapes)
      spawnGeometricStar();
      for (let i = geometricStars.length - 1; i >= 0; i--) {
        const gs = geometricStars[i];
        gs.life++;
        gs.rotation += gs.rotSpeed;

        let alpha = 1;
        if (gs.life < 20) {
          alpha = gs.life / 20;
          gs.scale += (gs.maxScale - gs.scale) * 0.1;
        } else if (gs.life > gs.maxLife - 20) {
          alpha = (gs.maxLife - gs.life) / 20;
          gs.scale += 0.01;
        } else {
          gs.scale += 0.002;
        }

        ctx.save();
        ctx.translate(gs.x, gs.y);
        ctx.rotate(gs.rotation);
        ctx.scale(gs.scale, gs.scale);

        ctx.beginPath();
        ctx.moveTo(-15, -20);
        ctx.lineTo(0, 20);
        ctx.lineTo(15, -20);
        ctx.lineTo(10, -20);
        ctx.lineTo(0, 5);
        ctx.lineTo(-10, -20);
        ctx.closePath();

        ctx.strokeStyle = gs.color;
        ctx.globalAlpha = alpha * 0.4;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();

        if (gs.life >= gs.maxLife) geometricStars.splice(i, 1);
      }

      // Floating enterprise logos
      ctx.save();
      floatingLogos.forEach((logo) => {
        logo.x += logo.vx;
        logo.y += logo.vy;
        if (logo.x < -200) logo.x = canvas.width + 100;
        if (logo.x > canvas.width + 200) logo.x = -100;
        if (logo.y < -50) logo.y = canvas.height + 50;
        if (logo.y > canvas.height + 50) logo.y = -50;

        ctx.save();
        ctx.translate(logo.x, logo.y);
        ctx.rotate(logo.rotation);
        ctx.font = `900 ${logo.size}px 'Inter', sans-serif`;
        ctx.fillStyle = `rgba(168, 196, 220, ${logo.opacity})`;
        ctx.letterSpacing = "4px";
        ctx.fillText(logo.text, 0, 0);
        ctx.restore();
      });
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
};

// ============================
// SOCIAL ICON DATA
// ============================
const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", name: "US/CA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+61", flag: "🇦🇺", name: "AU" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+34", flag: "🇪🇸", name: "ES" },
  { code: "+39", flag: "🇮🇹", name: "IT" },
  { code: "+31", flag: "🇳🇱", name: "NL" },
  { code: "+46", flag: "🇸🇪", name: "SE" },
  { code: "+47", flag: "🇳🇴", name: "NO" },
  { code: "+45", flag: "🇩🇰", name: "DK" },
  { code: "+41", flag: "🇨🇭", name: "CH" },
  { code: "+43", flag: "🇦🇹", name: "AT" },
  { code: "+32", flag: "🇧🇪", name: "BE" },
  { code: "+351", flag: "🇵🇹", name: "PT" },
  { code: "+52", flag: "🇲🇽", name: "MX" },
  { code: "+55", flag: "🇧🇷", name: "BR" },
  { code: "+54", flag: "🇦🇷", name: "AR" },
  { code: "+56", flag: "🇨🇱", name: "CL" },
  { code: "+57", flag: "🇨🇴", name: "CO" },
  { code: "+51", flag: "🇵🇪", name: "PE" },
  { code: "+58", flag: "🇻🇪", name: "VE" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+82", flag: "🇰🇷", name: "KR" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+65", flag: "🇸🇬", name: "SG" },
  { code: "+60", flag: "🇲🇾", name: "MY" },
  { code: "+63", flag: "🇵🇭", name: "PH" },
  { code: "+66", flag: "🇹🇭", name: "TH" },
  { code: "+62", flag: "🇮🇩", name: "ID" },
  { code: "+64", flag: "🇳🇿", name: "NZ" },
  { code: "+27", flag: "🇿🇦", name: "ZA" },
  { code: "+234", flag: "🇳🇬", name: "NG" },
  { code: "+254", flag: "🇰🇪", name: "KE" },
  { code: "+20", flag: "🇪🇬", name: "EG" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "SA" },
  { code: "+972", flag: "🇮🇱", name: "IL" },
  { code: "+90", flag: "🇹🇷", name: "TR" },
  { code: "+7", flag: "🇷🇺", name: "RU" },
  { code: "+380", flag: "🇺🇦", name: "UA" },
  { code: "+48", flag: "🇵🇱", name: "PL" },
  { code: "+420", flag: "🇨🇿", name: "CZ" },
  { code: "+36", flag: "🇭🇺", name: "HU" },
  { code: "+40", flag: "🇷🇴", name: "RO" },
  { code: "+30", flag: "🇬🇷", name: "GR" },
];

const SOCIAL_PLATFORMS = [
  { key: "substack", label: "Substack", abbr: "S", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_1114302e97604b12ad848e7e09d79d7a~mv2.png" },
  { key: "linkedin", label: "LinkedIn", abbr: "in", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_f5173eb03ed341b7b59464b02e11c47e~mv2.png" },
  { key: "reddit", label: "Reddit", abbr: "r/", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_ec3d78300cf04ea6ada0d91c1b8d0fc5~mv2.png" },
  { key: "skool", label: "Skool", abbr: "Sk", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_bda5d0947c814682855394f789b83e17~mv2.png" },
  { key: "facebook", label: "Facebook", abbr: "f", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_be0c01f5ba9d438790b4f54ccc5fc72f~mv2.png" },
  { key: "instagram", label: "Instagram", abbr: "ig", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_9b60a1794e2a476993119d32e973ebad~mv2.png" },
  { key: "threads", label: "Threads", abbr: "@", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_48fbcb369c8e403ea62c2a0a35ee30f4~mv2.png" },
  { key: "x_twitter", label: "X / Twitter", abbr: "X", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_1b9a714b3cf04679907a0836a352d148~mv2.png" },
  { key: "alignable", label: "Alignable", abbr: "A", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_1bdb64c7c66849e4a2573b0928cb5e98~mv2.png" },
  { key: "youtube", label: "YouTube", abbr: "YT", icon: Play, img: "https://static.wixstatic.com/media/7f7b7e_7ce5865803cc4878b39e2bca7143e1e6~mv2.png" },
  { key: "google_business", label: "Google Business", abbr: "G", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_0e4202136e0a4a1098d9a1d142f334a5~mv2.png" },
  { key: "github", label: "GitHub", abbr: "GH", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_9e6f0005902244a4b71295f058a4d00b~mv2.png" },
  { key: "tiktok", label: "TikTok", abbr: "Tk", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_1cc45c26c19a47ada2109047b67087cd~mv2.png" },
  { key: "whatsapp", label: "WhatsApp", abbr: "W", icon: Phone, img: "https://static.wixstatic.com/media/7f7b7e_5a5527c83ce64569ba405ef046e15ff1~mv2.png" },
  { key: "discord", label: "Discord", abbr: "D", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_6616db04a44a4b0894e73e331855e102~mv2.png" },
  { key: "telegram", label: "Telegram", abbr: "T", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_c7db0c3ac837472d8e9b91f7d01eb60b~mv2.png" },
  { key: "pinterest", label: "Pinterest", abbr: "P", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_6064b94e27c04fc495fcae057f926ee2~mv2.png" },
  { key: "snapchat", label: "Snapchat", abbr: "Sc", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_73a2a4c84ca7472e8d0b374192e652fc~mv2.png" },
  { key: "twitch", label: "Twitch", abbr: "Tw", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_f4bf4eaebbd34c23ae2e40c8ca004874~mv2.png" },
  { key: "signal", label: "Signal", abbr: "Si", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_885f02e5b4324b62841088ef76b41dad~mv2.png" },
  { key: "linktree", label: "Linktree", abbr: "Lt", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_de11720067ec4fb789982490a34ad04f~mv2.png" },
  { key: "nextdoor", label: "Nextdoor", abbr: "N", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_1cc1d86903df42709563114ae7200842~mv2.png" },
  { key: "apple_business", label: "Apple Business", abbr: "Ab", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_073dac93ab4048b78154405e7dd23e16~mv2.png" },
  { key: "procore", label: "Procore", abbr: "Pc", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_5780e149539241cd9be3c7131c7a013c~mv2.png" },
  { key: "lovable", label: "Lovable", abbr: "Lv", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_f5e455c825024256b2803f26f5e8ff77~mv2.png" },
  { key: "yelp", label: "Yelp", abbr: "Y", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_91e9715d10274d2bb28ef02b693c50c2~mv2.png" },
  { key: "faq", label: "FAQ", abbr: "?", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_b95763536ad84b51adea4972e011b865~mv2.png" },
  { key: "website_link", label: "Website", abbr: "W", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_57012c5ed52f44deb6d946627607bcae~mv2.png" },
  { key: "email_link", label: "Email", abbr: "@", icon: Mail, img: "https://static.wixstatic.com/media/7f7b7e_5daf26befd7e4ed2a8370aaf2912d82d~mv2.png" },
  { key: "location_link", label: "Location", abbr: "Lc", icon: Globe, img: "https://static.wixstatic.com/media/7f7b7e_819c42ed28074733a4c5d9aa39aac701~mv2.png" },
];

// Email-safe SVG icon generator — creates colored icon as data URI
// Works in Apple Mail, Yahoo, Thunderbird, iOS Mail; Gmail/Outlook get <td> background fallback
const makeEmailSafeIcon = (abbr, size, bgColor, textColor, borderRadius) => {
  const rx = borderRadius === "50%" ? size / 2
    : borderRadius.includes("%") ? size * parseFloat(borderRadius) / 100
      : parseInt(borderRadius) || 0;
  const fontSize = abbr.length > 1 ? size * 0.35 : size * 0.45;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${rx}" fill="${bgColor}"/><text x="${size / 2}" y="${size * 0.62}" text-anchor="middle" dominant-baseline="middle" fill="${textColor}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="0.5">${abbr}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const PhoneField = ({ label, configKey, countryKey }) => {
  const { config, update, isPaid } = useContext(ConfigContext);
  return (
    <div className="space-y-1">
      <label className="section-label"><Phone className="w-3 h-3" /> {label}</label>
      <div className="flex gap-1">
        <select
          value={config[countryKey] || "+1"}
          onChange={(e) => update(countryKey, e.target.value)}
          disabled={!isPaid}
          className="glass-input !w-auto !px-1.5 text-[10px] cursor-pointer flex-shrink-0"
          style={{ minWidth: "72px" }}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code} style={{ background: "#0b1829" }}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={config[configKey]}
          onChange={(e) => update(configKey, e.target.value)}
          className="glass-input flex-1"
          placeholder="(555) 000-0000"
          disabled={!isPaid}
        />
      </div>
    </div>
  );
};

const TIERS = [
  {
    name: "Starter",
    price: { monthly: 9.99, yearly: 99.99 },
    badge: null,
    color: "#869399",
    features: [
      "1 Admin Account",
      "1 Employee Signature",
      "Company Logo / Photo Upload",
      "3 Social Media Icons (of 30)",
      "Email-Safe Font Stack",
      "Basic Color Palette",
      "Wide + Compact Layouts",
      "Gmail • Outlook • Apple Mail Ready",
    ],
    excluded: [
      "Disclaimer Section",
      "Advanced Mobile Glass Cards",
      "Outline / CTA Refinements",
      "Social Icon Shapes",
      "Multiple Phone / Email",
    ],
  },
  {
    name: "Professional",
    price: { monthly: 24.99, yearly: 249.99 },
    badge: "BEST VALUE",
    color: "#3b82f6",
    features: [
      "3 Admin Accounts",
      "Up to 10 Employee Signatures",
      "10 Social Media Icons (of 30)",
      "Company Logo & Photo Upload",
      "Full Email-Safe Font Set",
      "Custom Color Palette",
      "Disclaimer Section",
      "Wide, Banner, Rectangle, Compact Layouts",
      "Mobile Glass + Glass Mini Layouts",
      "Solid + Outline Booking CTAs",
    ],
    excluded: [
      "UTM Link Analytics",
      "All Social Icon Shapes",
      "Multiple Phone / Email Fields",
    ],
  },
  {
    name: "Business",
    price: { monthly: 44.99, yearly: 449.00 },
    badge: "POPULAR",
    color: "#a8c4dc",
    features: [
      "5 Admin Accounts",
      "Up to 20 Employee Signatures",
      "20 Social Media Icons (of 30)",
      "Everything in Professional",
      "Wide Mini Executive Panel",
      "Google Calendar / Booking Link Support",
      "Advanced Color Options",
      "UTM Link Analytics",
      "Executive Layout Controls",
      "Priority Email Support",
    ],
    excluded: ["All Social Icon Shapes", "Multiple Phone / Email Fields"],
  },
  {
    name: "Enterprise",
    price: { monthly: 99.99, yearly: 999.99 },
    badge: "ALL ACCESS",
    color: "#a8c4dc",
    features: [
      "10 Admin Accounts",
      "Up to 50 Employee Signatures",
      "All 30 Social Media Icons",
      "All Safe Icon Shapes",
      "Glass Panel Variants",
      "Multiple Phone & Email Fields",
      "Google Calendar / Booking Link Support",
      "Analytics & Governance Controls",
      "All Safe Layouts and CTA Modes",
      "White-Glove Onboarding",
      "Dedicated Support Channel",
    ],
    excluded: [],
  },
];

// ============================
// MAIN APP
// ============================
export const ConfigContext = createContext();

// ============================================================================
// 👑 MOCKUP-MATCHED SPACIOUS HELPER COMPONENTS (0% Logic Skipped, 100% Spacing Fixed)
// ============================================================================

const InputField = ({ label, configKey, type = "text", icon: Icon }) => {
  const { config, update, isPaid } = useContext(ConfigContext);
  return (
    // 🎯 Spacing row ko space-y-3 kiya taake label input box se na chipke
    <div className="space-y-3 w-full block">
      <label className="section-label flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#00f0ff]" />} {label}
      </label>
      <input
        type={type}
        value={config[configKey]}
        onChange={(e) => update(configKey, e.target.value)}
        // 🎯 Height h-11 aur loose inner padding px-4 ki taake strings deewaron se door rahein
        className="w-full h-11 bg-[#091024]/80 border border-white/[0.08] focus:border-[#00f0ff]/40 rounded-xl px-4 py-2.5 text-xs text-white shadow-inner outline-none transition-all duration-200"
        disabled={!isPaid}
      />
    </div>
  );
};

const ColorControl = ({ label, configKey }) => {
  const { config, update, isPaid } = useContext(ConfigContext);
  return (
    // 🎯 Row height lift karne ke liye padding py-3 ki aur spacing barha di
    <div className="flex items-center justify-between gap-4 py-3 w-full border-b border-white/[0.02] last:border-0">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex-shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={config[configKey]}
          onChange={(e) => update(configKey, e.target.value)}
          // 🎯 Color node dot ko bada kiya h-7.5 w-7.5 tak
          className="w-7.5 h-7.5 rounded-lg cursor-pointer border border-white/10 bg-transparent transition-transform hover:scale-105"
          disabled={!isPaid}
        />
        <input
          type="text"
          value={config[configKey]}
          onChange={(e) => {
            let v = e.target.value;
            if (v && !v.startsWith("#")) v = "#" + v;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v) || v === "") update(configKey, v);
          }}
          onBlur={(e) => {
            if (!/^#[0-9a-fA-F]{6}$/.test(config[configKey]))
              update(configKey, "#000000");
          }}
          // 🎯 Hex code input field ko completely roomy layout par set kar diya
          className="w-[78px] h-8.5 px-2 py-1 rounded-lg text-[10px] font-mono bg-[#050918] text-slate-300 border border-white/10 focus:border-[#00f0ff]/40 outline-none uppercase text-center"
          placeholder="#hex"
          maxLength={7}
          disabled={!isPaid}
        />
      </div>
    </div>
  );
};

const RichTextControl = ({ label, prefix }) => {
  const { config, update, isPaid } = useContext(ConfigContext);
  return (
    // 🎯 Core formatting container gaps barha diye space-y-3.5 se
    <div className="space-y-3.5 w-full block py-2.5">
      <span className="section-label block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{label} Formatting</span>
      <div className="flex items-center gap-2.5 bg-[#050918]/60 p-2.5 rounded-xl border border-white/[0.04]">
        <button
          onClick={() => isPaid && update(`${prefix}Bold`, !config[`${prefix}Bold`])}
          className={`w-8.5 h-8.5 rounded-lg text-[11px] font-black transition-all ${config[`${prefix}Bold`] ? "bg-[#00f0ff] text-[#050510] shadow-md scale-[1.02]" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
        >
          B
        </button>
        <button
          onClick={() => isPaid && update(`${prefix}Italic`, !config[`${prefix}Italic`])}
          className={`w-8.5 h-8.5 rounded-lg text-[11px] italic transition-all ${config[`${prefix}Italic`] ? "bg-[#00f0ff] text-[#050510] shadow-md scale-[1.02]" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
        >
          I
        </button>
        <button
          onClick={() => isPaid && update(`${prefix}Underline`, !config[`${prefix}Underline`])}
          className={`w-8.5 h-8.5 rounded-lg text-[11px] underline transition-all ${config[`${prefix}Underline`] ? "bg-[#00f0ff] text-[#050510] shadow-md scale-[1.02]" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
        >
          U
        </button>
        <div className="w-px h-6 bg-white/10 mx-1.5" />
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black ml-1">Size:</span>
        <input
          type="number"
          min="8"
          max="36"
          value={config[`${prefix}FontSize`]}
          onChange={(e) => update(`${prefix}FontSize`, parseInt(e.target.value) || 12)}
          className="w-14 h-8.5 px-2 py-1 rounded-lg text-[11px] font-mono bg-[#050918] text-slate-300 border border-white/10 outline-none text-center focus:border-[#00f0ff]/30"
          disabled={!isPaid}
        />
      </div>
    </div>
  );
};

const Toggle = ({ label, configKey }) => {
  const { config, update, isPaid } = useContext(ConfigContext);
  return (
    // 🎯 Toggle component boundaries ko solid vertical pad py-3 mila taake content dense na lage
    <div className="flex items-center justify-between w-full py-3 border-b border-white/[0.02] last:border-0">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
        {label}
      </span>
      <button
        onClick={() => isPaid && update(configKey, !config[configKey])}
        // 🎯 Active status tracking pill ko custom layout dynamics diye
        className={`text-[9px] px-4.5 py-1.5 rounded-xl uppercase font-black tracking-wider transition-all border duration-200 ${config[configKey]
          ? "bg-[#00f0ff] text-[#050510] border-transparent shadow-[0_3px_12px_rgba(0,240,255,0.3)] scale-[1.02]"
          : "bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10"
          }`}
      >
        {config[configKey] ? "Active" : "Inactive"}
      </button>
    </div>
  );
};

// 💎 Shadow DOM component — Isolated perfectly
function SigPreview({ html, sigW, innerBg, zoom }) {
  const hostRef = useRef(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!host.shadowRoot) host.attachShadow({ mode: "open" });
    host.shadowRoot.innerHTML =
      `<style>
        *, *::before, *::after { box-sizing: content-box; margin: 0; padding: 0; }
        table { display: table !important; border-collapse: separate; }
        tbody { display: table-row-group !important; }
        tr    { display: table-row !important; }
        td, th { display: table-cell !important; }
        img   { display: inline; border: 0; outline: 0; }
        a     { color: inherit; }
      </style>` + html;
  }, [html]);

  return (
    <div
      ref={hostRef}
      style={{
        width: sigW + "px",
        minWidth: sigW + "px",
        maxWidth: sigW + "px",
        margin: "0 auto",
        background: innerBg,
        padding: "16px",
        transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
        transformOrigin: "top center",
      }}
    />
  );
}

export default function App({ onBackToLanding, onRequestLogin }) {
  const { isPaid, currentUser, savedSignature, brandingLocked } = useAuth();
  const [isYearly, setIsYearly] = useState(true);
  const [copied, setCopied] = useState(false);
  const [installModal, setInstallModal] = useState(null); // null | 'gmail' | 'outlook' | 'apple'
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("core");
  const [layout, setLayout] = useState("horizontal"); // 'horizontal' | 'square' | 'compact'
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [previewBg, setPreviewBg] = useState("dark"); // 'dark' | 'light'
  const [previewZoom, setPreviewZoom] = useState(100);
  const [socialShowCount, setSocialShowCount] = useState(10);
  const [selectedSocial, setSelectedSocial] = useState(null);
  const activeLayout = normalizeLayout(layout);
  const previewWidth = getPreviewWidth(activeLayout, previewDevice);

  const [config, setConfig] = useState(() =>
    normalizeEmailSafeConfig({
      phoneCountryCode: "+1",
      cellCountryCode: "+1",
      name: "Your Name",
      title: "Your Title",
      title2: "",
      company: "Your Company",
      phone: "+1 (555) 000-0000",
      cell: "",
      email: "you@yourcompany.com",
      website: "yourcompany.com",
      location: "City, State",
      tagline: '"Your motto or tagline here"',
      logoUrl: "",
      meetingUrl: "",
      calendarLayout: "button_solid", // none | text_link | button_solid | button_outline
      // Contact Labels
      phoneLabel: "Office",
      cellLabel: "Cell",
      emailLabel: "Email",
      websiteLabel: "Website",
      // Social URLs
      substack: "",
      linkedin: "",
      reddit: "",
      skool: "",
      facebook: "",
      instagram: "",
      threads: "",
      x_twitter: "",
      alignable: "",
      youtube: "",
      google_business: "",
      github: "",
      tiktok: "",
      whatsapp: "",
      discord: "",
      telegram: "",
      pinterest: "",
      snapchat: "",
      twitch: "",
      signal: "",
      linktree: "",
      nextdoor: "",
      apple_business: "",
      procore: "",
      lovable: "",
      yelp: "",
      faq: "",
      website_link: "",
      email_link: "",
      location_link: "",
      // Style — Default: White on Blue (Enterprise Theme)
      accentColor: "#a8c4dc",
      barColor: "#a8c4dc",
      nameColor: "#f7f7f7",
      titleColor: "#a8c4dc",
      bodyColor: "#cbd5e1",
      labelColor: "#a8c4dc",
      linkColor: "#60a5fa",
      bgColor: "#081e3b",
      title2Color: "#60a5fa",
      title2Font: "Segoe UI",
      title2FontSize: 13,
      title2Bold: true,
      title2Italic: false,
      title2Underline: false,
      // Toggles
      showTagline: true,
      showSlogan: true,
      showCompany: true,
      showSocials: true,
      showLocation: true,
      showDisclaimer: true,
      showBestRegards: true,
      locationStyle: "soft-pill", // text | soft-pill | solid-pill
      bestRegardsText: "Best Regards,",
      bestRegardsFont: "Georgia",
      bestRegardsColor: "#ffffff",
      bestRegardsMotion: "none",
      // Disclaimer
      disclaimerText:
        "Confidentiality Notice: This email and any attachments are confidential and may contain privileged or legally protected information. Any unauthorized use, review, disclosure, copying, or distribution is strictly prohibited. If you are not the intended recipient, please notify the sender immediately and permanently delete all copies.",
      disclaimerBarColor: "#e2e8f0",
      disclaimerPadding: 12,
      // Tagline/Motto
      taglineFont: "Georgia",
      taglineFontSize: 16,
      taglineColor: "#94a3b8",
      // Slogan (second line under tagline)
      slogan: "",
      sloganFont: "Georgia",
      sloganFontSize: 10,
      sloganColor: "#a8c4dc",
      sloganBold: true,
      sloganItalic: false,
      sloganUnderline: false,
      // Rich Text Formatting
      nameFont: "Segoe UI",
      nameFontSize: 15,
      nameBold: true,
      nameItalic: false,
      nameUnderline: false,
      titleFontSize: 14,
      titleBold: true,
      titleItalic: false,
      titleUnderline: false,
      companyFontSize: 15,
      companyBold: true,
      companyItalic: false,
      companyUnderline: false,
      taglineBold: true,
      taglineItalic: true,
      taglineUnderline: false,
      bestRegardsFontSize: 15,
      bestRegardsBold: false,
      bestRegardsItalic: true,
      bestRegardsUnderline: false,
      // Image
      imageFrameShape: "circle",
      imageMotion: "none",
      iconSize: 24,
      iconShape: "rounded",
      iconBgColor: "",
      iconColor1: "#a7d2dc",
      iconColor2: "#ffffff",
      iconColorFilter: "brightness(0) saturate(100%) invert(50%) sepia(100%) saturate(345%) hue-rotate(191deg) brightness(190%)", // CSS filter override
      iconContainerSize: 32, // fixed outer container size for consistent bg sizing
      iconEmailMode: "email-safe",
      iconEmailBg: "#0a0a14", // background color for email-safe icon circles
      iconEmailText: "#ffffff", // text/foreground color for email-safe icons
      // Social Layout
      socialDirection: "horizontal", // horizontal | vertical
      socialPlacement: "below-contact",
      // Logo / Photo
      logoSize: 134,
      logoPosition: "left",
      logoOffsetX: 0,
      logoOffsetY: 0,
      glassTint: "#9b8282",
      // Branding & Paywall
      removeBranding: true,
      // Glassmorphic
      glassEnabled: true,
      glassMode: "dark", // dark | light | frosted
      glassOpacity: 75, // 0-100 — background opacity percentage
      glassBlur: 16, // 0-40 — backdrop blur in px
      glassBorderOpacity: 20, // 0-100 — border opacity percentage
      glassBorderColor: "#4ad6f2",
      glassSaturation: 140, // 100-200 — backdrop saturation %
      glassInnerShadow: true, // inset shadow for depth
      // CTA Button (Schedule a Call / Book a Call)
      ctaEnabled: true,
      ctaText: "Schedule a Call",
      ctaStyle: "solid", // solid | outline
      ctaColor1: "#6c6c7f", // gradient start
      ctaColor2: "#6da3ba", // gradient end
      // Border Glow
      borderGlow: "none",
      // Motion Border Controls
      borderThickness: 3,
      borderBlurIntensity: 8,
      borderSpeed: 3,
      borderColor: "#a8c4dc",
      // Enhanced Motion Border Controls
      borderBrightness: 100,     // 50-200 — glow intensity multiplier
      borderPulseMode: 'steady', // steady | breathe | heartbeat | strobe
      borderParticles: false,    // spark particles along border (preview-only)
      // Legacy effect state retained only so old saved configs normalize safely.
      smokeEffect: 'none',
      smokeDensity: 50,          // 0-100
      smokeSpeed: 3,             // 1-10
      smokeColor: '#ffffff',
      // Analytics Link Tracking
      trackingEnabled: true,
      trackingCampaign: "email-signature",
      trackingSource: "email",
      // Calendar Widget
      calendarEnabled: false,
      calendarStyle: "minimal",
    }),
  );

  const update = (key, val) => setConfig((prev) => {
    const next = normalizeEmailSafeConfig({ ...prev, [key]: val });
    try { localStorage.setItem('vsp_config', JSON.stringify(next)); } catch (e) { }
    return next;
  });

  // Hydrate from localStorage first, then saved signature
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vsp_config');
      if (saved) {
        setConfig((prev) =>
          normalizeEmailSafeConfig({ ...prev, ...JSON.parse(saved) }),
        );
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    if (savedSignature) {
      setConfig((prev) =>
        normalizeEmailSafeConfig({ ...prev, ...savedSignature }),
      );
    }
  }, [savedSignature]);

  useEffect(() => {
    if (layout !== activeLayout) {
      setLayout(activeLayout);
    }
  }, [layout, activeLayout]);
  // ============================
  // HELPER: Hex to RGB (used for glassmorphic effects)
  // ============================
  const hexToRGB = (hex) => {
    hex = hex.replace("#", "");
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  };

  // ============================
  // HELPER: Add UTM Tracking to URLs
  // ============================
  const addTracking = (url, cfg) => {
    if (!cfg.trackingEnabled || !url) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}utm_source=email_signature&utm_medium=email&utm_campaign=${encodeURIComponent(cfg.trackingCampaign || 'email-signature')}&utm_content=${encodeURIComponent(cfg.trackingSource || 'email')}`;
  };

  // ============================
  // HTML SIGNATURE GENERATOR
  // ============================
  const generateHTML = () => {
    const isExecutive = activeLayout === "executive";
    const isCompact = activeLayout === "compact";
    const isBanner = activeLayout === "banner";
    const isRectangle = activeLayout === "rectangle";
    const isWideMini = false;
    const isMobileGlass = false;
    const isMobileGlassMini = activeLayout === "mobile-glass-mini";
    const isSlimGlass = activeLayout === "slim-glass";
    const isGlass = isMobileGlass;
    const isMini = isMobileGlassMini;

    // Logo frame shape → email-safe border-radius
    const logoRadius = config.imageFrameShape === "circle" ? "50%"
      : config.imageFrameShape === "rounded" ? "12px"
        : config.imageFrameShape === "square" ? "0"
          : "8px";

    // Email-safe export only: no animation, blur, glow, or CSS filters.
    const motionKeyframes = "";
    const imgMotionStyle = "";
    const imgOffset =
      config.logoOffsetX || config.logoOffsetY
        ? `margin-left:${config.logoOffsetX || 0}px;margin-top:${config.logoOffsetY || 0}px;`
        : "";

    // Social icon border radius based on shape
    const iconBR =
      config.iconShape === "circle" ? "50%" :
        config.iconShape === "rounded" ? "8px" :
          config.iconShape === "rounded-lg" ? "14px" :
            config.iconShape === "rounded-xl" ? "18px" :
              config.iconShape === "hexagon" ? "22% 78% 78% 22% / 22% 22% 78% 78%" :
                config.iconShape === "diamond" ? "50% 0 50% 0" :
                  config.iconShape === "shield" ? "50% 50% 50% 0" :
                    config.iconShape === "leaf" ? "0% 50% 0% 50% / 50% 50% 50% 50%" :
                      config.iconShape === "octagon" ? "18px" :
                        config.iconShape === "squircle" ? "28px" :
                          "0";

    // Fixed container size for consistent bg sizing across all frame shapes
    // Fixed container size for consistent bg sizing across all frame shapes
    const containerSize = config.iconContainerSize || 32;
    const iconPad = Math.max(Math.round((containerSize - config.iconSize) / 2), 2);
    const activeSocials = SOCIAL_PLATFORMS.filter((s) => config[s.key]);
    const isVerticalSocials = config.socialDirection === "vertical";

    // Border thickness + safe zone (must be declared before socialMargin uses bt)
    const bt = config.borderThickness || 2;
    const mobileBase = "word-break:break-word;overflow-wrap:break-word;";
    const safeInset = Math.max(bt * 2 + 4, 12);
    const textClamp = 'max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    const textWrap = 'max-width:100%;overflow-wrap:break-word;word-break:break-word;';

    // Mobile responsive media query block — injected into every signature template
    const mobileMediaCSS = `<style>
.sig-icons{text-align:center!important;}
.sig-icons tr{display:inline-flex!important;flex-wrap:wrap!important;justify-content:center!important;}
@media only screen and (max-width:600px){
  .sig-table{width:100%!important;max-width:100%!important;}
  .sig-col{display:block!important;width:100%!important;box-sizing:border-box!important;}
  .sig-logo{margin:0 auto 8px!important;display:block!important;}
  .sig-logo-cell{display:block!important;width:100%!important;padding-right:0!important;border-right:none!important;}
  .sig-divider-col{border-right:none!important;border-top:1px solid rgba(168,196,220,0.16)!important;padding-top:14px!important;margin-top:8px!important;}
  .sig-stack-center{text-align:center!important;}
  .sig-icons{flex-wrap:wrap!important;}
  .sig-text{font-size:12px!important;}
  .sig-name{font-size:16px!important;}
  .sig-bar{display:none!important;}
}
</style>`;

    // Icon filter and container helpers — 👑 Original names kept to stop lower return leaks!
    const isEmailSafe = true;
    const emailBg = "transparent"; // Forced fully transparent fallback
    const emailText = config.iconEmailText || "#ffffff";

    // 👑 Task 2 REFINED: Build Naked Tiny Image Logos (No outlines, no frames, no text abbreviations)
  const buildIconCell = (s, spacingStyle, vertical = false) => {
  const trackedHref = addTracking(config[s.key], config);
  
  // Justin ki "tiny and subtle" requirement ke liye size maintain rakha hai
  const cSize = Math.min(config.iconSize || 18, 20);
  
  // Glass-like look ke liye styling: 
  // background-color: rgba(255,255,255,0.1) -> halka sa glass fill
  // border: 1px solid rgba(255,255,255,0.2) -> glass border
const glassStyle = `
    width:${cSize}px;
    height:${cSize}px;
    display:inline-block;
    border: 1px solid rgba(255, 255, 255, 0.15); /* Border halka karo */
    border-radius:6px;
    background: rgba(255, 255, 255, 0.05); /* Background aur halka karo */
    backdrop-filter:blur(8px);
    vertical-align:middle;
    margin:0;
    padding:4px; /* Padding barhao taake icon saaf dikhayi de */
  `.replace(/\s+/g, ' ').trim();

  // 👑 Glassmorphic Icon Node
  const inner = `<img src="${s.img}" alt="${s.label}" width="${cSize}" height="${cSize}" style="${glassStyle}" />`;

  if (vertical) {
    const isLast = spacingStyle === '0';
    return `<tr><td style="padding-bottom:${isLast ? '0' : '8'}px;text-align:left;vertical-align:middle;"><a href="${trackedHref}" style="display:inline-block;text-decoration:none;" target="_blank">${inner}</a></td></tr>`;
  }
  return `<td style="${spacingStyle}vertical-align:middle;text-align:left;"><a href="${trackedHref}" style="display:inline-block;text-decoration:none;" target="_blank">${inner}</a></td>`;
};

    const socialIcons = activeSocials
      .map((s, index) => {
        const isLast = index === activeSocials.length - 1;
        const spacing = isVerticalSocials ? `padding-bottom:${isLast ? "0" : "5"}px;` : `padding-right:${isLast ? "0" : "8"}px;`;
        return buildIconCell(s, spacing, false);
      })
      .join("");

    // Vertical: each icon in its own row; Horizontal: all in one row
    const socialIconsRows = isVerticalSocials
      ? activeSocials.map((s, i) => {
        const isLast = i === activeSocials.length - 1;
        return buildIconCell(s, isLast ? '0' : '5', true);
      }).join("")
      : null;

    const socialIconsWrapped = socialIcons
      ? isVerticalSocials
        ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;${textWrap}"><tbody>${socialIconsRows}</tbody></table>`
        : `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;${textWrap}"><tbody><tr>${socialIcons}</tr></tbody></table>`
      : "";

    // Meeting URL link
    let meetingLink = "";
    if (config.meetingUrl && config.calendarLayout !== "none") {
      const trackedMeetingUrl = addTracking(config.meetingUrl, config);
      if (config.calendarLayout === "button_solid") {
        meetingLink = `<a href="${trackedMeetingUrl}" style="display:inline-block;background-color:${config.accentColor};color:${config.bgColor};text-decoration:none;font-weight:bold;font-size:11px;padding:6px 14px;border-radius:4px;margin-top:6px;font-family:'Segoe UI',Arial,sans-serif;text-align:center;">📅 Book a Meeting</a>`;
      } else if (config.calendarLayout === "button_outline") {
        meetingLink = `<a href="${trackedMeetingUrl}" style="display:inline-block;background-color:transparent;color:${config.accentColor};text-decoration:none;font-weight:bold;font-size:11px;padding:5px 13px;border-radius:4px;border:1px solid ${config.accentColor};margin-top:6px;font-family:'Segoe UI',Arial,sans-serif;text-align:center;">📅 Schedule Call</a>`;
      } else {
        meetingLink = `<a href="${trackedMeetingUrl}" style="color:${config.linkColor};text-decoration:none;font-size:11px;display:inline-block;margin-top:4px;">📅 Book a Meeting</a>`;
      }
    }

    const bestRegardsMotionCSS = "";

    // Text formatting inline helpers
    const nameStyle = `font-size:${config.nameFontSize}px;font-weight:${config.nameBold ? "700" : "400"};${config.nameItalic ? "font-style:italic;" : ""}${config.nameUnderline ? "text-decoration:underline;" : ""}color:${config.nameColor};`;
    const titleStyle = `font-size:${config.titleFontSize}px;font-weight:${config.titleBold ? "600" : "400"};${config.titleItalic ? "font-style:italic;" : ""}${config.titleUnderline ? "text-decoration:underline;" : ""}color:${config.titleColor};text-transform:uppercase;letter-spacing:1.5px;`;
    const title2Style = `font-family:'${config.title2Font || "Segoe UI"}',sans-serif;font-size:${config.title2FontSize || 11}px;color:${config.title2Color};${config.title2Bold ? "font-weight:bold;" : ""}${config.title2Italic ? "font-style:italic;" : ""}${config.title2Underline ? "text-decoration:underline;" : ""}`;
    const taglineStyle = `font-family:'${config.taglineFont}',serif;font-size:${config.taglineFontSize}px;color:${config.taglineColor};${config.taglineBold ? "font-weight:bold;" : ""}${config.taglineItalic ? "font-style:italic;" : ""}${config.taglineUnderline ? "text-decoration:underline;" : ""}`;
    const companyStyle = `font-size:${config.companyFontSize || 10}px;color:${config.bodyColor};${config.companyBold ? "font-weight:bold;" : ""}${config.companyItalic ? "font-style:italic;" : ""}${config.companyUnderline ? "text-decoration:underline;" : ""}`;
    const bestRegardsMotionClass = "";
    const bestRegardsStyle = `font-family:'${config.bestRegardsFont}',cursive,serif;font-size:${config.bestRegardsFontSize}px;color:${config.bestRegardsColor};${config.bestRegardsBold ? "font-weight:bold;" : ""}${config.bestRegardsItalic ? "font-style:italic;" : ""}${config.bestRegardsUnderline ? "text-decoration:underline;" : ""}`;

    // Border glow CSS — enhanced with configurable thickness, blur, speed, color
    // bt already declared above
    const bb = config.borderBlurIntensity || 8;
    const bs = config.borderSpeed || 3;
    const bc = config.borderColor || "#a8c4dc";
    const glowColors = {
      none: "",
      gold: "#a8c4dc",
      blue: "#60A5FA",
      teal: "#2dd4bf",
      custom: bc,
      rainbow: null,
    };
    // Brightness multiplier for glow intensity
    const bri = Math.min(Math.max((config.borderBrightness || 100) / 100, 0.5), 2);
    const toHexAlpha = (base, mult) => {
      const v = Math.min(Math.round(base * mult * bri), 255);
      return v.toString(16).padStart(2, '0');
    };
    const pulseMode = config.borderPulseMode || 'steady';

    const borderGlowCSS = "";
    const glowStyle = "";

    // Glassmorphic styles
    const glassRGB = config.glassEnabled ? hexToRGB(config.glassTint || "#081e3b") : null;
    const glassBorderRGB = config.glassEnabled ? hexToRGB(config.glassBorderColor || "#ffffff") : null;
    const isLightGlass = config.glassMode === "light";
    const isFrostedGlass = config.glassMode === "frosted";
    const glassBg = config.glassEnabled
      ? isLightGlass
        ? `rgba(255,255,255,${config.glassOpacity / 100})`
        : isFrostedGlass
          ? `rgba(240,240,245,${Math.min(config.glassOpacity / 100, 0.85)})`
          : `rgba(${glassRGB.r},${glassRGB.g},${glassRGB.b},${config.glassOpacity / 100})`
      : config.bgColor;
    const glassExtraStyles = config.glassEnabled
      ? [
        config.glassBorderOpacity > 0
          ? `border:1px solid rgba(${isLightGlass || isFrostedGlass ? "0,0,0" : `${glassBorderRGB.r},${glassBorderRGB.g},${glassBorderRGB.b}`},${(isLightGlass || isFrostedGlass ? Math.min(config.glassBorderOpacity, 15) : config.glassBorderOpacity) / 100})`
          : "",
        config.glassInnerShadow
          ? isLightGlass || isFrostedGlass
            ? `box-shadow:inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 24px rgba(0,0,0,0.08)`
            : `box-shadow:inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 28px rgba(0,0,0,0.35)`
          : "",
      ]
        .filter(Boolean)
        .join(";") + ";"
      : "";
    // Combined glassmorphic signature style — background always applied, glass extras only when enabled
    const sigBgStyle = config.glassEnabled
      ? `background:${glassBg};${glassExtraStyles}border-radius:12px;padding:16px;`
      : `background:${config.bgColor};`;
    // Light/frosted text color override — use dark text on light glass
    const glassTextDark = (isLightGlass || isFrostedGlass) && config.glassEnabled;
    const gNameColor = glassTextDark ? "#1a1a2e" : config.nameColor;
    const gTitleColor = glassTextDark ? "#374151" : config.titleColor;
    const gBodyColor = glassTextDark ? "#4b5563" : config.bodyColor;
    const gLabelColor = glassTextDark ? "#1f2937" : config.labelColor;
    const gLinkColor = glassTextDark ? "#2563eb" : config.linkColor;
    const gSubtleColor = glassTextDark ? "#6b7280" : "#94a3b8";

    // CTA Button HTML (Schedule a Call / Book a Call)
    const ctaButtonHTML = config.ctaEnabled && config.meetingUrl ? (() => {
      const ctaBg = config.ctaStyle === "outline"
        ? `background:transparent;color:${config.ctaColor1};border:2px solid ${config.ctaColor1};`
        : `background:${config.ctaColor1};color:#fff;border:none;`;
      return `<a href="${addTracking(config.meetingUrl, config)}" target="_blank" style="${ctaBg}display:inline-block;padding:8px 18px;border-radius:20px;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;text-decoration:none;letter-spacing:0.02em;white-space:nowrap;">${config.ctaText}</a>`;
    })() : "";

    // Vivid Signature Branding Badge — rendered AFTER the main table, never inside it
    // 👑 Task 3: In-signature branding badge se trademark string safely clear!
    const brandingBadge = !config.removeBranding ? `<div style="padding-top:16px; text-align:center; width:100%;">
  <a href="https://vividsignature.com/?ref=demo_signature" target="_blank" style="text-decoration:none; display:inline-block; width:100%; max-width:440px;">
    <table cellpadding="0" cellspacing="0" border="0" style="background-color:#040914; border:1px solid rgba(0, 240, 255, 0.15); border-radius:12px; width:100%; box-shadow:0 10px 30px rgba(0,0,0,0.5); table-layout:fixed;">
      <tr>
        <td style="padding:10px 16px; vertical-align:middle;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
              <td style="vertical-align:middle; padding-right:12px; width:28px;">
                <img src="https://static.wixstatic.com/media/7f7b7e_64d07ea4a0bb4932b1293d2f73d402bc~mv2.png" alt="Vivid Signature" width="24" height="24" style="width:24px; height:24px; display:block; object-fit:contain;" />
              </td>
              <td style="vertical-align:middle; font-family:'Segoe UI',Arial,sans-serif; font-size:10px; font-weight:800; color:#f7f7f7; letter-spacing:0.06em; text-transform:uppercase; text-align:left;">
                Powered by Vivid Signature &mdash; <span style="font-weight:500; color:#00f0ff; letter-spacing:0.02em;">Upgrade Plan</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </a>
</div>` : "";
    // Keep old name as alias so all layout return statements below work unchanged
    const brandingBadgeRow = "";

    // "Made with Vivid Signature" watermark — only shown for free tier users
    // 👑 Task 3: Free tier watermark template se trademark code cleanly wipe out!
    const freeWatermark = !isPaid ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;border-top:1px solid #333;padding-top:6px;width:100%"><tr><td style="font-family:Arial,sans-serif;font-size:10px;color:#888"><a href="https://vividsignature.com" target="_blank" style="color:#888;text-decoration:none">&#10022; Made with Vivid Signature</a></td></tr></table>` : "";
    // Pre-computed tracked URLs for use in all templates
    const trackedEmail = addTracking(`mailto:${config.email}`, config);
    const trackedWebsite = addTracking(`https://${config.website}`, config);
    // Phone numbers with country code prefix (only prepend if not already included)
    const fmtPhone = (num, code) => {
      if (!num) return '';
      const c = code || '+1';
      return num.startsWith(c) || num.startsWith('+') ? num : `${c} ${num}`;
    };
    const displayPhone = fmtPhone(config.phone, config.phoneCountryCode);
    const displayCell = fmtPhone(config.cell, config.cellCountryCode);

    // Location HTML — styled based on locationStyle config
    const locationHTML = config.showLocation && config.location ? (() => {
      const locColor = glassTextDark ? gSubtleColor : "#94a3b8";
      if (config.locationStyle === "soft-pill") {
        return `<span style="display:inline-block;font-size:10px;color:${locColor};padding:3px 10px;border-radius:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);">📍 ${config.location}</span>`;
      }
      if (config.locationStyle === "solid-pill") {
        return `<span style="display:inline-block;font-size:10px;color:#fff;padding:3px 10px;border-radius:12px;background:${config.accentColor};">📍 ${config.location}</span>`;
      }
      return `<span style="font-size:10px;color:${locColor};">📍 ${config.location}</span>`;
    })() : "";

    // BANNER — full-width horizontal strip with logo centered at top, text below
    if (isBanner) {
      const bannerSocialIcons = socialIcons
        ? `<table cellpadding="0" cellspacing="0" border="0" class="sig-icons" style="margin:0 auto;display:inline-table;${textWrap}"><tr>${socialIcons}</tr></table>`
        : "";
      const bannerDisclaimer = config.showDisclaimer ? `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:680px;margin-top:6px;"><tr><td style="font-size:9px;color:#94a3b8;padding:${config.disclaimerPadding}px ${safeInset}px;line-height:1.4;${textWrap}">${config.disclaimerText}</td></tr></table>` : "";
      return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:8px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;width:100%;max-width:680px;border-collapse:collapse;border-radius:16px;overflow:hidden;table-layout:fixed;${mobileBase}${glowStyle}${sigBgStyle}">
  <tr><td style="background:${config.barColor};height:3px;"></td></tr>
  <tr style="background:${glassBg};">
    <td style="padding:${safeInset}px;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
        <tr><td style="text-align:center;padding-bottom:12px;">
          ${config.logoUrl
          ? `<div style="display:inline-block;padding:6px;border-radius:18px;background:${isLightGlass || isFrostedGlass ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.04)'};border:1px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.06)' : 'rgba(220,196,155,0.16)'};box-shadow:${isLightGlass || isFrostedGlass ? '0 8px 18px rgba(10,20,40,0.08)' : '0 14px 28px rgba(0,0,0,0.28)'};"><img src="${config.logoUrl}" alt="Logo" class="sig-logo" style="width:${config.logoSize}px;height:${config.logoSize}px;max-width:100%;border-radius:${logoRadius};object-fit:cover;background:transparent;${imgMotionStyle}${imgOffset}" /></div>`
          : `<div style="width:${config.logoSize}px;height:${config.logoSize}px;border-radius:${logoRadius};background:linear-gradient(135deg,#081e3b,#0f172a);margin:0 auto;text-align:center;line-height:${config.logoSize}px;"><span style="color:${config.accentColor};font-size:18px;font-weight:900;">${config.name.split(" ").map((n) => n[0]).join("")}</span></div>`
        }
        </td></tr>
        <tr><td style="text-align:center;">
          <div class="sig-name" style="${nameStyle}line-height:1.2;${textWrap}">${config.name}</div>
          <div class="sig-text" style="${titleStyle}margin-top:2px;${textWrap}">${config.title}</div>
          ${config.title2 ? `<div class="sig-text" style="${title2Style}text-transform:uppercase;letter-spacing:0.5px;margin-top:1px;${textWrap}">${config.title2}</div>` : ""}
          ${(config.company && config.showCompany) ? `<div class="sig-text" style="${companyStyle}margin-top:2px;${textWrap}">${config.company}</div>` : ""}
          ${config.showTagline ? `<div class="sig-text" style="${taglineStyle}font-size:${Math.max(config.taglineFontSize - 1, 12)}px;margin-top:8px;padding-top:8px;border-top:1px solid ${config.barColor}22;${textWrap}">${config.tagline}</div>` : ""}
        </td></tr>
        <tr><td style="height:1px;background:linear-gradient(90deg,transparent,${config.barColor},transparent);padding:0;margin:10px 0;"></td></tr>
        <tr><td style="text-align:center;font-size:11px;color:${config.bodyColor};line-height:1.6;padding-top:10px;${textWrap}">
          ${config.showSocials && config.socialPlacement === "above-contact" ? `<div style="margin-bottom:8px;">${bannerSocialIcons}</div>` : ""}
          <span style="color:${config.labelColor};font-weight:bold;">${config.phoneLabel}:</span> ${displayPhone}<br/>
          ${displayCell ? `<span style="color:${config.labelColor};font-weight:bold;">${config.cellLabel}:</span> ${displayCell}<br/>` : ""}
          <span style="color:${config.labelColor};font-weight:bold;">${config.emailLabel}:</span> <a href="${trackedEmail}" style="color:${config.linkColor};text-decoration:none;${textWrap}">${config.email}</a><br/>
          <span style="color:${config.labelColor};font-weight:bold;">${config.websiteLabel}:</span> <a href="${trackedWebsite}" style="color:${config.linkColor};text-decoration:none;${textWrap}">${config.website}</a>
          ${locationHTML ? `<br/>${locationHTML}` : ""}
          ${meetingLink}
          ${ctaButtonHTML ? `<div style="margin-top:6px;">${ctaButtonHTML}</div>` : ""}
        </td></tr>
      </table>
    </td>
  </tr>
  ${(config.showSocials && config.socialPlacement === "below-contact") || (config.slogan && config.showSlogan) ? `<tr><td style="padding:6px ${safeInset}px 8px;text-align:center;border-top:1px solid ${config.barColor}33;">
    ${config.showSocials && config.socialPlacement === "below-contact" ? bannerSocialIcons : ""}
    ${(config.slogan && config.showSlogan) ? `<div class="sig-text" style="font-family:'${config.sloganFont}',serif;font-size:${config.sloganFontSize}px;color:${config.sloganColor};${config.sloganBold ? "font-weight:bold;" : ""}${config.sloganItalic ? "font-style:italic;" : ""}${config.sloganUnderline ? "text-decoration:underline;" : ""}margin-top:4px;${textWrap}">${config.slogan}</div>` : ""}
  </td></tr>` : ""}
  <tr><td style="background:${config.barColor};height:2px;"></td></tr>
  ${brandingBadgeRow}
</table>${bannerDisclaimer}${brandingBadge}${freeWatermark}`.trim();
    }

    // RECTANGLE — clean minimal rectangle: logo left, info right, cell/email side-by-side
    if (isRectangle) {
      const rectDisclaimer = config.showDisclaimer ? `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;margin-top:6px;"><tr><td style="font-size:9px;color:#94a3b8;padding:${config.disclaimerPadding}px 16px;line-height:1.4;${textWrap}">${config.disclaimerText}</td></tr></table>` : "";
      return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:8px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;width:100%;max-width:520px;border-radius:16px;overflow:hidden;table-layout:fixed;border:1px solid ${config.barColor}33;${mobileBase}${glowStyle}${sigBgStyle}">
  <tr><td colspan="2" style="height:3px;background:linear-gradient(90deg, transparent, ${config.barColor}, transparent);"></td></tr>
  <tr>
    <td class="sig-col sig-logo-cell sig-stack-center" style="width:${config.logoSize + 24}px;padding:16px;vertical-align:top;">
      ${config.logoUrl
          ? `<div style="display:inline-block;padding:6px;border-radius:18px;background:${isLightGlass || isFrostedGlass ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.04)'};border:1px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.06)' : 'rgba(220,196,155,0.16)'};box-shadow:${isLightGlass || isFrostedGlass ? '0 8px 18px rgba(10,20,40,0.08)' : '0 14px 28px rgba(0,0,0,0.28)'};"><div style="width:${config.logoSize}px;height:${config.logoSize}px;border-radius:${logoRadius};overflow:hidden;${imgMotionStyle}"><img src="${config.logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;background:transparent;border-radius:${logoRadius};${imgOffset}" /></div></div>`
          : `<div style="width:${config.logoSize}px;height:${config.logoSize}px;border-radius:${logoRadius};background:linear-gradient(135deg,#081e3b,#0f172a);text-align:center;line-height:${config.logoSize}px;"><span style="color:${config.accentColor};font-size:18px;font-weight:900;">${config.name.split(" ").map((n) => n[0]).join("")}</span></div>`
        }
    </td>
    <td class="sig-col" style="padding:16px;vertical-align:top;overflow:hidden;word-break:break-word;">
      <div class="sig-name" style="${nameStyle}${textWrap}">${config.name}</div>
      <div class="sig-text" style="${titleStyle}margin-top:2px;${textWrap}">${config.title}</div>
      ${config.title2 ? `<div class="sig-text" style="${title2Style}margin-top:2px;${textWrap}">${config.title2}</div>` : ""}
      ${(config.company && config.showCompany) ? `<div style="${companyStyle}margin-top:2px;${textWrap}">${config.company}</div>` : ""}
      <div style="height:1px;background:${config.barColor}33;margin:10px 0;"></div>
      <div class="sig-text" style="font-size:11px;color:${config.bodyColor};padding-bottom:3px;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">${config.phoneLabel}:</span> ${displayPhone}</div>
      ${displayCell ? `<div class="sig-text" style="font-size:11px;color:${config.bodyColor};padding-bottom:3px;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">${config.cellLabel}:</span> ${displayCell}</div>` : ""}
      <div class="sig-text" style="font-size:11px;color:${config.bodyColor};padding-bottom:3px;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">${config.emailLabel}:</span> <a href="${trackedEmail}" style="color:${config.linkColor};text-decoration:none;">${config.email}</a></div>
      <div class="sig-text" style="font-size:11px;color:${config.bodyColor};padding-bottom:3px;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">${config.websiteLabel}:</span> <a href="${trackedWebsite}" style="color:${config.linkColor};text-decoration:none;">${config.website}</a></div>
      ${locationHTML ? `<div style="margin-top:4px;${textWrap}">${locationHTML}</div>` : ""}
      ${meetingLink ? `<div style="margin-top:4px;${textWrap}">${meetingLink}</div>` : ""}
      ${ctaButtonHTML ? `<div style="margin-top:6px;">${ctaButtonHTML}</div>` : ""}
      ${config.showSocials ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid ${config.barColor}22;"><table cellpadding="0" cellspacing="0" border="0" class="sig-icons" style="display:inline-table;${textWrap}"><tr>${socialIcons}</tr></table></div>` : ""}
      ${config.showTagline ? `<div class="sig-text" style="${taglineStyle}margin-top:8px;padding-top:8px;border-top:1px solid ${config.disclaimerBarColor};${textWrap}">${config.tagline}</div>` : ""}
      ${(config.slogan && config.showSlogan) ? `<div class="sig-text" style="font-family:'${config.sloganFont}',serif;font-size:${config.sloganFontSize}px;color:${config.sloganColor};${config.sloganBold ? "font-weight:bold;" : ""}${config.sloganItalic ? "font-style:italic;" : ""}${config.sloganUnderline ? "text-decoration:underline;" : ""}margin-top:4px;${textWrap}">${config.slogan}</div>` : ""}
    </td>
  </tr>
  ${brandingBadgeRow}
</table>${rectDisclaimer}${brandingBadge}${freeWatermark}`.trim();
    }

    // WIDE MINI — large executive glass panel with email-safe static styling
    if (isWideMini) {
      const wmBg = isLightGlass
        ? `linear-gradient(135deg, rgba(255,255,255,0.92), rgba(244,247,250,0.96))`
        : isFrostedGlass
          ? `linear-gradient(135deg, rgba(236,240,245,0.96), rgba(218,226,236,0.92))`
          : `linear-gradient(135deg, rgba(${hexToRGB(config.glassTint || '#081e3b').r},${hexToRGB(config.glassTint || '#081e3b').g},${hexToRGB(config.glassTint || '#081e3b').b},0.96), rgba(7,17,35,0.96))`;
      const wmBorder = isLightGlass || isFrostedGlass
        ? `border:1px solid rgba(255,255,255,0.8);`
        : `border:1px solid rgba(220,196,155,0.35);`;
      const wmShadow = isLightGlass || isFrostedGlass
        ? `box-shadow:0 14px 32px rgba(10,20,40,0.12), inset 0 1px 0 rgba(255,255,255,0.7);`
        : `box-shadow:0 18px 42px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.05);`;
      const wmNC = glassTextDark ? gNameColor : config.nameColor;
      const wmTC = glassTextDark ? gTitleColor : config.titleColor;
      const wmBC = glassTextDark ? gBodyColor : config.bodyColor;
      const wmLC = glassTextDark ? gLabelColor : config.labelColor;
      const wmLnC = glassTextDark ? gLinkColor : config.linkColor;
      const wmSC = glassTextDark ? gSubtleColor : "#94a3b8";
      const wideMiniCols = config.showSocials ? 4 : 3;
      return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:8px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;width:100%;max-width:680px;border-radius:18px;overflow:hidden;${wmBorder}background:${wmBg};${wmShadow}table-layout:fixed;${mobileBase}">
  <tr><td colspan="${wideMiniCols}" style="height:4px;background:linear-gradient(90deg, transparent, ${config.barColor}, transparent);"></td></tr>
  <tr>
    ${config.logoUrl ? `<td class="sig-col sig-logo-cell sig-stack-center" style="width:${Math.min(config.logoSize, 80) + 32}px;padding:18px 14px;vertical-align:middle;">
      <div style="width:${Math.min(config.logoSize, 80)}px;height:${Math.min(config.logoSize, 80)}px;border-radius:${logoRadius};overflow:hidden;border:2px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.08)' : 'rgba(220,196,155,0.3)'};box-shadow:0 4px 16px ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'};${imgMotionStyle}"><img src="${config.logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;background:transparent;border-radius:${logoRadius};${imgOffset}" /></div>
    </td>` : ""}
    <td class="sig-col" style="padding:18px 14px;vertical-align:middle;border-right:1px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.06)' : 'rgba(220,196,155,0.15)'};overflow:hidden;word-break:break-word;">
      <div class="sig-name" style="font-size:${config.nameFontSize}px;font-weight:800;color:${wmNC};font-family:'${config.nameFont}',sans-serif;${textWrap}">${config.name}</div>
      <div class="sig-text" style="font-size:${config.titleFontSize}px;color:${wmTC};margin-top:2px;${textWrap}">${config.title}</div>
      ${config.title2 ? `<div class="sig-text" style="${title2Style}margin-top:1px;${textWrap}">${config.title2}</div>` : ""}
      ${(config.company && config.showCompany) ? `<div style="${companyStyle}margin-top:4px;${textWrap}">${config.company}</div>` : ""}
      ${config.showTagline ? `<div class="sig-text" style="${taglineStyle}margin-top:10px;padding-top:10px;border-top:1px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.08)' : 'rgba(220,196,155,0.15)'};${textWrap}">${config.tagline}</div>` : ""}
    </td>
    <td class="sig-col" style="padding:18px 14px;vertical-align:middle;font-size:11px;color:${wmBC};line-height:1.8;overflow:hidden;word-break:break-word;">
      <div class="sig-text" style="padding-bottom:4px;${textWrap}"><span style="color:${wmLC};font-weight:bold;">${config.phoneLabel}:</span> ${displayPhone}</div>
      ${displayCell ? `<div class="sig-text" style="padding-bottom:4px;${textWrap}"><span style="color:${wmLC};font-weight:bold;">${config.cellLabel}:</span> ${displayCell}</div>` : ""}
      <div class="sig-text" style="padding-bottom:4px;${textWrap}"><span style="color:${wmLC};font-weight:bold;">${config.emailLabel}:</span> <a href="${trackedEmail}" style="color:${wmLnC};text-decoration:none;font-size:11px;">${config.email}</a></div>
      <div class="sig-text" style="padding-bottom:4px;${textWrap}"><span style="color:${wmLC};font-weight:bold;">${config.websiteLabel}:</span> <a href="${trackedWebsite}" style="color:${wmLnC};text-decoration:none;font-size:11px;">${config.website}</a></div>
      ${locationHTML ? `<div style="margin-top:6px;${textWrap}">${locationHTML}</div>` : ""}
      ${meetingLink ? `<div style="margin-top:8px;">${meetingLink}</div>` : ""}
      ${ctaButtonHTML ? `<div style="margin-top:6px;">${ctaButtonHTML}</div>` : ""}
    </td>
    ${config.showSocials ? `<td class="sig-col sig-stack-center" style="width:auto;padding:18px 16px 18px 12px;vertical-align:middle;"><table cellpadding="0" cellspacing="0" border="0" class="sig-icons" style="display:inline-table;${textWrap}"><tr>${socialIcons}</tr></table></td>` : ""}
  </tr>
  ${(config.slogan && config.showSlogan) ? `<tr><td colspan="${wideMiniCols}" style="padding:8px 16px 10px;text-align:center;border-top:1px solid rgba(220,196,155,0.1);">
    ${(config.slogan && config.showSlogan) ? `<div class="sig-text" style="font-family:'${config.sloganFont}',serif;font-size:${config.sloganFontSize}px;color:${config.sloganColor};${config.sloganBold ? "font-weight:bold;" : ""}${config.sloganItalic ? "font-style:italic;" : ""}${config.sloganUnderline ? "text-decoration:underline;" : ""}margin-top:2px;${textWrap}">${config.slogan}</div>` : ""}
  </td></tr>` : ""}
  ${brandingBadgeRow}
</table>${config.showDisclaimer ? `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:680px;margin-top:6px;"><tr><td style="font-size:9px;color:#94a3b8;padding:${config.disclaimerPadding}px 16px;line-height:1.4;${textWrap}">${config.disclaimerText}</td></tr></table>` : ""}${brandingBadge}${freeWatermark}`.trim();
    }

    // MINI — compact mobile glass card (Glass Mini)
    if (isMini) {
      const miniGlassBg = isLightGlass
        ? `linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,247,250,0.92))`
        : isFrostedGlass
          ? `linear-gradient(135deg, rgba(236,240,245,0.96), rgba(225,232,240,0.92))`
          : `linear-gradient(135deg, rgba(${hexToRGB(config.glassTint || '#081e3b').r},${hexToRGB(config.glassTint || '#081e3b').g},${hexToRGB(config.glassTint || '#081e3b').b},0.96), rgba(6,16,32,0.94))`;
      const miniBorder = isLightGlass || isFrostedGlass
        ? `border:1px solid rgba(255,255,255,0.8);`
        : `border:1px solid rgba(220,196,155,0.32);`;
      const miniShadow = isLightGlass || isFrostedGlass
        ? `box-shadow:0 14px 28px rgba(10,20,40,0.12), inset 0 1px 0 rgba(255,255,255,0.7);`
        : `box-shadow:0 18px 36px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.05);`;
      const mNC = glassTextDark ? gNameColor : config.nameColor;
      const mTC = glassTextDark ? gTitleColor : config.titleColor;
      const mBC = glassTextDark ? gBodyColor : config.bodyColor;
      const mLC = glassTextDark ? gLinkColor : config.linkColor;
      const mSC = glassTextDark ? gSubtleColor : "#94a3b8";
      const miniLogoSize = Math.min(config.logoSize, 56);
      const miniDisclaimer = config.showDisclaimer ? `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:340px;margin-top:6px;"><tr><td style="font-size:8px;color:${mSC};padding:6px 14px;line-height:1.3;${textWrap}">${config.disclaimerText}</td></tr></table>` : "";
      return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:8px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;width:100%;max-width:340px;border-radius:20px;overflow:hidden;${miniBorder}background:${miniGlassBg};${miniShadow}${mobileBase}">
  <tr><td colspan="2" style="height:3px;background:linear-gradient(90deg, transparent, ${config.barColor}, transparent);"></td></tr>
  <tr>
    <td class="sig-logo-cell sig-stack-center" style="width:${miniLogoSize + 28}px;padding:14px;vertical-align:top;">
      ${config.logoUrl
          ? `<div style="width:${miniLogoSize}px;height:${miniLogoSize}px;border-radius:${logoRadius};overflow:hidden;border:2px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.08)' : 'rgba(220,196,155,0.3)'};box-shadow:0 2px 12px ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'};${imgMotionStyle}"><img src="${config.logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;background:transparent;border-radius:${logoRadius};${imgOffset}" /></div>`
          : `<div style="width:${miniLogoSize}px;height:${miniLogoSize}px;border-radius:${logoRadius};background:linear-gradient(135deg,#081e3b,#0f172a);text-align:center;line-height:${miniLogoSize}px;"><span style="color:${config.accentColor};font-size:16px;font-weight:900;">${config.name.split(" ").map((n) => n[0]).join("")}</span></div>`
        }
    </td>
    <td style="padding:14px 8px 14px 0;vertical-align:middle;overflow:hidden;word-break:break-word;">
      <div style="${textWrap}"><span class="sig-name" style="font-size:${Math.max(config.nameFontSize - 1, 14)}px;font-weight:800;color:${mNC};">${config.name}</span></div>
      ${config.title ? `<div style="font-size:11px;color:${mTC};font-weight:600;margin-top:2px;${textWrap}">${config.title}</div>` : ""}
      ${(config.company && config.showCompany) ? `<div style="${companyStyle}margin-top:1px;${textWrap}">${config.company}</div>` : ""}
      <div class="sig-text" style="font-size:10px;color:${mBC};margin-top:4px;line-height:1.5;${textWrap}">
        ${displayPhone}${displayCell ? `<br/>${displayCell}` : ""}${config.email ? `<br/><a href="${trackedEmail}" style="color:${mLC};text-decoration:none;">${config.email}</a>` : ""}
      </div>
      ${locationHTML ? `<div style="margin-top:2px;${textWrap}">${locationHTML}</div>` : ""}
    </td>
  </tr>
  ${(config.showSocials || ctaButtonHTML || meetingLink) ? `<tr><td colspan="2" class="sig-stack-center" style="padding:0 14px 12px;">
    ${config.showSocials ? `<div style="margin-bottom:${ctaButtonHTML || meetingLink ? '8' : '0'}px;"><table cellpadding="0" cellspacing="0" border="0" class="sig-icons" style="display:inline-table;"><tr>${socialIcons}</tr></table></div>` : ""}
    ${meetingLink ? `<div style="margin-bottom:${ctaButtonHTML ? '8' : '0'}px;">${meetingLink}</div>` : ""}
    ${ctaButtonHTML ? `<div>${ctaButtonHTML}</div>` : ""}
  </td></tr>` : ""}
  ${config.showTagline ? `<tr><td colspan="2" style="padding:0 14px 10px;"><div class="sig-text" style="${taglineStyle}${textWrap}">${config.tagline}</div></td></tr>` : ""}
  ${brandingBadgeRow}
</table>${miniDisclaimer}${brandingBadge}${freeWatermark}`.trim();
    }

    // GLASS — mobile-first premium contact card
    if (isGlass) {
      const glassCardBg = isLightGlass
        ? `linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,247,250,0.92))`
        : isFrostedGlass
          ? `linear-gradient(135deg, rgba(236,240,245,0.96), rgba(225,232,240,0.92))`
          : `linear-gradient(135deg, rgba(${hexToRGB(config.glassTint || '#081e3b').r},${hexToRGB(config.glassTint || '#081e3b').g},${hexToRGB(config.glassTint || '#081e3b').b},0.96), rgba(5,13,28,0.94))`;
      const glassCardBorder = isLightGlass || isFrostedGlass
        ? `border:1px solid rgba(255,255,255,0.8);`
        : `border:1px solid rgba(220,196,155,0.32);`;
      const glassCardShadow = isLightGlass || isFrostedGlass
        ? `box-shadow:0 14px 28px rgba(10,20,40,0.12), inset 0 1px 0 rgba(255,255,255,0.7);`
        : `box-shadow:0 18px 36px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05);`;
      const gcNC = glassTextDark ? gNameColor : config.nameColor;
      const gcTC = glassTextDark ? gTitleColor : config.titleColor;
      const gcBC = glassTextDark ? gBodyColor : config.bodyColor;
      const gcLC = glassTextDark ? gLabelColor : config.labelColor;
      const gcLnC = glassTextDark ? gLinkColor : config.linkColor;
      return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:8px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;width:100%;max-width:390px;border-radius:20px;overflow:hidden;${glassCardBorder}background:${glassCardBg};${glassCardShadow}${mobileBase}">
  <tr><td style="height:4px;background:linear-gradient(90deg, transparent, ${config.barColor}, transparent);"></td></tr>
  <tr><td style="padding:22px;">
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
      <tr>
        ${config.logoUrl ? `<td class="sig-logo-cell sig-stack-center" style="width:${Math.min(config.logoSize, 72)}px;padding-right:18px;vertical-align:top;"><div style="width:${Math.min(config.logoSize, 72)}px;height:${Math.min(config.logoSize, 72)}px;border-radius:${logoRadius};overflow:hidden;background:transparent;border:2px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.06)' : 'rgba(220,196,155,0.3)'};box-shadow:0 4px 16px ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'};${imgMotionStyle}"><img src="${config.logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;background:transparent;border-radius:${logoRadius};${imgOffset}" /></div></td>` : ""}
        <td style="vertical-align:top;">
          <div class="sig-name" style="font-size:${config.nameFontSize}px;font-weight:800;color:${gcNC};font-family:'${config.nameFont}',sans-serif;${textWrap}">${config.name}</div>
          <div class="sig-text" style="font-size:${config.titleFontSize}px;color:${gcTC};${config.titleBold ? "font-weight:bold;" : ""}${config.titleItalic ? "font-style:italic;" : ""}margin-top:2px;${textWrap}">${config.title}</div>
          ${config.title2 ? `<div class="sig-text" style="${title2Style}margin-top:2px;${textWrap}">${config.title2}</div>` : ""}
          ${(config.company && config.showCompany) ? `<div style="${companyStyle}margin-top:4px;${textWrap}">${config.company}</div>` : ""}
        </td>
      </tr>
    </table>
    <div style="height:1px;background:linear-gradient(90deg,transparent,${config.barColor},transparent);margin:16px 0;"></div>
    ${config.showSocials && config.socialPlacement === "above-contact" ? `<div style="margin-bottom:12px;">${socialIconsWrapped}</div>` : ""}
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;${textWrap}">
      <tr><td class="sig-text" style="font-size:12px;color:${gcBC};padding-bottom:3px;${textWrap}"><span style="color:${gcLC};font-weight:bold;">${config.phoneLabel}:</span> ${displayPhone}</td></tr>
      ${displayCell ? `<tr><td class="sig-text" style="font-size:12px;color:${gcBC};padding-bottom:3px;${textWrap}"><span style="color:${gcLC};font-weight:bold;">${config.cellLabel}:</span> ${displayCell}</td></tr>` : ""}
      <tr><td class="sig-text" style="font-size:12px;color:${gcBC};padding-bottom:3px;${textWrap}"><span style="color:${gcLC};font-weight:bold;">${config.emailLabel}:</span> <a href="${trackedEmail}" style="color:${gcLnC};text-decoration:none;">${config.email}</a></td></tr>
      <tr><td class="sig-text" style="font-size:12px;color:${gcBC};padding-bottom:3px;${textWrap}"><span style="color:${gcLC};font-weight:bold;">${config.websiteLabel}:</span> <a href="${trackedWebsite}" style="color:${gcLnC};text-decoration:none;">${config.website}</a></td></tr>
      ${locationHTML ? `<tr><td class="sig-text" style="padding-bottom:3px;${textWrap}">${locationHTML}</td></tr>` : ""}
      ${meetingLink ? `<tr><td style="padding-top:4px;${textWrap}">${meetingLink}</td></tr>` : ""}
      ${ctaButtonHTML ? `<tr><td style="padding-top:8px;">${ctaButtonHTML}</td></tr>` : ""}
    </table>
    ${config.showSocials ? `<div style="margin-top:12px;">${socialIconsWrapped}</div>` : ""}
    ${config.showTagline ? `<div class="sig-text" style="${taglineStyle}margin-top:14px;padding-top:10px;border-top:1px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.06)' : 'rgba(220,196,155,0.15)'};${textWrap}">${config.tagline}</div>` : ""}
    ${(config.slogan && config.showSlogan) ? `<div class="sig-text" style="font-family:'${config.sloganFont}',serif;font-size:${config.sloganFontSize}px;color:${config.sloganColor};${config.sloganBold ? "font-weight:bold;" : ""}${config.sloganItalic ? "font-style:italic;" : ""}margin-top:4px;${textWrap}">${config.slogan}</div>` : ""}
  </td></tr>
  ${brandingBadgeRow}
</table>${config.showDisclaimer ? `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:390px;margin-top:6px;"><tr><td style="font-size:9px;color:#94a3b8;padding:${config.disclaimerPadding}px 24px;line-height:1.4;${textWrap}">${config.disclaimerText}</td></tr></table>` : ""}${brandingBadge}${freeWatermark}`.trim();
    }

    // EXECUTIVE — slim horizontal card matching landing page style
    if (isExecutive) {
      const initials = config.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("");
      const avatarSize = 44;
      return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:12px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.4;width:100%;max-width:500px;border-radius:12px;overflow:hidden;table-layout:fixed;${mobileBase}${glowStyle}${sigBgStyle}">
  <tr>
    <td style="padding:14px 18px;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
        <tr>
          <td style="vertical-align:middle;width:${avatarSize + 14}px;padding-right:14px;">
            ${config.logoUrl
          ? `<div style="width:${avatarSize}px;height:${avatarSize}px;border-radius:50%;overflow:hidden;border:2px solid ${config.accentColor};${imgMotionStyle}">
                <img src="${config.logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />
              </div>`
          : `<div style="width:${avatarSize}px;height:${avatarSize}px;border-radius:50%;background:linear-gradient(135deg,${config.accentColor},${config.barColor || config.accentColor});display:table-cell;text-align:center;vertical-align:middle;border:2px solid ${config.accentColor};">
                <span style="color:${config.bgColor || '#0a0a14'};font-size:16px;font-weight:900;font-family:'Segoe UI',Arial,sans-serif;">${initials}</span>
              </div>`
        }
          </td>
          <td style="vertical-align:middle;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
              <tr><td style="${nameStyle}padding-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${config.name}</td></tr>
              <tr><td style="font-size:11px;color:${config.titleColor};padding-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase;letter-spacing:1px;">${config.title}${(config.company && config.showCompany) ? ` · ${config.company}` : ""}</td></tr>
              <tr><td style="font-size:10px;color:${config.bodyColor};padding-bottom:2px;">
                ${displayPhone}${config.email ? ` · <a href="${trackedEmail}" style="color:${config.linkColor};text-decoration:none;font-size:10px;">${config.email}</a>` : ""}
              </td></tr>
            </table>
          </td>
          ${activeSocials.length > 0 && config.showSocials ? `<td style="vertical-align:middle;padding-left:10px;white-space:nowrap;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>${activeSocials.slice(0, 8).map((s, i) => {
          const trackedHref = addTracking(config[s.key], config);
          const abbrText = s.abbr || s.label.charAt(0);
          const sz = 18;
          const fs = Math.round(sz * (abbrText.length > 1 ? 0.35 : 0.45));
          return `<td style="padding-right:${i < Math.min(activeSocials.length, 8) - 1 ? "4" : "0"}px;"><a href="${trackedHref}" style="display:block;text-decoration:none;" target="_blank"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="width:${sz}px;height:${sz}px;border-radius:4px;background:${config.iconEmailBg || config.accentColor || '#0a0a14'};color:${config.iconEmailText || '#fff'};font-family:Arial,sans-serif;font-size:${fs}px;font-weight:bold;text-align:center;vertical-align:middle;line-height:${sz}px;">${abbrText}</td></tr></table></a></td>`;
        }).join("")}</tr></table>
          </td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  ${brandingBadgeRow}
</table>${config.showDisclaimer ? `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:500px;margin-top:6px;"><tr><td style="font-size:9px;color:#94a3b8;padding:8px 18px;line-height:1.4;${textWrap}">${config.disclaimerText}</td></tr></table>` : ""}${brandingBadge}${freeWatermark}`.trim();
    }

    // SLIM GLASS — slim horizontal glass card (~1.5in tall x 4-5in wide), no disclaimers
    if (isSlimGlass) {
      const slimGlassBg = isLightGlass
        ? `linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,247,250,0.92))`
        : isFrostedGlass
          ? `linear-gradient(135deg, rgba(236,240,245,0.96), rgba(225,232,240,0.92))`
          : `linear-gradient(135deg, rgba(${hexToRGB(config.glassTint || '#081e3b').r},${hexToRGB(config.glassTint || '#081e3b').g},${hexToRGB(config.glassTint || '#081e3b').b},0.96), rgba(6,16,32,0.94))`;
      const slimBorder = isLightGlass || isFrostedGlass
        ? `border:1px solid rgba(255,255,255,0.8);`
        : `border:1px solid rgba(220,196,155,0.32);`;
      const slimShadow = isLightGlass || isFrostedGlass
        ? `box-shadow:0 10px 24px rgba(10,20,40,0.1), inset 0 1px 0 rgba(255,255,255,0.7);`
        : `box-shadow:0 14px 32px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.05);`;
      const slNC = glassTextDark ? gNameColor : config.nameColor;
      const slTC = glassTextDark ? gTitleColor : config.titleColor;
      const slBC = glassTextDark ? gBodyColor : config.bodyColor;
      const slLC = glassTextDark ? gLinkColor : config.linkColor;
      const slimLogoSize = Math.min(config.logoSize, 44);
      return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:8px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;width:100%;max-width:420px;border-radius:14px;overflow:hidden;${slimBorder}background:${slimGlassBg};${slimShadow}${mobileBase}">
  <tr><td colspan="2" style="height:2px;background:linear-gradient(90deg, transparent, ${config.barColor}, transparent);"></td></tr>
  <tr>
    <td style="width:${slimLogoSize + 20}px;padding:10px 8px 10px 12px;vertical-align:middle;">
      ${config.logoUrl
          ? `<div style="width:${slimLogoSize}px;height:${slimLogoSize}px;border-radius:${logoRadius};overflow:hidden;border:1px solid ${isLightGlass || isFrostedGlass ? 'rgba(0,0,0,0.08)' : 'rgba(220,196,155,0.25)'};${imgMotionStyle}"><img src="${config.logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;background:transparent;border-radius:${logoRadius};${imgOffset}" /></div>`
          : `<div style="width:${slimLogoSize}px;height:${slimLogoSize}px;border-radius:${logoRadius};background:linear-gradient(135deg,#081e3b,#0f172a);text-align:center;line-height:${slimLogoSize}px;"><span style="color:${config.accentColor};font-size:14px;font-weight:900;">${config.name.split(" ").map((n) => n[0]).join("")}</span></div>`
        }
    </td>
    <td style="padding:10px 12px 10px 6px;vertical-align:middle;overflow:hidden;word-break:break-word;">
      <div style="${textWrap}"><span class="sig-name" style="font-size:${Math.max(config.nameFontSize - 2, 13)}px;font-weight:800;color:${slNC};">${config.name}</span>${config.title ? `<span style="font-size:10px;color:${slTC};margin-left:6px;">${config.title}</span>` : ""}</div>
      <div class="sig-text" style="font-size:10px;color:${slBC};margin-top:2px;line-height:1.4;${textWrap}">
        ${displayPhone}${config.email ? ` &middot; <a href="${trackedEmail}" style="color:${slLC};text-decoration:none;font-size:10px;">${config.email}</a>` : ""}${config.website ? ` &middot; <a href="${trackedWebsite}" style="color:${slLC};text-decoration:none;font-size:10px;">${config.website}</a>` : ""}
      </div>
    </td>
  </tr>
  ${config.showSocials ? `<tr><td colspan="2" style="padding:0 12px 8px;text-align:center;"><table cellpadding="0" cellspacing="0" border="0" class="sig-icons" style="display:inline-table;"><tr>${socialIcons}</tr></table></td></tr>` : ""}
  ${brandingBadgeRow}
</table>${brandingBadge}${freeWatermark}`.trim();
    }

    // HORIZONTAL (default) & COMPACT — logo top dead center, text centered underneath
    const hcMaxWidth = isCompact ? "420" : "560";
    const hcDisclaimer = config.showDisclaimer ? `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:${hcMaxWidth}px;margin-top:6px;"><tr><td style="font-size:10px;color:#94a3b8;padding:${config.disclaimerPadding}px ${safeInset}px;line-height:1.4;${textWrap}">${config.disclaimerText}</td></tr></table>` : "";
    // 👑 Task 1: Spacing tightly caged aur balance ki gayi
    // 👑 FINAL PRODUCTION LOCK: Spacing tightly caged, logo perfectly centered, layout restored!
    return `${mobileMediaCSS}${motionKeyframes}${borderGlowCSS}${bestRegardsMotionCSS}${config.showBestRegards ? `<p${bestRegardsMotionClass} style="${bestRegardsStyle}margin-bottom:6px;"><span style="${bestRegardsStyle}">${config.bestRegardsText}</span></p>` : ""}
<table cellpadding="0" cellspacing="0" border="0" class="sig-table" style="font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;font-size:${isCompact ? "11" : "13"}px;line-height:1.3;width:100%;max-width:440px;margin:0 auto;border-radius:10px;overflow:hidden;table-layout:fixed;${mobileBase}${glowStyle}${sigBgStyle.replace('padding:16px;', 'padding:10px;').replace('padding:20px;', 'padding:10px;')};">
  <tr>
    <td class="sig-col sig-logo" style="vertical-align:middle;padding:10px;padding-right:12px;border-right:2px solid ${config.barColor};width:90px;text-align:center;">
      ${config.logoUrl
        ? `<div style="width:75px;height:75px;max-width:100%;border-radius:50%;overflow:hidden;background:transparent;${imgMotionStyle}">
          <img src="${config.logoUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover;background:transparent;border-radius:50%;${imgOffset}" />
        </div>`
        : `<div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#081e3b,#0f172a);display:table-cell;vertical-align:middle;text-align:center;margin:0 auto;">
          <span style="color:${config.accentColor};font-size:24px;font-weight:900;line-height:70px;display:inline-block;letter-spacing:0;text-indent:0;">${config.name
          .split(" ")
          .map((n) => n[0])
          .join("")}</span>
        </div>`
      }
    </td>

    <td style="vertical-align:middle;padding:10px;padding-left:14px;overflow:hidden;word-break:break-word;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;${textWrap}">
        <tr><td class="sig-name" style="${nameStyle}padding-bottom:1px;text-align:left;${textWrap}">${config.name}</td></tr>
        <tr><td class="sig-text" style="${titleStyle}padding-bottom:1px;text-align:left;${textWrap}">${config.title}</td></tr>
        ${config.title2 ? `<tr><td class="sig-text" style="${title2Style}text-transform:uppercase;letter-spacing:1px;padding-bottom:4px;text-align:left;${textWrap}">${config.title2}</td></tr>` : ""}
        ${(config.company && config.showCompany) ? `<tr><td class="sig-text" style="${companyStyle}padding-bottom:4px;text-align:left;${textWrap}">${config.company}</td></tr>` : ""}
        
<tr><td style="padding-top:6px;padding-bottom:6px;"><div style="height:1px;background:linear-gradient(90deg,${config.barColor},transparent);line-size:1px;"></div></td></tr>        
        ${config.showSocials && config.socialPlacement === "above-contact" ? `<tr><td style="padding-top:4px;padding-bottom:4px;text-align:left;overflow:hidden;">${socialIconsWrapped}</td></tr>` : ""}
        
        <tr><td class="sig-text" style="font-size:${isCompact ? "11" : "12"}px;color:${config.bodyColor};padding-top:2px;padding-bottom:2px;text-align:left;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">Office:</span> ${displayPhone}</td></tr>
        ${displayCell ? `<tr><td class="sig-text" style="font-size:${isCompact ? "11" : "12"}px;color:${config.bodyColor};padding-bottom:2px;text-align:left;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">Cell:</span> ${displayCell}</td></tr>` : ""}
        <tr><td class="sig-text" style="font-size:${isCompact ? "11" : "12"}px;color:${config.bodyColor};padding-bottom:2px;text-align:left;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">Email:</span> <a href="${trackedEmail}" style="color:${config.linkColor};text-decoration:none;">${config.email}</a></td></tr>
        <tr><td class="sig-text" style="font-size:${isCompact ? "11" : "12"}px;color:${config.bodyColor};padding-bottom:2px;text-align:left;${textWrap}"><span style="color:${config.labelColor};font-weight:bold;">Website:</span> <a href="${trackedWebsite}" style="color:${config.linkColor};text-decoration:none;">${config.website}</a></td></tr>
        
        ${meetingLink ? `<tr><td style="padding-bottom:2px;text-align:left;${textWrap}">${meetingLink}</td></tr>` : ""}
        ${locationHTML ? `<tr><td style="padding-bottom:4px;text-align:left;${textWrap}">${locationHTML}</td></tr>` : ""}
        ${ctaButtonHTML ? `<tr><td style="padding-bottom:4px;text-align:left;">${ctaButtonHTML}</td></tr>` : ""}
        ${config.showSocials && config.socialPlacement === "below-contact" ? `<tr><td style="padding-top:4px;text-align:left;overflow:hidden;">${socialIconsWrapped}</td></tr>` : ""}
        ${config.showTagline ? `<tr><td class="sig-text" style="${taglineStyle}font-size:${config.taglineFontSize}px;border-top:1px solid ${config.disclaimerBarColor};padding-top:6px;margin-top:4px;text-align:left;${textWrap}">${config.tagline}</td></tr>` : ""}
        ${(config.slogan && config.showSlogan) ? `<tr><td class="sig-text" style="font-family:'${config.sloganFont}',serif;font-size:${config.sloganFontSize}px;color:${config.sloganColor};${config.sloganBold ? "font-weight:bold;" : ""}${config.sloganItalic ? "font-style:italic;" : ""}${config.sloganUnderline ? "text-decoration:underline;" : ""}padding-top:2px;text-align:left;${textWrap}">${config.slogan}</td></tr>` : ""}
      </table>
    </td>
  </tr>
  ${brandingBadgeRow}
</table>${hcDisclaimer}${brandingBadge}${freeWatermark}`.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAutoInject = async (client) => {
    const html = generateHTML();
    try {
      const blob = new Blob([html], { type: "text/html" });
      const clipboardItem = new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([html], { type: "text/plain" }),
      });
      await navigator.clipboard.write([clipboardItem]);
    } catch {
      await navigator.clipboard.writeText(html);
    }
    if (client === "gmail") window.open("https://mail.google.com/mail/u/0/#settings/general", "_blank");
    if (client === "outlook") window.open("https://outlook.live.com/mail/0/options/mail/messageContent", "_blank");
    setInstallModal(client);
  };

  // ── Install Instructions Modal ──
  const INSTALL_STEPS = {
    gmail: {
      label: "Gmail",
      color: "#ea4335",
      settingsUrl: "https://mail.google.com/mail/u/0/#settings/general",
      steps: [
        { icon: "1", text: "Gmail Settings opened in a new tab — switch to it now." },
        { icon: "2", text: 'Scroll down to the "Signature" section.' },
        { icon: "3", text: 'Click "+ Create new" to make a new signature, or click an existing one to edit it.' },
        { icon: "4", text: "Click inside the signature text box so your cursor is inside it." },
        { icon: "5", text: "Press Ctrl+A to select all (clears any old content), then Ctrl+V to paste your new signature." },
        { icon: "6", text: 'Scroll to the bottom of the Settings page and click "Save Changes".' },
        { icon: "✓", text: "Done! Compose a new email to preview your signature.", highlight: true },
      ],
      warning: "⚠️ Do NOT right-click → Paste. Use Ctrl+V (Windows) or Cmd+V (Mac) inside the signature box to keep the formatting.",
    },
    outlook: {
      label: "Outlook",
      color: "#0078d4",
      settingsUrl: "https://outlook.live.com/mail/0/options/mail/messageContent",
      steps: [
        { icon: "1", text: "Outlook Settings opened in a new tab — switch to it now." },
        { icon: "2", text: 'Find "Email signature" in the left panel and click it.' },
        { icon: "3", text: "Click inside the signature editor box so your cursor is active inside it." },
        { icon: "4", text: "Press Ctrl+A to clear any existing signature, then Ctrl+V to paste." },
        { icon: "5", text: 'Click "Save" at the top of the signature section.' },
        { icon: "✓", text: "Done! Open a new email to see your signature.", highlight: true },
      ],
      desktopSteps: [
        { icon: "1", text: "Open Outlook Desktop app." },
        { icon: "2", text: 'Go to File → Options → Mail → click "Signatures…"' },
        { icon: "3", text: 'Click "New" to create one, or select an existing signature to replace.' },
        { icon: "4", text: "Click inside the editor box, press Ctrl+A then Ctrl+V to paste." },
        { icon: "5", text: 'Click "OK" twice to close and save.' },
      ],
      warning: "⚠️ Outlook Desktop: Use the Signatures editor — do NOT paste into the compose window directly.",
    },
    apple: {
      label: "Apple Mail",
      color: "#888",
      steps: [
        { icon: "1", text: "Open Apple Mail on your Mac." },
        { icon: "2", text: "Go to Mail → Settings (or Preferences) → Signatures." },
        { icon: "3", text: "Select your account on the left, then click the + button to create a new signature." },
        { icon: "4", text: 'Uncheck "Always match my default message font" if it appears.' },
        { icon: "5", text: "Click inside the signature preview area, press Cmd+A then Cmd+V to paste." },
        { icon: "6", text: "Close the Signatures window — changes save automatically." },
        { icon: "✓", text: "Done! Compose a new email to preview your signature.", highlight: true },
      ],
      warning: "⚠️ Apple Mail strips some HTML formatting. For best results use Gmail or Outlook Web.",
    },
  };

  const InstallModal = () => {
    const data = INSTALL_STEPS[installModal];
    if (!data) return null;
    const [tab, setTab] = useState("web");
    const steps = tab === "desktop" && data.desktopSteps ? data.desktopSteps : data.steps;
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setInstallModal(null)}>
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1829] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10" style={{ background: `${data.color}18` }}>
            <div>
              <div className="text-white font-bold text-sm">{data.label} — Signature Install Guide</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Your signature is copied to clipboard. Follow these steps.</div>
            </div>
            <button onClick={() => setInstallModal(null)} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
          </div>

          {/* Web / Desktop tabs for Outlook */}
          {data.desktopSteps && (
            <div className="flex border-b border-white/10">
              {["web", "desktop"].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === t ? "text-[#00f0ff] border-b-2 border-[#00f0ff]" : "text-slate-500 hover:text-slate-300"}`}>
                  {t === "web" ? "Outlook Web" : "Outlook Desktop"}
                </button>
              ))}
            </div>
          )}

          {/* Steps */}
          <div className="px-5 py-4 space-y-3 max-h-[55vh] overflow-y-auto">
            {steps.map((step, i) => (
              <div key={i} className={`flex gap-3 items-start rounded-xl p-3 ${step.highlight ? "bg-green-500/10 border border-green-500/20" : "bg-white/3"}`}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: step.highlight ? "#10b981" : data.color, color: "#fff" }}>
                  {step.icon}
                </div>
                <p className={`text-[11px] leading-relaxed ${step.highlight ? "text-green-400 font-semibold" : "text-slate-300"}`}>{step.text}</p>
              </div>
            ))}
          </div>

          {/* Warning */}
          {data.warning && (
            <div className="mx-5 mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
              {data.warning}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex gap-2 px-5 pb-5">
            <button
              onClick={async () => {
                const html = generateHTML();
                try {
                  await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([html], { type: "text/plain" }) })]);
                } catch { await navigator.clipboard.writeText(html); }
                setCopied(true); setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all"
            >
              {copied ? "✓ Copied!" : "Copy Again"}
            </button>
            {data.settingsUrl && (
              <button onClick={() => window.open(data.settingsUrl, "_blank")}
                className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all">
                Reopen Settings ↗
              </button>
            )}
            <button onClick={() => setInstallModal(null)}
              className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-[#00f0ff] text-[#050510] hover:brightness-110 transition-all">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  // EDITOR SECTION COMPONENTS EXTRACTED TO FIX RENDER LOOP & FOCUS LOSS

  // 👑 FIXED: Control Panel Spacing to fix the cramped/tang layout look!
  // ============================================================================
  // 👑 FIXED EXTRA-SPACIOUS VIEWS (0% Logic/Content Lost — 100% Spacing Fixed)
  // ============================================================================
  const editorSections = {
    core: (
      <div className="space-y-8 animate-fade-in px-4 py-4 block w-full">
        <InputField label="Full Name" configKey="name" icon={PenTool} />
        <InputField label="Credentials" configKey="title" icon={Star} />
        <InputField label="Title / Role" configKey="title2" icon={Layers} />
        <InputField label="Company Name" configKey="company" icon={Globe} />
      </div>
    ),
    contact: (
      <div className="space-y-8 animate-fade-in px-4 py-4 block w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhoneField label="Office Phone" configKey="phone" countryKey="phoneCountryCode" />
          <PhoneField label="Cell Phone" configKey="cell" countryKey="cellCountryCode" />
        </div>
        <InputField label="Email Address" configKey="email" icon={Mail} />
        <InputField label="Website URL" configKey="website" icon={Globe} />
        <InputField label="Location" configKey="location" icon={MapPin} />

        <div className="space-y-4 pt-6 border-t border-white/10 block w-full">
          <label className="section-label flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400"><Calendar className="w-4 h-4 text-[#00f0ff]" /> Meeting / Booking URL</label>
          <input type="text" value={config.meetingUrl} onChange={(e) => update("meetingUrl", e.target.value)} className="w-full h-11 bg-[#091024]/80 border border-white/[0.08] focus:border-[#00f0ff]/40 rounded-xl px-4 py-2.5 text-xs text-white shadow-inner outline-none" />
          <div className="flex gap-2.5 flex-wrap pt-2">
            {[
              { val: "none", label: "Hidden" },
              { val: "text_link", label: "Text Link" },
              { val: "button_solid", label: "Solid Button" },
              { val: "button_outline", label: "Outline Button" },
            ].map((calOpt) => (
              <button
                key={calOpt.val}
                onClick={() => update("calendarLayout", calOpt.val)}
                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-200 ${config.calendarLayout === calOpt.val ? "bg-[#00f0ff] text-[#050510] shadow-md scale-[1.02]" : "bg-white/5 text-slate-400 hover:text-white"}`}
              >
                {calOpt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/10 block w-full">
          <span className="section-label block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Contact Labels</span>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Phone Label</span>
              <input type="text" value={config.phoneLabel} onChange={(e) => update("phoneLabel", e.target.value)} className="w-full h-10 bg-[#050918] border border-white/10 rounded-xl px-3 text-xs text-white" disabled={!isPaid} />
            </div>
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Cell Label</span>
              <input type="text" value={config.cellLabel} onChange={(e) => update("cellLabel", e.target.value)} className="w-full h-10 bg-[#050918] border border-white/10 rounded-xl px-3 text-xs text-white" disabled={!isPaid} />
            </div>
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Email Label</span>
              <input type="text" value={config.emailLabel} onChange={(e) => update("emailLabel", e.target.value)} className="w-full h-10 bg-[#050918] border border-white/10 rounded-xl px-3 text-xs text-white" disabled={!isPaid} />
            </div>
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">Website Label</span>
              <input type="text" value={config.websiteLabel} onChange={(e) => update("websiteLabel", e.target.value)} className="w-full h-10 bg-[#050918] border border-white/10 rounded-xl px-3 text-xs text-white" disabled={!isPaid} />
            </div>
          </div>
        </div>
      </div>
    ),
    branding: (
      <div className="space-y-8 animate-fade-in px-4 py-4 block w-full">
        <InputField label="General Motto / Tagline" configKey="tagline" icon={Sparkles} />
        <InputField label="Slogan / Suite Info (2nd Line)" configKey="slogan" icon={Sparkles} />
        <InputField label="Logo Image URL" configKey="logoUrl" icon={Globe} />

        <div className="space-y-4 pt-6 border-t border-white/10 block w-full">
          <span className="section-label flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400"><Palette className="w-4 h-4 text-[#00f0ff]" /> Color Settings</span>
          <div className="bg-[#050918]/60 p-4 rounded-2xl border border-white/[0.04] space-y-2">
            <ColorControl label="Accent / Bar" configKey="barColor" />
            <ColorControl label="Name Text" configKey="nameColor" />
            <ColorControl label="Primary Title" configKey="titleColor" />
            <ColorControl label="Secondary Title" configKey="title2Color" />
            <ColorControl label="Body Links" configKey="linkColor" />
            <ColorControl label="Background" configKey="bgColor" />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10 block w-full">
          <span className="section-label block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Color Palette Presets</span>
          <div className="flex gap-3 flex-wrap bg-black/20 p-4 rounded-xl border border-white/[0.02]">
            {[
              { c: "#a8c4dc", label: "Gold" },
              { c: "#3b82f6", label: "Blue" },
              { c: "#10b981", label: "Green" },
              { c: "#f59e0b", label: "Amber" },
              { c: "#ef4444", label: "Red" },
              { c: "#8b5cf6", label: "Purple" },
              { c: "#2dd4bf", label: "Teal" },
            ].map(({ c, label }) => (
              <button
                key={c}
                title={label}
                onClick={() => {
                  if (!isPaid) return;
                  ["accentColor", "barColor", "titleColor", "labelColor", "linkColor"].forEach((k) => update(k, c));
                }}
                className={`w-7 h-7 rounded-lg transition-all border border-white/10 hover:scale-110 ${config.accentColor === c ? "ring-2 ring-white scale-110" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    social: (
      <div className="space-y-6 animate-fade-in px-4 py-4 block w-full">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Click icon template node to edit link</div>
        <div className="grid gap-3 bg-black/20 p-5 rounded-2xl border border-white/[0.02]" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
          {SOCIAL_PLATFORMS.map((s) => {
            const hasUrl = !!config[s.key];
            const isSelected = selectedSocial === s.key;
            return (
              <button
                key={s.key}
                title={s.label}
                onClick={() => setSelectedSocial(isSelected ? null : s.key)}
                className={`h-11 w-full rounded-xl flex items-center justify-center transition-all border duration-200 ${isSelected ? "border-[#00f0ff] bg-[#00f0ff]/20 scale-110 shadow-lg" : hasUrl ? "border-green-500/50 bg-green-500/10 hover:scale-105" : "border-white/10 bg-white/5 hover:border-white/30 hover:scale-105"
                  }`}
              >
                <img src={s.img} alt={s.label} className="w-5 h-5 object-contain" />
              </button>
            );
          })}
        </div>
        {selectedSocial && (() => {
          const s = SOCIAL_PLATFORMS.find(p => p.key === selectedSocial);
          return (
            <div className="mt-4 space-y-3 bg-[#050918]/80 p-5 rounded-2xl border border-white/[0.05] animate-fade-in block w-full">
              <label className="section-label flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                <img src={s.img} alt={s.label} className="w-4 h-4 object-contain" /> {s.label} URL
              </label>
              <div className="flex gap-2">
                <input type="text" value={config[s.key] || ""} onChange={(e) => update(s.key, e.target.value)} className="w-full h-11 bg-black/40 border border-white/[0.08] focus:border-[#00f0ff]/30 rounded-xl px-4 text-xs text-white outline-none" placeholder={`https://...`} disabled={!isPaid} />
                {config[s.key] && (
                  <button onClick={() => { update(s.key, ""); setSelectedSocial(null); }} className="px-4 text-[10px] font-black text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl transition-all">✕</button>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    ),
    options: (
      // 👑 MAX BREATHING MATRIX: Loose cards with zero truncated code
      <div className="space-y-10 animate-fade-in px-5 py-5 block w-full">

        {/* Module 1: Remove Branding Pro Control */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#061c3a] via-[#09152b] to-[#040916] border border-[#00f0ff]/30 shadow-[0_25px_50px_rgba(0,0,0,0.7)] relative overflow-hidden group block w-full">
          <div className="absolute inset-0 bg-[#00f0ff]/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex border border-[#00f0ff]/40 rounded-xl p-3 bg-[#030612] shadow-md group-hover:scale-105 transition-transform duration-300">
                {config.removeBranding ? <Unlock className="w-4 h-4 text-[#00f0ff]" /> : <Shield className="w-4 h-4 text-slate-500" />}
              </div>
              <div>
                <div className={`font-black text-[12px] uppercase tracking-[0.18em] ${config.removeBranding ? 'text-[#00f0ff]' : 'text-slate-300'}`}>Remove Branding (Pro Plan)</div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">Vivid Signature Badge Control</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (brandingLocked && !isPaid) {
                  alert("Branding removal requires a paid subscription at vividsignature.com");
                  return;
                }
                if (!isPaid) {
                  if (!currentUser && window.confirm("Removing branding requires the $9.99/mo Pro Plan.\n\nWould you like to log in now?")) {
                    if (onRequestLogin) onRequestLogin();
                  }
                  return;
                }
                update("removeBranding", !config.removeBranding);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${config.removeBranding ? "bg-[#00f0ff]" : "bg-white/10"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-4.5 transform rounded-full shadow transition duration-300 ease-in-out ${config.removeBranding ? "translate-x-5 bg-[#050510]" : "translate-x-0 bg-white/60"}`} />
            </button>
          </div>
        </div>

        {/* Module 2: Visibility Framework Matrix */}
        <div className="space-y-6 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-[0_20px_45px_rgba(0,0,0,0.55)] block w-full">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
            <div className="w-1.5 h-3 bg-[#00f0ff] rounded-sm shadow-[0_0_8px_#00f0ff]" />
            <span className="section-label block text-[11px] font-black text-[#00f0ff] uppercase tracking-[0.2em]">Visibility Matrix</span>
          </div>
          <div className="grid gap-7 bg-[#040815]/50 p-6 rounded-xl border border-white/[0.02]">
            <Toggle label="Show Motto / Tagline" configKey="showTagline" />
            <Toggle label="Show Slogan / Suite" configKey="showSlogan" />
            <Toggle label="Show Company Name" configKey="showCompany" />
            <Toggle label="Show Social Icons" configKey="showSocials" />
            <Toggle label="Show Location Badge" configKey="showLocation" />
          </div>
          {config.showLocation && (
            <div className="pl-4 border-l-2 border-[#00f0ff]/30 py-4 mt-3 bg-black/20 rounded-r-xl space-y-4 animate-fade-in border border-white/[0.02]">
              <span className="section-label block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Location Style</span>
              <div className="flex gap-2.5 flex-wrap">
                {[{ val: "text", label: "Pure Text" }, { val: "soft-pill", label: "Glass Pill" }, { val: "solid-pill", label: "Accent Pill" }].map((opt) => (
                  <button key={opt.val} onClick={() => isPaid && update("locationStyle", opt.val)} className={`px-4.5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all duration-200 ${config.locationStyle === opt.val ? "bg-[#00f0ff] text-[#050510] border-transparent font-black shadow-md scale-[1.02]" : "bg-white/5 text-slate-400 border-white/5 hover:text-white"}`}>{opt.label}</button>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-7 pt-4 border-t border-white/[0.04] bg-[#040815]/30 p-6 rounded-xl border border-white/[0.01]">
            <Toggle label="Show Legal Disclaimer" configKey="showDisclaimer" />
            <Toggle label="Show Greeting Block" configKey="showBestRegards" />
          </div>
        </div>

        {/* Module 3: Salutations Platform */}
        {config.showBestRegards && (
          <div className="space-y-6 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-[0_20px_45px_rgba(0,0,0,0.55)] block w-full animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
              <div className="w-1.5 h-3 bg-[#a8c4dc] rounded-sm shadow-[0_0_8px_rgba(168,196,220,0.5)]" />
              <span className="section-label block text-[11px] font-black text-[#a8c4dc] uppercase tracking-[0.2em]">Greeting Configurations</span>
            </div>
            <div className="py-2">
              <InputField label="Greeting Text" configKey="bestRegardsText" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.04]">
              <div className="space-y-2.5">
                <span className="section-label block text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Family</span>
                <select value={config.bestRegardsFont} onChange={(e) => update("bestRegardsFont", e.target.value)} className="w-full h-11 bg-[#050918] border border-white/10 rounded-xl px-4 text-xs text-white cursor-pointer focus:border-[#00f0ff]/40 outline-none" disabled={!isPaid}>
                  {EMAIL_SAFE_FONTS.map((f) => (<option key={f} value={f} style={{ fontFamily: f, background: "#060b1e" }}>{f}</option>))}
                </select>
              </div>
              <div className="flex items-end pb-1"><ColorControl label="Greeting Color" configKey="bestRegardsColor" /></div>
            </div>
            <div className="bg-black/20 p-5 rounded-xl border border-white/[0.02] pt-4"><RichTextControl label="Greeting" prefix="bestRegards" /></div>
          </div>
        )}

        {/* Module 4: Rich Typography Mechanical Engine */}
        <div className="space-y-6 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-[0_25px_50px_rgba(0,0,0,0.6)] block w-full">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
            <Type className="w-4 h-4 text-[#00f0ff] drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]" />
            <span className="section-label block text-[11px] font-black text-[#00f0ff] uppercase tracking-[0.2em]">Text Formatting Engine</span>
          </div>
          <div className="space-y-6 bg-black/20 p-5 rounded-xl border border-white/[0.02]">
            <RichTextControl label="Full Name" prefix="name" />
            <div className="h-px bg-white/[0.04]" />
            <RichTextControl label="Credentials Block" prefix="title" />
            <div className="h-px bg-white/[0.04]" />
            <RichTextControl label="Title / Role Tag" prefix="title2" />
            <div className="h-px bg-white/[0.04]" />
            <RichTextControl label="Company Identifier" prefix="company" />
          </div>
        </div>

        {/* Module 5: Legal Disclaimer Document Panel */}
        {config.showDisclaimer && (
          <div className="space-y-4 bg-[#060c20]/40 rounded-2xl p-6 border border-white/[0.05] shadow-md block w-full">
            <span className="section-label block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Legal Disclaimer String</span>
            <textarea value={config.disclaimerText} onChange={(e) => update("disclaimerText", e.target.value)} className="w-full h-32 bg-[#091024] border border-white/10 rounded-xl p-4 text-xs text-white focus:border-[#00f0ff]/30 outline-none resize-none leading-relaxed shadow-inner" disabled={!isPaid} />
          </div>
        )}
      </div>
    ),
    effects: (
      // 👑 HIGH-END EFFECTS ARCHITECTURE LAYERS: Polished blocks with wide padding allocations
      <div className="space-y-10 animate-fade-in px-5 py-5 block w-full">

        {/* Module 1: System Stability Board */}
        <div className="rounded-2xl border border-[#00f0ff]/20 bg-gradient-to-br from-[#071329] via-[#09152b] to-[#040916] p-6 text-[11px] text-slate-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative overflow-hidden group block w-full">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
          <div className="font-black uppercase tracking-[0.2em] text-[#00f0ff] flex items-center gap-2 mb-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            Email-Safe Engine Active
          </div>
          <p className="leading-relaxed text-slate-400 font-medium">Motion and dynamic layout effects are auto-filtered for absolute inbox stability inside Gmail and Outlook endpoints.</p>
        </div>

        {/* Module 2: Avatar Shape Geometries */}
        <div className="space-y-5 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-lg block w-full">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
            <div className="w-1.5 h-3 bg-[#00f0ff] rounded-sm shadow-[0_0_8px_#00f0ff]" />
            <span className="section-label block text-[11px] font-black text-[#00f0ff] uppercase tracking-[0.2em]">Image Frame Shape</span>
          </div>
          <div className="flex gap-3 bg-black/20 p-4 rounded-xl border border-white/[0.01]">
            {["circle", "rounded", "square"].map((shape) => (
              <button key={shape} onClick={() => isPaid && update("imageFrameShape", shape)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border h-10 flex-1 text-center transition-all duration-200 ${config.imageFrameShape === shape ? "bg-[#00f0ff] text-[#050510] border-transparent shadow-md scale-[1.01]" : "bg-white/5 text-slate-400 border-white/5 hover:text-white"}`}>{shape}</button>
            ))}
          </div>
        </div>

        {/* Module 3: Glyph Proportions Matrix */}
        <div className="space-y-5 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-lg block w-full">
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
            <span className="section-label block text-[11px] font-black text-slate-400 uppercase tracking-[0.18em]">Social Icon Size Matrix</span>
            <span className="text-[10px] font-mono font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded-md border border-[#00f0ff]/20">{config.iconSize}PX</span>
          </div>
          <div className="pt-3">
            <input type="range" min="16" max="34" value={config.iconSize} onChange={(e) => update("iconSize", parseInt(e.target.value))} className="w-full accent-[#00f0ff] cursor-pointer h-2" disabled={!isPaid} />
            <div className="flex justify-between text-[8px] text-slate-600 uppercase font-mono tracking-widest mt-2 px-0.5">
              <span>Min Bounds (16px)</span>
              <span>Max Bounds (34px)</span>
            </div>
          </div>
        </div>

        {/* Module 4: Outer Ribbon Shape Vectors */}
        <div className="space-y-5 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-lg block w-full">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
            <div className="w-1.5 h-3 bg-[#00f0ff] rounded-sm shadow-[0_0_8px_#00f0ff]" />
            <span className="section-label block text-[11px] font-black text-[#00f0ff] uppercase tracking-[0.2em]">Social Icon Base Shape</span>
          </div>
          <div className="flex gap-3 bg-black/20 p-4 rounded-xl border border-white/[0.01]">
            {["circle", "rounded", "square"].map((shape) => (
              <button key={shape} onClick={() => isPaid && update("iconShape", shape)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border h-10 flex-1 text-center transition-all duration-200 ${config.iconShape === shape ? "bg-[#00f0ff] text-[#050510] border-transparent shadow-md scale-[1.01]" : "bg-white/5 text-slate-400 border-white/5 hover:text-white"}`}>{shape}</button>
            ))}
          </div>
        </div>

        {/* Module 5: Strategic Token Preset Palettes */}
        <div className="space-y-5 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-[0_20px_40px_rgba(0,0,0,0.6)] block w-full">
          <div className="pb-3 border-b border-white/[0.04]">
            <span className="section-label block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Preset Theme Palettes</span>
          </div>
          <div className="grid grid-cols-3 gap-3 bg-black/20 p-4 rounded-xl border border-white/[0.01]">
            {[
              { label: "Navy", bg: "#0a0a14", text: "#ffffff" },
              { label: "White", bg: "#ffffff", text: "#0a0a14" },
              { label: "Gold", bg: "#dcc49b", text: "#0a0a14" },
              { label: "Blue", bg: "#2563eb", text: "#ffffff" },
              { label: "Teal", bg: "#0d9488", text: "#ffffff" },
              { label: "Slate", bg: "#475569", text: "#ffffff" },
            ].map(({ label, bg, text }) => (
              <button key={label} onClick={() => { if (!isPaid) return; update("iconEmailBg", bg); update("iconEmailText", text); }} className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all h-10 duration-200 text-center ${config.iconEmailBg === bg ? "bg-white text-slate-900 border-white font-black shadow-md scale-[1.01]" : "bg-white/5 text-slate-400 border-white/5 hover:text-white"}`}>{label}</button>
            ))}
          </div>
        </div>

        {/* Module 6: Glass Finish Structural Sliders */}
        <div className="space-y-6 bg-[#060c20]/60 rounded-2xl p-6 border border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.7)] mb-4 block w-full">
          <div className="flex items-center justify-between bg-[#040815]/60 p-5 rounded-xl border border-white/[0.03] shadow-inner">
            <span className="section-label flex items-center gap-2 text-[11px] font-black text-slate-300 uppercase tracking-[0.18em]"><span className="text-[#00f0ff] drop-shadow-[0_0_6px_#00f0ff]">◆</span> Static Glass Finish</span>
            <button onClick={() => update("glassEnabled", !config.glassEnabled)} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all duration-300 ${config.glassEnabled ? "bg-[#00f0ff] text-[#050510] font-black shadow-md" : "bg-white/5 text-slate-500"}`}>{config.glassEnabled ? "ON" : "OFF"}</button>
          </div>
          {config.glassEnabled && (
            <div className="space-y-6 pl-4 border-l-2 border-[#00f0ff]/30 bg-black/20 p-5 rounded-r-xl border border-white/[0.01] animate-fade-in">
              <div className="space-y-2">
                <span className="section-label block text-[9px] font-black text-slate-400 uppercase tracking-widest">Glass Panel Tone Finish</span>
                <div className="flex gap-3">
                  {[{ val: "dark", label: "Dark" }, { val: "light", label: "Light" }, { val: "frosted", label: "Frosted" }].map((mode) => (
                    <button key={mode.val} onClick={() => update("glassMode", mode.val)}
                      className={`px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border h-10 flex-1 text-center duration-200 ${config.glassMode === mode.val ? "bg-[#00f0ff] text-[#050510] border-transparent font-black shadow-md" : "bg-white/5 text-slate-400 border-white/5 hover:text-white"}`}
                    >{mode.label}</button>
                  ))}
                </div>
              </div>
              <ColorControl label="Panel Tint" configKey="glassTint" />
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="section-label block text-[10px] font-black text-slate-400 uppercase tracking-widest">Panel Opacity ({config.glassOpacity}%)</span>
                  <span className="text-[10px] font-mono font-bold text-[#00f0ff] bg-[#00f0ff]/5 px-2 rounded-md">{config.glassOpacity}%</span>
                </div>
                <input type="range" min="20" max="95" value={config.glassOpacity} onChange={(e) => update("glassOpacity", parseInt(e.target.value))} className="w-full accent-[#a8c4dc] cursor-pointer h-2" />
              </div>
              <ColorControl label="Border Color" configKey="glassBorderColor" />
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="section-label block text-[10px] font-black text-slate-400 uppercase tracking-widest">Border Strength ({config.glassBorderOpacity}%)</span>
                  <span className="text-[10px] font-mono font-bold text-[#00f0ff] bg-[#00f0ff]/5 px-2 rounded-md">{config.glassBorderOpacity}%</span>
                </div>
                <input type="range" min="0" max="60" value={config.glassBorderOpacity} onChange={(e) => update("glassBorderOpacity", parseInt(e.target.value))} className="w-full accent-[#a8c4dc] cursor-pointer h-2" />
              </div>
            </div>
          )}
        </div>
      </div>
    ),
  };

  const sectionTabs = [
    { key: "core", label: "Core", icon: PenTool, borderClass: "motion-border-gold" },
    { key: "contact", label: "Contact", icon: Phone, borderClass: "motion-border-blue" },
    { key: "branding", label: "Style", icon: Palette, borderClass: "motion-border-purple" },
    { key: "social", label: "Social", icon: Globe, borderClass: "motion-border-teal" },
    { key: "options", label: "Options", icon: Settings, borderClass: "motion-border-green" },
    { key: "effects", label: "Effects", icon: Sparkles, borderClass: "motion-border-violet" },
  ];

  // ============================
  // RENDER
  // ============================
  return (
    <ConfigContext.Provider value={{ config, update, isPaid }}>
      <div className="min-h-screen relative carbon-fiber-bg flex flex-col w-full overflow-y-auto pt-[76px]">
        <CarbonParticles />

        {/* ============ PAGE HEADER ============ */}
        <nav style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 32px',
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(10,10,20,0.9)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/vivid-signature-logo.png"
              alt="Vivid Signature Logo"
              style={{ height: 42, width: 'auto', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.08))' }}
            />
            <span style={{
              fontSize: '18px', fontWeight: 900, letterSpacing: '0.1em',
              fontFamily: "'Rajdhani', sans-serif", textTransform: 'uppercase',
              color: '#f7f7f7',
            }}>
              Vivid Signature
            </span>
          </div>
          {onBackToLanding && (
            <button onClick={onBackToLanding} style={{
              padding: '10px 22px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.3s ease',
            }}>← Home</button>
          )}
        </nav>

        {/* ============ CONTENT AREA ============ */}
        <div className="flex-1 flex flex-col items-center px-4 sm:px-8 lg:px-12 py-8 relative z-10">
          <div className="relative w-full max-w-[1400px] mx-auto flex flex-col border border-white/5 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] bg-[#0a0a14]/60 backdrop-blur-xl overflow-hidden">

            {/* ============ BUILDER ============ */}
            <section
              className="w-full flex-1 flex flex-col p-10 sm:p-12 lg:px-14 lg:py-12"
              id="builder"
            >
              {/* Builder Toolbar */}
              {/* Builder Toolbar — all controls in one centered row */}
              <div className="glass-panel-strong px-4 py-3 mb-6 flex items-center justify-center gap-2 flex-wrap animate-fade-in ring-1 ring-[#00f0ff]/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl">
                {/* Layout format icons */}
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                  {EMAIL_SAFE_LAYOUTS.map((l) => (
                    <button key={l.key} onClick={() => setLayout(l.key)} title={l.label}
                      className={`p-1.5 rounded-lg transition-all ${activeLayout === l.key ? "bg-[#00f0ff] text-[#050510] shadow-md" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                      <l.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                <div className="w-px h-6 bg-white/10 flex-shrink-0" />

                {/* Builder Unlocked / Preview Mode */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00f0ff]/5 rounded-xl border border-[#00f0ff]/15">
                  <div className="p-1.5 bg-[#00f0ff]/10 rounded-lg border border-[#00f0ff]/20">
                    {isPaid ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-widest">
                      {isPaid ? "Builder Unlocked" : "Preview Mode"}
                    </span>
                    <p className="text-[9px] text-slate-500">
                      {isPaid ? "Full editing enabled" : "Choose a plan to edit"}
                    </p>
                  </div>
                </div>

                <div className="w-px h-6 bg-white/10 flex-shrink-0" />

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button onClick={() => setPreviewZoom(Math.max(50, previewZoom - 10))}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all" title="Zoom Out">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono w-9 text-center font-bold">{previewZoom}%</span>
                  <button onClick={() => setPreviewZoom(Math.min(150, previewZoom + 10))}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all" title="Zoom In">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-white/10 flex-shrink-0" />

                {/* Device Selector */}
                <div className="flex items-center gap-0.5 bg-white/5 rounded-xl p-1 border border-white/10">
                  {[
                    { key: 'desktop', icon: Monitor, label: 'Desktop' },
                    { key: 'tablet', icon: Tablet, label: 'Tablet' },
                    { key: 'mobile', icon: Smartphone, label: 'Mobile' },
                  ].map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setPreviewDevice(key)} title={label}
                      className={`p-1.5 rounded-lg transition-colors ${previewDevice === key ? 'bg-[#00f0ff] text-[#050510]' : 'text-slate-500 hover:text-white'}`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                {/* Preview Toggle */}
                <button onClick={() => setShowPreview(!showPreview)}
                  className={`p-2 rounded-lg transition-all border border-white/10 ${showPreview ? "bg-[#00f0ff]/10 text-[#00f0ff]" : "bg-white/5 text-slate-500 hover:text-white"}`}
                  title="Toggle Preview">
                  {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Preview BG Toggle */}
                <button onClick={() => setPreviewBg(previewBg === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-lg transition-all border border-white/10 ${previewBg === "light" ? "bg-white/10 text-yellow-300" : "bg-[#050510]/80 text-[#00f0ff]"}`}
                  title="Toggle Preview Background">
                  {previewBg === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              {/* Builder Grid */}

              <div className={`w-full min-h-[720px] grid gap-10 transition-all duration-300 ${showPreview ? "grid-cols-1 xl:grid-cols-[4.5fr_7.5fr]" : "grid-cols-1"}`}>

                {/* ============ 🛠️ LEFT SIDEBAR: PURE GLASS INPUT STUDIO ============ */}
                <div className="relative rounded-3xl flex flex-col shadow-[0_45px_100px_rgba(0,0,0,0.95)] border border-white/[0.05] bg-[#040814]/40 backdrop-blur-3xl overflow-hidden p-8 lg:p-9">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent"></div>

                  {/* 💎 Navigation Tabs Header */}
                  <div className="overflow-x-auto custom-scrollbar flex-shrink-0 mb-8 border-b border-white/[0.06] pb-5">
                    <div className="flex gap-3 px-1 min-w-max items-center">
                      {sectionTabs.map((t) => {
                        const isActive = activeSection === t.key;
                        return (
                          <button
                            key={t.key}
                            onClick={() => setActiveSection(t.key)}
                            className={`flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] whitespace-nowrap transition-all duration-200 min-h-[40px] relative ${isActive
                              ? "text-[#00f0ff] font-black scale-[1.02]"
                              : "text-slate-400 hover:text-white"
                              }`}
                          >
                            {isActive && (
                              <div className="absolute inset-0 bg-[#00f0ff]/5 rounded-xl border border-[#00f0ff]/20 shadow-[inset_0_1px_10px_rgba(0,240,255,0.15)]" />
                            )}
                            <t.icon className={`w-3.5 h-3.5 flex-shrink-0 relative z-10 ${isActive ? 'text-[#00f0ff]' : 'text-slate-500'}`} />
                            <span className="relative z-10 pt-[1px] font-mono">{t.label}</span>
                            {isActive && (
                              <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_10px_#00f0ff] rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 💎 Inner Content Viewport (Gaps upscaled to prevent any layout choking) */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
                    {/* 🎯 FIXED: Inner wrapper spacing increased to space-y-9 to drop any tightness */}
                    <div className="space-y-9 w-full block">
                      {editorSections[activeSection]}
                    </div>
                  </div>
                </div>

                {/* ============ 👁️ RIGHT SIDEBAR: EXPERT MONITOR PREVIEW STAGE ============ */}
                {showPreview && (
                  <div className="flex flex-col gap-8 h-full justify-between animate-fade-in">

                    {/* Mockup Monitor Frame — Deep Inner Shadows Packed */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/[0.07] shadow-[0_40px_90px_rgba(0,0,0,0.95)] bg-[#070b19]/80 backdrop-blur-3xl flex-1 flex flex-col">

                      {/* Monitor Top Header */}
                      <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.04] bg-black/40 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-600/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-600/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-600/20" />
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono tracking-[0.25em] uppercase font-black">
                          INTERACTIVE ENGINE — DESKTOP {previewWidth}PX
                        </span>
                        <div className="w-16" />
                      </div>

                      {/* 👑 THE MASTERSTAGE PREVIEW CONTAINER (Exactly Inside & Dhasna look) */}
                      <div className="flex-1 flex items-center justify-center p-12 bg-[#030611] relative">
                        {/* Deep Inset Shadow Overlay to drop the signature deep inside the viewport */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_6px_45px_rgba(0,0,0,0.95)] z-10 border border-black/40 rounded-b-3xl"></div>

                        <div style={{
                          width: "100%",
                          maxWidth: "560px",
                          margin: "0 auto",
                          overflowX: "hidden",
                          background: previewBg === "light" ? "#e2e8f0" : "#05050c",
                          padding: "24px",
                          borderRadius: "16px",
                          boxShadow: "0 35px 75px rgba(0,0,0,0.95), inset 0 1px 1px rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.02)",
                          position: "relative",
                          zIndex: "20"
                        }}>
                          <SigPreview
                            html={generateHTML()}
                            sigW={previewWidth}
                            innerBg={previewBg === "light" ? "#ffffff" : "#0a0a14"}
                            zoom={previewZoom}
                          />
                        </div>
                      </div>

                      {/* Monitor Footer Status Bar */}
                      <div className="px-6 py-3 border-t border-white/[0.03] bg-black/40 flex justify-end flex-shrink-0">
                        <span className="text-[8px] font-mono tracking-widest text-[#00f0ff]/60 uppercase font-bold">AEGIS Vault Status: <span className="text-emerald-400">Secure</span></span>
                      </div>
                    </div>

                    {/* 💎 SPACIOUS ACTION BUTTON ROW WITH HIGH-END TINTS */}
                    <div className="flex flex-wrap gap-4 py-5 px-6 justify-center bg-[#040814]/60 rounded-2xl border border-white/[0.04] shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
                      <button
                        onClick={async () => {
                          if (!currentUser) {
                            if (window.confirm("Enterprise Feature: Please log in or purchase a plan to save your signature.\n\nWould you like to log in now?")) {
                              if (onRequestLogin) onRequestLogin();
                            }
                            return;
                          }
                          setSaving(true);
                          try {
                            await saveSignature(currentUser.uid, config);
                            alert("Signature saved securely to your AEGIS Vault!");
                          } catch (err) {
                            alert("Error saving signature: " + err.message);
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving}
                        className={`btn-gold !py-3.5 !px-6 !text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 shadow-lg border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] ${saving ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.03] active:scale-[0.97]"}`}
                      >
                        <Shield className="w-3.5 h-3.5 mr-1.5 inline-block text-[#00f0ff]" />
                        {saving ? "Saving..." : "Save to Vault"}
                      </button>

                      <button
                        onClick={handleCopy}
                        className={`btn-gold !py-3.5 !px-6 !text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 shadow-lg ${copied ? "!bg-[#10b981] !border-[#10b981] !text-white" : "hover:scale-[1.03] active:scale-[0.97]"}`}
                      >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 inline-block" /> : <Copy className="w-3.5 h-3.5 mr-1.5 inline-block" />}
                        {copied ? "Copied!" : "Copy HTML"}
                      </button>

                      <button onClick={() => handleAutoInject("gmail")} className="btn-gold !py-3.5 !px-5 !text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]">
                        <Send className="w-3.5 h-3.5 mr-1.5 inline-block" /> Gmail
                      </button>

                      <button onClick={() => handleAutoInject("outlook")} className="btn-gold !py-3.5 !px-5 !text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]">
                        <Send className="w-3.5 h-3.5 mr-1.5 inline-block" /> Outlook
                      </button>

                      <button onClick={() => handleAutoInject("apple")} className="btn-gold !py-3.5 !px-5 !text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]">
                        <Send className="w-3.5 h-3.5 mr-1.5 inline-block" /> Apple Mail
                      </button>

                      <button
                        onClick={() => {
                          const html = generateHTML();
                          navigator.clipboard.writeText(html);
                          const subject = encodeURIComponent("Testing My Vivid Signature");
                          const body = encodeURIComponent("This is a test email with my new Vivid Signature email signature.\n\nPlease view this email to see the signature below.\n\n---\n[Signature copied to clipboard — paste it in your email client]");
                          window.open(`mailto:${config.email}?subject=${subject}&body=${body}`, "_blank");
                        }}
                        className="btn-gold !py-3.5 !px-5 !text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5 inline-block" /> Send Test
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Gold Divider */}
          <div
            className="w-full mt-8 mb-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />

        </div>
      </div>

      {/* ============ FOOTER — outside content panel, inside page wrapper ============ */}
      {/* ============ FOOTER — Outside content panel, cleanly removed trademarks ============ */}
      <footer style={{ width: "100%", textAlign: "center", padding: "24px 20px", borderTop: "1px solid rgba(220,196,155,0.12)", background: "rgba(5,5,16,0.9)", backdropFilter: "blur(12px)", marginTop: "auto" }}>
        <div style={{ marginBottom: "6px" }}>
          {/* 👑 Task 3: Vivid Signature se trademark symbol completely saaf */}
          <span style={{ color: "#dcc49b", fontWeight: 700, fontFamily: "'Orbitron','Inter',sans-serif", fontSize: "12px", letterSpacing: "0.08em" }}>Vivid Signature</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}> | A </span>
          {/* 👑 Task 3: ForgedOps.AI se trademark symbol completely saaf */}
          <a href="https://forgedops.ai" target="_blank" rel="noreferrer" style={{ color: "#dcc49b", textDecoration: "none", fontWeight: 700, fontFamily: "'Orbitron','Inter',sans-serif", fontSize: "12px" }}>ForgedOps.AI</a>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}> Product</span>
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>&copy; {new Date().getFullYear()} Waterman Consulting Services. All Rights Reserved.</div>
        <div style={{ marginTop: "8px", fontSize: "11px" }}>
          <a href="/privacy.html" style={{ color: "rgba(220,196,155,0.5)", textDecoration: "none", marginRight: "12px" }}>Privacy</a>
          <a href="/terms.html" style={{ color: "rgba(220,196,155,0.5)", textDecoration: "none", marginRight: "12px" }}>Terms</a>
          <a href="/support.html" style={{ color: "rgba(220,196,155,0.5)", textDecoration: "none" }}>Support</a>
        </div>
      </footer>

      {/* ============ POWERED BY SUB-FOOTER ============ */}
      <div style={{ width: "100%", textAlign: "center", padding: "14px 20px", background: "rgba(5,5,16,0.95)", borderTop: "1px solid rgba(220,196,155,0.15)" }}>
        {/* 👑 Task 3: In-app absolute lower block se bhi trademark safely saaf */}
        <a href="https://forgedops.ai" target="_blank" rel="noreferrer" style={{ color: "#dcc49b", fontSize: "12px", fontFamily: "'Orbitron','Inter',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>Powered by ForgedOps.AI</a>
        <div style={{ marginTop: "6px", fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "'Cinzel','Inter',serif", letterSpacing: "0.15em", fontStyle: "italic" }}>Built on the Rock. Engineered for the Future. Forward Always.</div>
      </div>
      {installModal && <InstallModal />}
    </ConfigContext.Provider>
  );
}
