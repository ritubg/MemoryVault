import React, { useState, useRef } from 'react';
import Navbar from './Navbar';
import { useEffect } from "react";
import logger from "../services/logger";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .prof-root {
    min-height: 100vh;
    background: #f8f4fb;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .prof-blob { position: fixed; border-radius: 50%; filter: blur(110px); opacity: 0.28; pointer-events: none; z-index: 0; }
  .prof-blob1 { width: 560px; height: 560px; background: #e8daf0; top: -120px; left: -140px; }
  .prof-blob2 { width: 380px; height: 380px; background: #fcdce1; bottom: -60px; right: -80px; }
  .prof-blob3 { width: 280px; height: 280px; background: #c8ceee; top: 45%; left: 58%; }

  .prof-main {
    max-width: 760px;
    margin: 0 auto;
    padding: 52px 24px 80px;
    position: relative;
    z-index: 1;
  }

  .prof-heading {
    margin-bottom: 36px;
    animation: fadeDown 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }

  .prof-eyebrow {
    font-size: 10.5px; letter-spacing: 0.22em;
    text-transform: uppercase; color: #000000; margin-bottom: 7px;
  }
  .prof-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #000000;
  }
  .prof-title em { font-style: italic; color: #000000; }

  /* ── Hero card ─────────────────────────────────────────────── */
  .prof-hero {
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(216,190,229,0.28);
    border-radius: 26px;
    padding: 32px 36px;
    display: flex; align-items: center; gap: 28px;
    margin-bottom: 16px;
    box-shadow: 0 6px 40px rgba(167,171,222,0.12);
    position: relative; overflow: hidden;
    animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both;
  }

  .prof-hero::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #d8bee5, #fcdce1, #c8ceee);
    border-radius: 26px 26px 0 0;
  }

  @keyframes cardIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

  /* ── Avatar with hover overlay ─────────────────────────────── */
  .avatar-wrap {
    position: relative; flex-shrink: 0;
    width: 84px; height: 84px;
    cursor: pointer;
  }

  .avatar-ring {
    width: 84px; height: 84px;
    border-radius: 50%; padding: 3px;
    background: linear-gradient(135deg, #d8bee5, #a7abde, #fcdce1);
    box-shadow: 0 6px 22px rgba(167,171,222,0.32);
    transition: box-shadow 0.25s;
  }
  .avatar-wrap:hover .avatar-ring {
    box-shadow: 0 8px 28px rgba(167,171,222,0.5);
  }

  .avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: #efe9f7;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .avatar-inner img {
    width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
  }
  .avatar-initials {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 300; color: #000000;
    letter-spacing: 0.02em;
    user-select: none;
  }

  /* Camera overlay appears on hover */
  .avatar-overlay {
    position: absolute; inset: 0;
    border-radius: 50%;
    background: rgba(74,63,107,0.55);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    opacity: 0;
    transition: opacity 0.22s;
    pointer-events: none;
  }
  .avatar-wrap:hover .avatar-overlay { opacity: 1; }

  .overlay-icon {
    width: 22px; height: 22px;
    color: #000000;
  }
  .overlay-label {
    font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(0, 0, 0, 0.9); font-weight: 500;
    line-height: 1;
  }

  /* Change photo pill that appears below avatar when photo exists */
  .avatar-change-hint {
    position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg, #d8bee5, #a7abde);
    color: #000000; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 20px;
    white-space: nowrap;
    box-shadow: 0 2px 10px rgba(167,171,222,0.4);
    pointer-events: none;
    opacity: 0; transition: opacity 0.22s;
  }
  .avatar-wrap:hover .avatar-change-hint { opacity: 1; }

  .hero-text { flex: 1; min-width: 0; }
  .hero-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 400; color: #000000;
    margin-bottom: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .hero-email {
    font-size: 13.5px; color: #000000; font-weight: 300;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 12px;
  }

  .photo-action-row { display: flex; gap: 8px; flex-wrap: wrap; }

  .photo-btn {
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400;
    padding: 6px 14px; border-radius: 20px; cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.02em;
  }
  .photo-btn-upload {
    background: rgba(216,190,229,0.25);
    border: 1.5px solid rgba(216,190,229,0.5);
    color: #000000;
  }
  .photo-btn-upload:hover {
    background: rgba(216,190,229,0.45); color: #000000;
  }
  .photo-btn-remove {
    background: rgba(252,220,225,0.25);
    border: 1.5px solid rgba(252,220,225,0.6);
    color: #000000;
  }
  .photo-btn-remove:hover { background: rgba(252,220,225,0.5); color: #000000; }

  /* ── Detail cards ───────────────────────────────────────────── */
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
    animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.16s both;
  }

  .detail-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(18px);
    border: 1.5px solid rgba(216,190,229,0.22);
    border-radius: 18px;
    padding: 20px 24px;
    box-shadow: 0 3px 16px rgba(167,171,222,0.07);
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s;
  }
  .detail-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(167,171,222,0.14); }
  .detail-card.full { grid-column: 1 / -1; }

  .detail-label {
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: #000000; font-weight: 500; margin-bottom: 8px;
  }
  .detail-value { font-size: 15px; color: #3a2f5a; font-weight: 400; line-height: 1.3; }
  .detail-value.muted { color: #000000; font-style: italic; font-weight: 300; font-size: 14px; }

  /* ── Security card ──────────────────────────────────────────── */
  .security-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(18px);
    border: 1.5px solid rgba(216,190,229,0.22);
    border-radius: 18px;
    padding: 22px 28px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    box-shadow: 0 3px 16px rgba(167,171,222,0.07);
    animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.24s both;
  }

  .security-title { font-size: 14.5px; color: #3a2f5a; font-weight: 500; margin-bottom: 3px; }
  .security-sub { font-size: 12.5px; color: #b0a0cc; font-weight: 300; }

  .change-pw-btn {
    padding: 10px 22px; border-radius: 11px;
    background: linear-gradient(135deg, #a7abde, #a7abde);
    border: none; color: #000000;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; letter-spacing: 0.02em; white-space: nowrap;
    box-shadow: 0 4px 16px rgba(167,171,222,0.32);
    transition: all 0.22s;
  }
  .change-pw-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(167,171,222,0.48); }

  /* ── Modal shared ───────────────────────────────────────────── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(58,47,90,0.15);
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 20px;
    animation: fadeIn 0.18s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  .pw-modal {
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(28px);
    border: 1.5px solid rgba(216,190,229,0.38);
    border-radius: 24px;
    width: 410px; max-width: 100%;
    box-shadow: 0 24px 80px rgba(58,47,90,0.16);
    overflow: hidden;
    animation: popIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes popIn { from { opacity:0; transform:scale(0.91) translateY(16px); } to { opacity:1; transform:scale(1) translateY(0); } }

  .modal-head {
    background: linear-gradient(135deg, rgba(216,190,229,0.3), rgba(200,206,238,0.18));
    border-bottom: 1px solid rgba(216,190,229,0.2);
    padding: 24px 28px 18px;
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; color: #000000; }
  .modal-sub { font-size: 12px; color: #000000; margin-top: 3px; }

  .modal-close {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid rgba(216,190,229,0.5);
    background: rgba(255,255,255,0.7);
    cursor: pointer; font-size: 14px; color: #000000;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .modal-close:hover { background: rgba(252,220,225,0.6); color: #8b5f72; }

  .modal-body { padding: 24px 28px 28px; }

  /* ── Photo modal specific ───────────────────────────────────── */
  .photo-drop-zone {
    border: 2px dashed rgba(216,190,229,0.5);
    border-radius: 16px;
    padding: 32px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.22s;
    background: rgba(248,244,252,0.5);
    margin-bottom: 20px;
    position: relative;
  }
  .photo-drop-zone:hover, .photo-drop-zone.drag-over {
    border-color: #d8bee5;
    background: rgba(248,244,252,0.9);
  }

  .drop-preview-wrap {
    display: flex; justify-content: center; margin-bottom: 12px;
  }
  .drop-preview {
    width: 90px; height: 90px; border-radius: 50%; object-fit: cover;
    border: 3px solid rgba(216,190,229,0.4);
    box-shadow: 0 4px 16px rgba(167,171,222,0.25);
  }
  .drop-icon {
    font-size: 32px; color: #000000; margin-bottom: 10px; display: block;
  }
  .drop-title { font-size: 14px; color: #000000; font-weight: 500; margin-bottom: 4px; }
  .drop-hint { font-size: 12px; color: #000000; }
  .drop-hint strong { color: #000000; font-weight: 500; }

  .photo-modal-actions { display: flex; gap: 10px; }

  .modal-cancel {
    flex: 1; padding: 11px; border-radius: 11px;
    border: 1.5px solid rgba(11, 11, 11, 0.38);
    background: transparent; color: #000000;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; cursor: pointer;
    transition: all 0.2s;
  }
  .modal-cancel:hover { background: rgba(216,190,229,0.1); color: #000000; }

  .modal-save {
    flex: 2; padding: 11px; border-radius: 11px;     border: 1.5px solid rgba(11, 11, 11, 0.38);

    background: linear-gradient(135deg, #a7abde, #a7abde);
    color: #000000;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(167,171,222,0.32); transition: all 0.22s;
  }
  .modal-save:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(167,171,222,0.48); }
  .modal-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Password modal fields ──────────────────────────────────── */
  .pw-field { margin-bottom: 15px; }
  .pw-label {
    font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase;
    color: #000000; font-weight: 500; margin-bottom: 6px; display: block;
  }
  .pw-input {
    width: 100%;
    background: rgba(248,244,252,0.9);
    border: 1.5px solid rgba(0, 0, 0, 0.32);
    border-radius: 11px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #000000;
    outline: none; transition: all 0.2s;
  }
  .pw-input:focus { border-color: #d8bee5; background: #fff; box-shadow: 0 0 0 3px rgba(216,190,229,0.2); }
  .pw-input::placeholder { color: #d4c8e6; }

  .strength-row { display: flex; gap: 4px; align-items: center; margin-top: 7px; }
  .strength-seg { height: 3px; flex: 1; border-radius: 3px; background: rgba(216,190,229,0.2); transition: background 0.3s; }
  .seg-weak   { background: #fca5a5; }
  .seg-fair   { background: #fcd34d; }
  .seg-good   { background: #86efac; }
  .seg-strong { background: #6ee7b7; }
  .strength-text { font-size: 10.5px; color: #000000; margin-left: 6px; white-space: nowrap; }

  .inline-err { font-size: 11.5px; color: #c48a9e; margin-top: 5px; }

  .error-banner {
    background: rgba(252,220,225,0.38);
    border: 1px solid rgba(252,220,225,0.65);
    border-radius: 10px;
    padding: 10px 14px; font-size: 13px; color: #c48a9e; margin-bottom: 16px;
  }

  .modal-actions { display: flex; gap: 10px; margin-top: 8px; }

  /* ── Toast ──────────────────────────────────────────────────── */
  .toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: rgba(255,255,255,0.94); backdrop-filter: blur(16px);
    border: 1.5px solid rgba(5, 5, 5, 0.38); border-radius: 13px;
    padding: 12px 24px; font-size: 13.5px; color: #4a3f6b;
    box-shadow: 0 8px 32px rgba(167,171,222,0.22); z-index: 200;
    display: flex; align-items: center; gap: 8px;
    animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(14px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

  @media (max-width: 580px) {
    .prof-hero { flex-direction: column; text-align: center; padding: 26px 20px; }
    .photo-action-row { justify-content: center; }
    .detail-grid { grid-template-columns: 1fr; }
    .detail-card.full { grid-column: 1; }
    .security-card { flex-direction: column; align-items: flex-start; gap: 14px; }
    .change-pw-btn { width: 100%; }
    .prof-title { font-size: 32px; }
  }
`;

/* ─── helpers ──────────────────────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { level: 0, label: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { level: 1, label: 'Weak' };
  if (s === 2) return { level: 2, label: 'Fair' };
  if (s === 3) return { level: 3, label: 'Good' };
  return { level: 4, label: 'Strong' };
}

function segClass(bar, level) {
  if (bar > level) return 'strength-seg';
  if (level === 1) return 'strength-seg seg-weak';
  if (level === 2) return 'strength-seg seg-fair';
  if (level === 3) return 'strength-seg seg-good';
  return 'strength-seg seg-strong';
}

function formatDob(d) {
  if (!d) return null;
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;
}

/* ─── Component ─────────────────────────────────────────────────────────── */
const Profile = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mv_user');
    return stored ? JSON.parse(stored) : null;
  });

  const email = user?.email || '';
  const name = user?.name || '';
  const dob = user?.dob || '';

  // Fetch full profile from API on mount
  useEffect(() => {
    if (email) {
      logger.info('Profile', 'Fetching profile', { email });
      fetch(`http://localhost:5001/profile/${email}`)
        .then(res => res.json())
        .then(data => {
          if (!data.message) {
            logger.info('Profile', 'Profile fetched successfully', { email });
            setUser(data);
            localStorage.setItem('mv_user', JSON.stringify(data));
          } else {
            logger.warn('Profile', 'Profile fetch returned a message', { email, message: data.message });
          }
        })
        .catch(err => logger.error('Profile', 'Error fetching profile', err.message));
    }
  }, [email]);

  const initials = name.trim()
    ? name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : email[0]?.toUpperCase() || '?';

  // Photo state — persisted in localStorage as data-URL
  const [photo, setPhoto] = useState(localStorage.getItem('profile_photo') || '');
  const [photoModal, setPhotoModal] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState('');   // preview inside modal
  const [dragOver, setDragOver] = useState(false);
  const photoInputRef = useRef();

  // Password modal state
  const [showPwModal, setShowPwModal] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState('');
  const [busy, setBusy] = useState(false);

  const [toast, setToast] = useState('');

  const strength = getStrength(pw.next);

  /* ── photo helpers ── */
  const openPhotoModal = () => { setPendingPhoto(''); setDragOver(false); setPhotoModal(true); };
  const closePhotoModal = () => setPhotoModal(false);

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setPendingPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = e => readFile(e.target.files[0]);

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  };

  const savePhoto = () => {
    if (!pendingPhoto) return;
    setPhoto(pendingPhoto);
    localStorage.setItem('profile_photo', pendingPhoto);
    closePhotoModal();
    showToast('Profile photo updated');
  };

  const removePhoto = () => {
    setPhoto('');
    localStorage.removeItem('profile_photo');
    showToast('Profile photo removed');
  };

  /* ── password helpers ── */
  const openPwModal = () => { setPw({ current: '', next: '', confirm: '' }); setPwErr(''); setShowPwModal(true); };
  const closePwModal = () => setShowPwModal(false);

  const handleSave = async () => {
    setPwErr('');
    if (!pw.current) return setPwErr('Please enter your current password.');
    if (pw.next.length < 8) return setPwErr('New password must be at least 8 characters.');
    if (pw.next !== pw.confirm) return setPwErr('New passwords do not match.');

    setBusy(true);
    logger.info('Profile', 'Password change attempt', { email });
    try {
      const res = await fetch('http://localhost:5001/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, current_password: pw.current, new_password: pw.next }),
      });
      const data = await res.json();
      if (res.ok) {
        logger.info('Profile', 'Password changed successfully', { email });
        closePwModal(); showToast('Password updated successfully');
      } else {
        logger.warn('Profile', 'Password change failed', { email, reason: data.message });
        setPwErr(data.message || 'Something went wrong.');
      }
    } catch {
      logger.error('Profile', 'Password change request threw an exception', { email });
      setPwErr('Could not connect to the server.');
    }
    setBusy(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /* ── render ── */
  return (
    <>
      <style>{styles}</style>
      <div className="prof-root">
        <div className="prof-blob prof-blob1" />
        <div className="prof-blob prof-blob2" />
        <div className="prof-blob prof-blob3" />
        <Navbar />

        <main className="prof-main">

          <div className="prof-heading">
            <p className="prof-eyebrow">Account</p>
            <h1 className="prof-title">Your <em>Profile</em></h1>
          </div>

          {/* ── Hero card ── */}
          <div className="prof-hero">

            {/* Clickable avatar */}
            <div className="avatar-wrap" onClick={openPhotoModal} title="Change profile photo">
              <div className="avatar-ring">
                <div className="avatar-inner">
                  {photo
                    ? <img src={photo} alt="Profile" />
                    : <span className="avatar-initials">{initials}</span>
                  }
                </div>
              </div>

              {/* hover overlay */}
              <div className="avatar-overlay">
                {/* Camera SVG inline */}
                <svg className="overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span className="overlay-label">{photo ? 'Change' : 'Upload'}</span>
              </div>

              <div className="avatar-change-hint">{photo ? 'Change photo' : 'Add photo'}</div>
            </div>

            <div className="hero-text">
              <div className="hero-name">
                {name || <span style={{ color: '#c4b8d8', fontStyle: 'italic', fontWeight: 300, fontSize: 22 }}>No name provided</span>}
              </div>
              <div className="hero-email">{email}</div>

              {/* Quick photo action buttons */}
              <div className="photo-action-row">
                <button className="photo-btn photo-btn-upload" onClick={openPhotoModal}>
                  {photo ? 'Change photo' : 'Upload photo'}
                </button>
                {photo && (
                  <button className="photo-btn photo-btn-remove" onClick={removePhoto}>
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Detail cards ── */}
          <div className="detail-grid">
            <div className="detail-card">
              <div className="detail-label">Full Name</div>
              {name
                ? <div className="detail-value">{name}</div>
                : <div className="detail-value muted">Not provided</div>}
            </div>

            <div className="detail-card">
              <div className="detail-label">Email Address</div>
              <div className="detail-value">{email}</div>
            </div>

            <div className="detail-card full">
              <div className="detail-label">Date of Birth</div>
              {dob
                ? <div className="detail-value">{formatDob(dob)}</div>
                : <div className="detail-value muted">Not provided</div>}
            </div>
          </div>

          {/* ── Security card ── */}
          <div className="security-card">
            <div>
              <div className="security-title">Password &amp; Security</div>
              <div className="security-sub">Keep your vault protected with a strong password</div>
            </div>
            <button className="change-pw-btn" onClick={openPwModal}>Change Password</button>
          </div>

        </main>

        {/* ══ Photo Upload Modal ══════════════════════════════════════════ */}
        {photoModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closePhotoModal()}>
            <div className="pw-modal">
              <div className="modal-head">
                <div>
                  <div className="modal-title">{photo ? 'Change Photo' : 'Upload Photo'}</div>
                  <div className="modal-sub">Choose a photo to use as your profile picture</div>
                </div>
                <button className="modal-close" onClick={closePhotoModal}>✕</button>
              </div>

              <div className="modal-body">
                {/* Drop zone */}
                <div
                  className={`photo-drop-zone ${dragOver ? 'drag-over' : ''}`}
                  onClick={() => photoInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {pendingPhoto ? (
                    <div className="drop-preview-wrap">
                      <img src={pendingPhoto} alt="Preview" className="drop-preview" />
                    </div>
                  ) : (
                    <span className="drop-icon">
                      {/* Upload icon */}
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d8bee5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                    </span>
                  )}

                  <div className="drop-title">
                    {pendingPhoto ? 'Looking good!' : 'Drop your photo here'}
                  </div>
                  <div className="drop-hint">
                    {pendingPhoto ? 'Click to choose a different one' : <>or <strong>click to browse</strong> · JPG, PNG, GIF</>}
                  </div>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileInput}
                  />
                </div>

                <div className="photo-modal-actions">
                  <button className="modal-cancel" onClick={closePhotoModal}>Cancel</button>
                  <button className="modal-save" onClick={savePhoto} disabled={!pendingPhoto}>
                    Save Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ Change Password Modal ══════════════════════════════════════ */}
        {showPwModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closePwModal()}>
            <div className="pw-modal">
              <div className="modal-head">
                <div>
                  <div className="modal-title">Change Password</div>
                  <div className="modal-sub">Choose a strong, unique password</div>
                </div>
                <button className="modal-close" onClick={closePwModal}>✕</button>
              </div>

              <div className="modal-body">
                {pwErr && <div className="error-banner">{pwErr}</div>}

                <div className="pw-field">
                  <label className="pw-label">Current Password</label>
                  <input className="pw-input" type="password" placeholder="Enter current password"
                    value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} />
                </div>

                <div className="pw-field">
                  <label className="pw-label">New Password</label>
                  <input className="pw-input" type="password" placeholder="At least 8 characters"
                    value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} />
                  {pw.next && (
                    <div className="strength-row">
                      {[1, 2, 3, 4].map(bar => (
                        <div key={bar} className={segClass(bar, strength.level)} />
                      ))}
                      <span className="strength-text">{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="pw-field">
                  <label className="pw-label">Confirm New Password</label>
                  <input className="pw-input" type="password" placeholder="Repeat new password"
                    value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} />
                  {pw.confirm && pw.next !== pw.confirm && (
                    <div className="inline-err">Passwords do not match</div>
                  )}
                </div>

                <div className="modal-actions">
                  <button className="modal-cancel" onClick={closePwModal}>Cancel</button>
                  <button className="modal-save" onClick={handleSave} disabled={busy}>
                    {busy ? 'Saving…' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
};

export default Profile;

