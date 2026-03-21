import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');


  .capsule-root {
    flex: 1;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.45;
    pointer-events: none;
  }
  .blob1 { width: 420px; height: 420px; background: #e8daf0; top: -80px; left: -100px; }
  .blob2 { width: 320px; height: 320px; background: #fcdce1; bottom: -60px; right: -60px; }
  .blob3 { width: 260px; height: 260px; background: #d8bee5; top: 40%; left: 60%; }

  .capsule-card {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(200,206,238,0.4);
    border-radius: 28px;
    padding: 56px 52px 48px;
    width: 460px;
    max-width: 95vw;
    text-align: center;
    box-shadow: 0 8px 48px rgba(167,171,222,0.18), 0 2px 12px rgba(200,206,238,0.12);
    position: relative;
    z-index: 2;
    animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .capsule-icon {
    font-size: 52px;
    margin-bottom: 12px;
    display: block;
    animation: float 3.5s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .capsule-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 300;
    color: #000000;
    letter-spacing: 0.01em;
    margin-bottom: 6px;
  }

  .capsule-subtitle {
    font-size: 13.5px;
    color: #a799c4;
    font-weight: 300;
    letter-spacing: 0.04em;
    margin-bottom: 40px;
  }

  .divider {
    width: 48px;
    height: 1.5px;
    background: linear-gradient(90deg, #d8bee5, #fcdce1);
    margin: 0 auto 40px;
    border-radius: 2px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 18px 24px;
    border-radius: 16px;
    border: 1.5px solid transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    text-align: left;
    margin-bottom: 14px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #d8bee5 0%, #c8ceee 100%);
    color: #4a3f6b;
    border-color: rgba(200,206,238,0.5);
    box-shadow: 0 4px 20px rgba(200,206,238,0.3);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(200,206,238,0.45);
    background: linear-gradient(135deg, #e8daf0 0%, #d8bee5 100%);
  }

  .btn-secondary {
    background: rgba(252,220,225,0.35);
    color: #7a5c8a;
    border-color: rgba(252,220,225,0.6);
  }
  .btn-secondary:hover {
    transform: translateY(-2px);
    background: rgba(252,220,225,0.6);
    box-shadow: 0 6px 22px rgba(252,220,225,0.35);
  }

  .btn-icon {
    font-size: 22px;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.55);
    flex-shrink: 0;
  }

  .btn-text { display: flex; flex-direction: column; }
  .btn-label { font-size: 14.5px; font-weight: 500; color: #000000; }
  .btn-desc { font-size: 12px; color: #a799c4; font-weight: 300; margin-top: 2px; }

  .footer-note {
    margin-top: 32px;
    font-size: 11.5px;
    color: #000000;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

function Capsule() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <style>{styles}</style>
      <Navbar />
      <div className="capsule-root" style={{ minHeight: "calc(100vh - 63px)" }}>
        <div className="bg-blob blob1" />
        <div className="bg-blob blob2" />
        <div className="bg-blob blob3" />

        <div className="capsule-card">
          <span className="capsule-icon">✦</span>
          <h1 className="capsule-title">Time Capsules</h1>
          <p className="capsule-subtitle">Seal your memories · Unlock in time</p>
          <div className="divider" />

          <button className="action-btn btn-primary" onClick={() => navigate("/add-capsule")}>
            <div className="btn-icon">＋</div>
            <div className="btn-text">
              <span className="btn-label">Create New Capsule</span>
              <span className="btn-desc">Seal a memory for the future</span>
            </div>
          </button>

          <button className="action-btn btn-secondary" onClick={() => navigate("/view-capsules")}>
            <div className="btn-icon">🗝</div>
            <div className="btn-text">
              <span className="btn-label">View My Capsules</span>
              <span className="btn-desc">Open what time has kept for you</span>
            </div>
          </button>

          <p className="footer-note">your memories, protected by time</p>
        </div>
      </div>
    </div>
  );
}

export default Capsule;