import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import logger from '../services/logger';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sum-root {
    min-height: 100vh;
    background: #f8f4fb;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .sum-blob { position: fixed; border-radius: 50%; filter: blur(110px); opacity: 0.28; pointer-events: none; z-index: 0; }
  .sum-blob1 { width: 560px; height: 560px; background: #e8daf0; top: -120px; left: -140px; }
  .sum-blob2 { width: 400px; height: 400px; background: #fcdce1; bottom: -60px; right: -80px; }
  .sum-blob3 { width: 300px; height: 300px; background: #c8ceee; top: 40%; left: 55%; }

  .sum-main {
    max-width: 820px;
    margin: 0 auto;
    padding: 52px 24px 80px;
    position: relative;
    z-index: 1;
  }

  /* Header */
  .sum-heading {
    margin-bottom: 36px;
    animation: fadeDown 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }

  .sum-eyebrow {
    font-size: 10.5px; letter-spacing: 0.22em;
    text-transform: uppercase; color: #c4b8d8; margin-bottom: 7px;
  }
  .sum-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #3a2f5a;
    margin-bottom: 6px;
  }
  .sum-title em { font-style: italic; color: #8b7aad; }
  .sum-desc { font-size: 13.5px; color: #b0a0cc; font-weight: 300; line-height: 1.6; max-width: 480px; }

  /* Trigger card */
  .trigger-card {
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(216,190,229,0.28);
    border-radius: 26px;
    padding: 32px 36px;
    margin-bottom: 24px;
    box-shadow: 0 6px 40px rgba(167,171,222,0.12);
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    position: relative; overflow: hidden;
    animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }

  .trigger-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #d8bee5, #fcdce1, #c8ceee);
    border-radius: 26px 26px 0 0;
  }

  @keyframes cardIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  .trigger-text { flex: 1; }
  .trigger-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: #3a2f5a; margin-bottom: 5px; }
  .trigger-sub { font-size: 13px; color: #b0a0cc; font-weight: 300; line-height: 1.55; }

  .generate-btn {
    padding: 12px 28px; border-radius: 13px;
    background: linear-gradient(135deg, #d8bee5, #a7abde);
    border: none; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
    cursor: pointer; letter-spacing: 0.02em; white-space: nowrap;
    box-shadow: 0 4px 20px rgba(167,171,222,0.35);
    transition: all 0.25s;
    display: flex; align-items: center; gap: 8px;
  }
  .generate-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(167,171,222,0.5); }
  .generate-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  /* Loading shimmer */
  .loading-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(18px);
    border: 1.5px solid rgba(216,190,229,0.22);
    border-radius: 22px;
    padding: 36px;
    margin-bottom: 20px;
    box-shadow: 0 4px 24px rgba(167,171,222,0.1);
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .shimmer-line {
    height: 12px; border-radius: 6px;
    background: linear-gradient(90deg, rgba(216,190,229,0.2) 25%, rgba(216,190,229,0.45) 50%, rgba(216,190,229,0.2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
    margin-bottom: 12px;
  }
  .shimmer-line:last-child { margin-bottom: 0; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .loading-label {
    font-size: 12.5px; color: #c4b8d8; text-align: center;
    margin-top: 20px; letter-spacing: 0.06em;
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }

  /* Summary output */
  .summary-output {
    animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* Section card */
  .section-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(18px);
    border: 1.5px solid rgba(216,190,229,0.22);
    border-radius: 22px;
    padding: 28px 32px;
    margin-bottom: 16px;
    box-shadow: 0 4px 20px rgba(167,171,222,0.08);
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s;
  }
  .section-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(167,171,222,0.15); }

  .section-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
  }

  .section-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .dot-highlights { background: linear-gradient(135deg, #d8bee5, #a7abde); }
  .dot-patterns   { background: linear-gradient(135deg, #fcdce1, #e8daf0); }
  .dot-insights   { background: linear-gradient(135deg, #c8ceee, #a7abde); }
  .dot-summary    { background: linear-gradient(135deg, #e8daf0, #fcdce1); }

  .section-title {
    font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
    color: #c4b8d8; font-weight: 500;
  }

  .section-body {
    font-size: 14.5px; color: #4a3f6b; line-height: 1.75; font-weight: 300;
  }

  .section-body p { margin-bottom: 10px; }
  .section-body p:last-child { margin-bottom: 0; }

  .bullet-list { list-style: none; padding: 0; }
  .bullet-list li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 14px; color: #4a3f6b; line-height: 1.65;
    margin-bottom: 9px; font-weight: 300;
  }
  .bullet-list li:last-child { margin-bottom: 0; }
  .bullet-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #d8bee5; flex-shrink: 0; margin-top: 8px;
  }

  /* Raw fallback (unstructured response) */
  .raw-text {
    font-size: 14.5px; color: #4a3f6b; line-height: 1.8; font-weight: 300;
    white-space: pre-wrap;
  }

  /* Empty / error states */
  .state-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(18px);
    border: 1.5px solid rgba(216,190,229,0.22);
    border-radius: 22px;
    padding: 52px 36px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(167,171,222,0.08);
    animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }

  .state-icon { font-size: 40px; margin-bottom: 16px; display: block; opacity: 0.6; }
  .state-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 300; color: #3a2f5a; margin-bottom: 8px;
  }
  .state-sub { font-size: 13px; color: #b0a0cc; font-weight: 300; }

  /* Regen row */
  .regen-row {
    display: flex; justify-content: flex-end; margin-top: 8px;
  }
  .regen-btn {
    font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 400;
    color: #a799c4; background: rgba(216,190,229,0.18);
    border: 1.5px solid rgba(216,190,229,0.38); border-radius: 20px;
    padding: 7px 16px; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .regen-btn:hover { background: rgba(216,190,229,0.35); color: #5a4a8a; }
  .regen-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Spinner */
  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .trigger-card { flex-direction: column; align-items: flex-start; padding: 24px 20px; }
    .generate-btn { width: 100%; justify-content: center; }
    .sum-title { font-size: 32px; }
    .section-card { padding: 22px 20px; }
  }
`;

/* ─── parse markdown-ish sections from Groq response ──────────────────── */
function parseSections(text) {
  const sectionDefs = [
    { key: 'highlights', patterns: [/key highlights?/i, /highlights?/i] },
    { key: 'patterns',   patterns: [/patterns?/i] },
    { key: 'insights',   patterns: [/insights?/i] },
    { key: 'summary',    patterns: [/short summary|summary/i] },
  ];

  const lines = text.split('\n');
  const sections = {};
  let current = null;
  let buffer = [];

  const flush = () => {
    if (current) {
      sections[current] = buffer.join('\n').trim();
      buffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    // Detect section headings (markdown ## or bold ** or plain caps)
    const isHeading = /^#{1,4}\s/.test(line) || /^\*{1,2}[^*]+\*{1,2}$/.test(line) || /^[A-Z][A-Z\s]+:?$/.test(line);

    if (isHeading) {
      const clean = line.replace(/^#+\s*/, '').replace(/\*+/g, '').replace(/:$/, '').trim();
      const match = sectionDefs.find(s => s.patterns.some(p => p.test(clean)));
      if (match) {
        flush();
        current = match.key;
        continue;
      }
    }
    if (current) buffer.push(raw);
  }
  flush();

  // If we couldn't parse structured sections, return null so we show raw text
  return Object.keys(sections).length >= 2 ? sections : null;
}

/* ─── render a single parsed section ──────────────────────────────────── */
function SectionContent({ text }) {
  if (!text) return null;
  // Split into bullet points if dashes/asterisks present
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const hasBullets = lines.some(l => /^[-*•]/.test(l));

  if (hasBullets) {
    const items = lines
      .filter(l => /^[-*•]/.test(l))
      .map(l => l.replace(/^[-*•]\s*/, ''));
    return (
      <ul className="bullet-list">
        {items.map((item, i) => (
          <li key={i}><span className="bullet-dot" />{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="section-body">
      {lines.map((l, i) => <p key={i}>{l}</p>)}
    </div>
  );
}

const SECTION_META = {
  highlights: { label: 'Key Highlights', dotClass: 'dot-highlights' },
  patterns:   { label: 'Patterns',       dotClass: 'dot-patterns'   },
  insights:   { label: 'Insights',       dotClass: 'dot-insights'   },
  summary:    { label: 'Summary',        dotClass: 'dot-summary'    },
};

/* ─── Main component ───────────────────────────────────────────────────── */
const Summary = () => {

  const [status, setStatus]   = useState('idle'); // idle | loading | done | empty | error
  const [rawText, setRawText] = useState('');
  const [sections, setSections] = useState(null);
  const outputRef = useRef(null);

  const fetchSummary = async () => {
    // Read fresh every time — never rely on a stale component-level value
    const storedUser = localStorage.getItem('mv_user');
    const user = storedUser ? JSON.parse(storedUser) : {};
    const email = user.email || '';
    logger.info('Summary', 'Fetch requested', { email });
    if (!email) { logger.warn('Summary', 'No user email found — aborting fetch'); setStatus('error'); return; }

    setStatus('loading');
    setRawText('');
    setSections(null);

    try {
      const res = await fetch(`http://localhost:5001/api/summary/${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!res.ok) {
        logger.error('Summary', 'Fetch returned non-ok status', res.status);
        setStatus('error');
        return;
      }

      const text = data.summary || '';

      if (text === 'No events found.' || text.trim() === '') {
        logger.info('Summary', 'No events to summarise', { email });
        setStatus('empty');
        return;
      }

      setRawText(text);
      setSections(parseSections(text));
      logger.info('Summary', 'Summary received and parsed', { email });
      setStatus('done');

      // Smooth scroll to output
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    } catch (err) {
      logger.error('Summary', 'Fetch threw an exception', err.message);
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <>
      <style>{styles}</style>
      <div className="sum-root">
        <div className="sum-blob sum-blob1" />
        <div className="sum-blob sum-blob2" />
        <div className="sum-blob sum-blob3" />
        <Navbar />

        <main className="sum-main">

          {/* Page heading */}
          <div className="sum-heading">
            <p className="sum-eyebrow">Intelligence</p>
            <h1 className="sum-title">AI <em>Summary</em></h1>
            <p className="sum-desc">
              Let AI analyse your timeline events and surface key highlights, patterns, and insights from your memories.
            </p>
          </div>

          {/* Trigger card */}
          <div className="trigger-card">
            <div className="trigger-text">
              <div className="trigger-title">Analyse My Timeline</div>
              <div className="trigger-sub">
                Generates a personalised report from all your recorded events — highlights, recurring patterns, and a short narrative summary.
              </div>
            </div>
            <button className="generate-btn" onClick={fetchSummary} disabled={isLoading}>
              {isLoading
                ? <><span className="spinner" /> Analysing…</>
                : <>Generate Summary</>
              }
            </button>
          </div>

          {/* Loading shimmer */}
          {status === 'loading' && (
            <div className="loading-card">
              <div className="shimmer-line" style={{ width: '60%' }} />
              <div className="shimmer-line" style={{ width: '85%' }} />
              <div className="shimmer-line" style={{ width: '72%' }} />
              <div className="shimmer-line" style={{ width: '50%', marginTop: 20 }} />
              <div className="shimmer-line" style={{ width: '90%' }} />
              <div className="shimmer-line" style={{ width: '68%' }} />
              <div className="shimmer-line" style={{ width: '55%', marginTop: 20 }} />
              <div className="shimmer-line" style={{ width: '80%' }} />
              <p className="loading-label">Reading your memories…</p>
            </div>
          )}

          {/* Empty state */}
          {status === 'empty' && (
            <div className="state-card">
              <span className="state-icon">✦</span>
              <div className="state-title">No events yet</div>
              <p className="state-sub">Add some timeline events first, then come back to generate your summary.</p>
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div className="state-card">
              <span className="state-icon" style={{ opacity: 0.5 }}>◇</span>
              <div className="state-title">Something went wrong</div>
              <p className="state-sub">Could not reach the server. Please try again in a moment.</p>
            </div>
          )}

          {/* Summary output */}
          {status === 'done' && (
            <div className="summary-output" ref={outputRef}>

              {/* Regen button */}
              <div className="regen-row">
                <button className="regen-btn" onClick={fetchSummary} disabled={isLoading}>
                  ↺ Regenerate
                </button>
              </div>

              {/* Structured sections */}
              {sections ? (
                Object.entries(SECTION_META).map(([key, meta]) => {
                  const content = sections[key];
                  if (!content) return null;
                  return (
                    <div className="section-card" key={key}>
                      <div className="section-header">
                        <span className={`section-dot ${meta.dotClass}`} />
                        <span className="section-title">{meta.label}</span>
                      </div>
                      <SectionContent text={content} />
                    </div>
                  );
                })
              ) : (
                /* Fallback: raw text in a single card */
                <div className="section-card">
                  <div className="section-header">
                    <span className="section-dot dot-summary" />
                    <span className="section-title">Your Summary</span>
                  </div>
                  <div className="raw-text">{rawText}</div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </>
  );
};

export default Summary;