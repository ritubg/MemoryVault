import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock, Image as ImageIcon, Music, Film, Key, ScrollText, Sparkles, AlertCircle } from "lucide-react";
import Navbar from "./Navbar";
import logger from "../services/logger";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IM+Fell+English:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .view-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-color);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .view-content {
    flex: 1;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 24px 60px;
    position: relative;
  }

  .bg-blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.35; pointer-events: none; }
  .blob1 { width: 480px; height: 480px; background: #e8daf0; top: -60px; left: -100px; }
  .blob2 { width: 360px; height: 360px; background: #fcdce1; bottom: 60px; right: -80px; }
  .blob3 { width: 260px; height: 260px; background: #c8ceee; top: 40%; left: 60%; }

  .page-header {
    max-width: 900px;
    margin: 0 auto 36px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    animation: fadeDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 300;
    color: #000000;
    line-height: 1;
  }
  .page-subtitle { font-size: 13px; color: #b0a0cc; margin-top: 5px; font-weight: 300; }

  .add-btn {
    background: linear-gradient(135deg, #a7abde, #a7abde);
    border: none;
    border-radius: 14px;
    padding: 12px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    color: #000000;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: all 0.22s;
    box-shadow: 0 4px 18px rgba(167,171,222,0.3);
  }
  .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(167,171,222,0.45); }

  .grid {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    position: relative;
    z-index: 2;
  }

  .capsule-card {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px);
    border: 1.5px solid rgba(216,190,229,0.3);
    border-radius: 22px;
    padding: 28px 26px 24px;
    cursor: pointer;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
    box-shadow: 0 4px 24px rgba(167,171,222,0.1);
  }

  .capsule-card:nth-child(1) { animation-delay: 0.05s; }
  .capsule-card:nth-child(2) { animation-delay: 0.1s; }
  .capsule-card:nth-child(3) { animation-delay: 0.15s; }
  .capsule-card:nth-child(4) { animation-delay: 0.2s; }
  .capsule-card:nth-child(5) { animation-delay: 0.25s; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .capsule-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #d8bee5, #fcdce1, #c8ceee);
    border-radius: 22px 22px 0 0;
    opacity: 0;
    transition: opacity 0.22s;
  }

  .capsule-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(167,171,222,0.2); border-color: rgba(216,190,229,0.5); }
  .capsule-card:hover::before { opacity: 1; }

  .card-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 14px;
  }

  .badge-locked { background: rgba(252,220,225,0.4); color: #000000; border: 1px solid rgba(252,220,225,0.6); }
  .badge-open { background: rgba(200,206,238,0.4); color: #000000; border: 1px solid rgba(200,206,238,0.5); }

  .card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: #000000;
    margin-bottom: 14px;
    line-height: 1.2;
  }

  .card-meta { display: flex; flex-direction: column; gap: 7px; }
  .meta-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #a799c4; }
  .meta-icon { font-size: 13px; }

  .card-footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(216,190,229,0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .open-hint { font-size: 11.5px; color: #000000; font-style: italic; }
  .card-arrow { color: #000000; font-size: 18px; transition: transform 0.2s; }
  .capsule-card:hover .card-arrow { transform: translateX(4px); }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    position: relative;
    z-index: 2;
  }
  .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    color: #4a3f6b;
    margin-bottom: 8px;
  }
  .empty-sub { font-size: 13px; color: #b0a0cc; }

  /* ─── Modal ──────────────────────────────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(74,63,107,0.18);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(216,190,229,0.4);
    border-radius: 28px;
    width: 640px;
    max-width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 80px rgba(74,63,107,0.18);
    animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.92) translateY(16px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-header {
    background: linear-gradient(135deg, rgba(216,190,229,0.3), rgba(200,206,238,0.2));
    border-bottom: 1px solid rgba(216,190,229,0.2);
    padding: 28px 32px 22px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 400;
    color: #4a3f6b;
  }

  .modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid rgba(216,190,229,0.5);
    background: rgba(255,255,255,0.7);
    cursor: pointer;
    font-size: 16px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .modal-close:hover { background: #fcdce1; border-color: #fcdce1; color: #8b5f72; }

  .modal-body { padding: 28px 32px 32px; }

  .info-row {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .info-chip {
    background: rgba(248,244,252,0.9);
    border: 1px solid rgba(216,190,229,0.3);
    border-radius: 10px;
    padding: 10px 16px;
    flex: 1;
    text-align: center;
  }
  .chip-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #000000; margin-bottom: 4px; }
  .chip-value { font-size: 13px; color: #000000; font-weight: 500; }

  /* Section label inside modal */
  .modal-section-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #b0a0cc;
    font-weight: 500;
    margin-bottom: 12px;
    margin-top: 22px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(216,190,229,0.2);
  }
  .modal-section-label:first-of-type { margin-top: 0; }

  .content-block { margin-bottom: 20px; }
  .content-label {
    font-size: 10.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #000000;
    margin-bottom: 8px;
  }
  .content-text {
    background: rgba(248,244,252,0.7);
    border: 1px solid rgba(216,190,229,0.2);
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 13.5px;
    color: #6a5a8a;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  /* ─── Media Gallery ────────────────────────────────────────────── */
  .media-gallery-section { margin-bottom: 20px; }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
    margin-bottom: 6px;
  }
  .photo-grid img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 12px;
    border: 1.5px solid rgba(216,190,229,0.3);
    transition: transform 0.2s;
    cursor: zoom-in;
  }
  .photo-grid img:hover { transform: scale(1.03); }

  .audio-player-wrap {
    margin-bottom: 10px;
    background: rgba(200,206,238,0.1);
    border: 1px solid rgba(200,206,238,0.3);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .audio-player-wrap span { font-size: 12.5px; color: #6a7aad; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .audio-player-wrap audio { flex: 2; height: 32px; }

  .video-player-wrap {
    margin-bottom: 10px;
    border-radius: 14px;
    overflow: hidden;
    border: 1.5px solid rgba(216,190,229,0.3);
  }
  .video-player-wrap video {
    width: 100%;
    display: block;
    max-height: 280px;
    background: #000;
  }

  /* ─── Lightbox ─────────────────────────────────────────────────── */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.88);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    animation: fadeIn 0.18s ease;
  }
  .lightbox-overlay img {
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  }
  .lightbox-close {
    position: fixed;
    top: 22px;
    right: 26px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.3);
    color: #fff;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .lightbox-close:hover { background: rgba(255,255,255,0.3); }

  /* ─── Vintage Scroll Letter ──────────────────────────────────── */
  .scroll-section { margin-top: 6px; margin-bottom: 20px; }

  .scroll-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s;
    padding: 20px;
    border-radius: 16px;
    border: 1.5px dashed rgba(180,140,90,0.35);
    background: rgba(245,230,200,0.12);
    position: relative;
    overflow: hidden;
  }
  .scroll-trigger::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(245,230,200,0.25) 0%, transparent 70%);
    pointer-events: none;
  }
  .scroll-trigger:hover { transform: translateY(-2px); background: rgba(245,230,200,0.22); border-color: rgba(180,140,90,0.55); }

  .scroll-icon-wrap {
    position: relative;
    width: 72px;
    height: 72px;
  }
  .scroll-icon-svg {
    width: 72px;
    height: 72px;
    filter: drop-shadow(0 4px 12px rgba(139,100,50,0.3));
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .scroll-trigger:hover .scroll-icon-svg { transform: scale(1.08) rotate(-2deg); }

  .wax-seal {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 28px;
    height: 28px;
    background: radial-gradient(circle at 35% 35%, #d4544a, #8b2020);
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    box-shadow: 0 2px 8px rgba(139,32,32,0.4);
    color: rgba(255,255,255,0.9);
  }

  .scroll-hint {
    font-size: 13px;
    color: #8b6a3a;
    letter-spacing: 0.03em;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
  }
  .scroll-hint-sub {
    font-size: 11px;
    color: #b0a0cc;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* The unrolling animation container */
  .scroll-letter-container {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transform-origin: top center;
    transform: scaleY(0.85);
    transition:
      max-height 0.7s cubic-bezier(0.22,1,0.36,1),
      opacity 0.5s ease 0.1s,
      transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .scroll-letter-container.open {
    max-height: 1200px;
    opacity: 1;
    transform: scaleY(1);
  }

  /* Parchment paper */
  .parchment {
    margin-top: 16px;
    background:
      linear-gradient(180deg,
        rgba(205,170,105,0.18) 0%,
        rgba(245,230,200,0.92) 4%,
        rgba(245,230,200,0.92) 96%,
        rgba(180,140,75,0.22) 100%
      ),
      repeating-linear-gradient(
        180deg,
        transparent,
        transparent 26px,
        rgba(180,140,75,0.06) 27px
      );
    border: 1.5px solid rgba(180,140,75,0.45);
    border-radius: 4px 4px 8px 8px;
    padding: 32px 36px 36px;
    position: relative;
    box-shadow:
      0 4px 24px rgba(139,100,50,0.15),
      inset 0 0 40px rgba(180,140,75,0.06);
  }

  /* Rolled top edge */
  .parchment::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 8px;
    right: 8px;
    height: 16px;
    background: linear-gradient(180deg, rgba(205,170,105,0.6) 0%, rgba(225,195,135,0.9) 50%, rgba(205,170,105,0.5) 100%);
    border-radius: 4px 4px 0 0;
    border: 1px solid rgba(180,140,75,0.4);
    box-shadow: 0 -2px 8px rgba(139,100,50,0.2);
  }
  /* Rolled bottom edge */
  .parchment::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 8px;
    right: 8px;
    height: 16px;
    background: linear-gradient(0deg, rgba(205,170,105,0.6) 0%, rgba(225,195,135,0.9) 50%, rgba(205,170,105,0.5) 100%);
    border-radius: 0 0 4px 4px;
    border: 1px solid rgba(180,140,75,0.4);
    box-shadow: 0 2px 8px rgba(139,100,50,0.2);
  }

  .parchment-heading {
    font-family: 'IM Fell English', 'Cormorant Garamond', serif;
    font-size: 15px;
    font-style: italic;
    color: rgba(100,70,30,0.6);
    text-align: center;
    letter-spacing: 0.08em;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(180,140,75,0.25);
  }

  .parchment-text {
    font-family: 'IM Fell English', 'Cormorant Garamond', serif;
    font-size: 16px;
    line-height: 2.0;
    color: #3a2808;
    white-space: pre-wrap;
    position: relative;
    z-index: 1;
    letter-spacing: 0.01em;
  }

  .parchment-footer {
    margin-top: 24px;
    text-align: right;
    font-family: 'IM Fell English', 'Cormorant Garamond', serif;
    font-size: 14px;
    font-style: italic;
    color: rgba(100,70,30,0.55);
    border-top: 1px solid rgba(180,140,75,0.2);
    padding-top: 12px;
  }

  /* Collapse button */
  .scroll-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    font-size: 12px;
    color: #b0a0cc;
    cursor: pointer;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
    padding: 8px;
    width: 100%;
  }
  .scroll-collapse-btn:hover { color: #8b7aad; }

  /* ─── Locked state ──────────────────────────────────────────── */
  .locked-state {
    text-align: center;
    padding: 32px 20px;
    background: rgba(252,220,225,0.15);
    border-radius: 16px;
    border: 1px solid rgba(252,220,225,0.4);
    margin-top: 8px;
  }
  .locked-icon { font-size: 36px; margin-bottom: 10px; }
  .locked-msg { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #c48a9e; margin-bottom: 6px; }
  .locked-sub { font-size: 12.5px; color: #d4a8b8; }

  @media (max-width: 480px) {
    .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    .grid { grid-template-columns: 1fr; }
    .modal-header, .modal-body { padding: 20px; }
    .info-row { flex-direction: column; }
    .parchment { padding: 24px 20px 28px; }
  }
`;

// ── Scroll SVG icon ─────────────────────────────────────────────
function ScrollIcon() {
  return (
    <svg className="scroll-icon-svg" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main scroll body */}
      <rect x="10" y="14" width="60" height="52" rx="4" fill="url(#parchmentGrad)" stroke="#b89050" strokeWidth="1.5" />
      {/* Top rolled edge */}
      <rect x="8" y="10" width="64" height="12" rx="6" fill="url(#rollGrad)" stroke="#b89050" strokeWidth="1.2" />
      {/* Bottom rolled edge */}
      <rect x="8" y="58" width="64" height="12" rx="6" fill="url(#rollGrad)" stroke="#b89050" strokeWidth="1.2" />
      {/* Lines representing text */}
      <line x1="20" y1="32" x2="60" y2="32" stroke="#b89050" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="20" y1="40" x2="60" y2="40" stroke="#b89050" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="20" y1="48" x2="50" y2="48" stroke="#b89050" strokeWidth="1" strokeOpacity="0.5" />
      <defs>
        <linearGradient id="parchmentGrad" x1="10" y1="14" x2="70" y2="66" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#e8d0a0" />
        </linearGradient>
        <linearGradient id="rollGrad" x1="8" y1="10" x2="72" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d4a855" />
          <stop offset="50%" stopColor="#f0cc80" />
          <stop offset="100%" stopColor="#c49040" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ViewCapsules() {
  const navigate = useNavigate();
  const [capsules, setCapsules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [capsuleData, setCapsuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("mv_user") || "{}");
    if (user.email) {
      logger.info('ViewCapsules', 'Loading capsules', { email: user.email });
      fetch(`http://localhost:5001/capsules/${user.email}`)
        .then(res => res.json())
        .then(data => {
          logger.info('ViewCapsules', 'Capsules loaded', { count: data.length });
          setCapsules(data); setLoading(false);
        })
        .catch((err) => {
          logger.error('ViewCapsules', 'Failed to load capsules', err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const openCapsule = async (capsule) => {
    setSelected(capsule);
    setScrollOpen(false);
    const user = JSON.parse(localStorage.getItem("mv_user") || "{}");
    logger.info('ViewCapsules', 'Attempting to open capsule', { name: capsule.name, openDate: capsule.open_date });
    if (today >= capsule.open_date) {
      const res = await fetch("http://localhost:5001/open_capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: capsule.name, email: user.email })
      });
      const data = await res.json();
      if (data.status === "open") {
        logger.info('ViewCapsules', 'Capsule opened', { name: capsule.name });
        setCapsuleData(data.capsule);
      } else {
        logger.info('ViewCapsules', 'Capsule is locked', { name: capsule.name });
        setCapsuleData(null);
      }
    } else {
      logger.info('ViewCapsules', 'Capsule still locked (client-side check)', { name: capsule.name, openDate: capsule.open_date });
      setCapsuleData(null);
    }
  };

  const closeModal = () => { setSelected(null); setCapsuleData(null); setScrollOpen(false); };

  const isUnlocked = (c) => today >= c.open_date;

  const formatDate = (d) => {
    if (!d) return "—";
    const [y, m, day] = d.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(m) - 1]} ${parseInt(day)}, ${y}`;
  };

  const daysUntil = (d) => {
    const diff = Math.ceil((new Date(d) - new Date(today)) / 86400000);
    return diff > 0 ? `Opens in ${diff} day${diff === 1 ? "" : "s"}` : "Ready to open";
  };

  // ── Render media gallery ─────────────────────────────────────
  const renderMedia = (media) => {
    if (!media) return null;
    const hasImages = media.images?.length > 0;
    const hasAudio = media.audio?.length > 0;
    const hasVideo = media.video?.length > 0;
    if (!hasImages && !hasAudio && !hasVideo) return null;

    return (
      <div className="media-gallery-section">
        <div className="modal-section-label">Media</div>

        {hasImages && (
          <div className="photo-grid">
            {media.images.map((img, i) => (
              <img
                key={i}
                src={img.data || img}
                alt={img.name || `Photo ${i + 1}`}
                onClick={() => setLightboxSrc(img.data || img)}
              />
            ))}
          </div>
        )}

        {hasAudio && media.audio.map((a, i) => (
          <div className="audio-player-wrap" key={i}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Music size={14} /> {a.name || `Audio ${i + 1}`}</span>
            <audio controls src={a.data || a} />
          </div>
        ))}

        {hasVideo && media.video.map((v, i) => (
          <div className="video-player-wrap" key={i}>
            <video controls src={v.data || v} />
          </div>
        ))}
      </div>
    );
  };

  // ── Render vintage scroll letter ─────────────────────────────
  const renderScrollLetter = (letter, dateCreated) => {
    if (!letter) return null;
    return (
      <div className="scroll-section">
        <div className="modal-section-label">Letter to Future Self</div>

        {/* Click trigger when closed */}
        {!scrollOpen && (
          <div className="scroll-trigger" onClick={() => setScrollOpen(true)}>
            <div className="scroll-icon-wrap">
              <ScrollIcon />
              <div className="wax-seal"><Sparkles size={12} /></div>
            </div>
            <div className="scroll-hint">A letter awaits you…</div>
            <div className="scroll-hint-sub">Click the scroll to unseal it</div>
          </div>
        )}

        {/* Animated letter reveal */}
        <div className={`scroll-letter-container ${scrollOpen ? "open" : ""}`}>
          <div className="parchment">
            <div className="parchment-heading">~ A Letter to My Future Self ~</div>
            <div className="parchment-text">{letter}</div>
            <div className="parchment-footer">
              Written on {formatDate(dateCreated)}
            </div>
          </div>
          <button className="scroll-collapse-btn" onClick={() => setScrollOpen(false)}>
            ↑ Roll up the scroll
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <img src={lightboxSrc} alt="Full size" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="view-root">
        <Navbar />
        <div className="view-content">
          <div className="bg-blob blob1" />
          <div className="bg-blob blob2" />
          <div className="bg-blob blob3" />

          <div className="page-header">
            <div>
              <h1 className="page-title">My Capsules</h1>
              <p className="page-subtitle">{capsules.length} sealed {capsules.length === 1 ? "memory" : "memories"} waiting</p>
            </div>
            <button className="add-btn" onClick={() => navigate("/add-capsule")} style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={16} /> New Capsule</button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: "#c4b8d8", position: "relative", zIndex: 2 }}>Loading…</div>
          ) : capsules.length === 0 ? (
            <div className="empty-state">
              {/* <div className="empty-icon"><Sparkles size={48} color="#c8ceee" /></div> */}
              <div className="empty-title">No capsules yet</div>
              <p className="empty-sub">Create your first one to seal a memory in time</p>
            </div>
          ) : (
            <div className="grid">
              {capsules.map((c, i) => (
                <div className="capsule-card" key={i} onClick={() => openCapsule(c)}>
                  <div className={`card-badge ${isUnlocked(c) ? "badge-open" : "badge-locked"}`}>
                    {isUnlocked(c) ? <><Unlock size={12} /> Unlocked</> : <><Lock size={12} /> Sealed</>}
                  </div>
                  <div className="card-name">{c.name}</div>
                  <div className="card-meta">
                    <div className="meta-row"><span className="meta-icon"></span> Created {formatDate(c.date_created)}</div>
                    <div className="meta-row"><span className="meta-icon"><Key size={13} /></span> Opens {formatDate(c.open_date)}</div>
                    {(c.media?.images?.length > 0 || c.media?.audio?.length > 0 || c.media?.video?.length > 0) && (
                      <div className="meta-row" style={{ marginTop: 4 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {c.media?.images?.length > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><ImageIcon size={13} /> {c.media.images.length}</span>}
                          {c.media?.audio?.length > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Music size={13} /> {c.media.audio.length}</span>}
                          {c.media?.video?.length > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Film size={13} /> {c.media.video.length}</span>}
                        </span>
                      </div>
                    )}
                    {c.letter && (
                      <div className="meta-row" style={{ marginTop: 2 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><ScrollText size={13} /> Letter included</span>
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <span className="open-hint">{daysUntil(c.open_date)}</span>
                    <span className="card-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Capsule Modal ── */}
          {selected && (
            <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
              <div className="modal">
                <div className="modal-header">
                  <div>
                    <div className="modal-title">{selected.name}</div>
                    <div style={{ marginTop: 6 }}>
                      <span className={`card-badge ${isUnlocked(selected) ? "badge-open" : "badge-locked"}`} style={{ marginBottom: 0 }}>
                        {isUnlocked(selected) ? <><Unlock size={12} /> Unlocked</> : <><Lock size={12} /> Sealed</>}
                      </span>
                    </div>
                  </div>
                  <button className="modal-close" onClick={closeModal}>✕</button>
                </div>

                <div className="modal-body">
                  {/* Date chips */}
                  <div className="info-row">
                    <div className="info-chip">
                      <div className="chip-label">Created</div>
                      <div className="chip-value">{formatDate(selected.date_created)}</div>
                    </div>
                    <div className="info-chip">
                      <div className="chip-label">Opens On</div>
                      <div className="chip-value">{formatDate(selected.open_date)}</div>
                    </div>
                  </div>

                  {isUnlocked(selected) && capsuleData ? (
                    <>
                      {/* Notes */}
                      {capsuleData.notes && (
                        <div className="content-block">
                          <div className="modal-section-label">Notes</div>
                          <div className="content-text">{capsuleData.notes}</div>
                        </div>
                      )}

                      {/* Media */}
                      {renderMedia(capsuleData.media)}

                      {/* Scroll letter */}
                      {capsuleData.letter && renderScrollLetter(capsuleData.letter, capsuleData.date_created)}

                      {/* Empty state if nothing */}
                      {!capsuleData.notes && !capsuleData.letter &&
                        (!capsuleData.media?.images?.length && !capsuleData.media?.audio?.length && !capsuleData.media?.video?.length) && (
                          <div style={{ textAlign: "center", color: "#c4b8d8", fontSize: 13, padding: "20px 0" }}>
                            No content in this capsule.
                          </div>
                        )}
                    </>
                  ) : (
                    <div className="locked-state">
                      <div className="locked-icon" style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><Lock size={36} color="#c48a9e" /></div>
                      <div className="locked-msg">This capsule is sealed</div>
                      <div className="locked-sub">It will unlock on {formatDate(selected.open_date)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewCapsules;