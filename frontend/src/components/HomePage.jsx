import React from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Clock, FileText, User } from "lucide-react";
import Navbar from "./Navbar";

// Place your Memory Vault logo image at /public/logo.png
// It will be displayed as a round logo at the top of the homepage
const LOGO_SRC = "/logo.jpeg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .hp-root { 
    min-height: 100vh; 
    display: flex;
    flex-direction: column;
    background: var(--bg-color); 
    font-family: 'DM Sans', sans-serif; 
    position: relative; 
    overflow-x: hidden; 
  }

  .hp-blob { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.3; pointer-events: none; z-index: 0; }
  .hp-blob1 { width: 600px; height: 600px; background: #e8daf0; top: -150px; left: -150px; }
  .hp-blob2 { width: 400px; height: 400px; background: #fcdce1; bottom: -80px; right: -80px; }
  .hp-blob3 { width: 300px; height: 300px; background: #c8ceee; top: 38%; left: 58%; }

  .hp-main { 
    flex: 1;
    width: 100%;
    max-width: 1400px; 
    margin: 0 auto; 
    padding: 52px 24px 80px; 
    position: relative; 
    z-index: 1; 
  }

  .hp-hero {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    margin-bottom: 52px;
    animation: heroIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes heroIn { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }

  .hp-logo-ring {
    width: 150px; height: 150px; border-radius: 50%; padding: 4px;
    background: linear-gradient(135deg, #d8bee5 0%, #a7abde 50%, #fcdce1 100%);
    margin-bottom: 28px;
    box-shadow: 0 8px 40px rgba(167,171,222,0.32);
    animation: logoPulse 4s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes logoPulse {
    0%,100% { box-shadow: 0 8px 40px rgba(167,171,222,0.32); }
    50% { box-shadow: 0 12px 56px rgba(167,171,222,0.5); }
  }

  .hp-logo-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #f8f4fb; display: flex; align-items: center; justify-content: center; }
  .hp-logo-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .hp-logo-fallback { font-size: 52px; }

  .hp-eyebrow { font-size: 15px; letter-spacing: 0.22em; text-transform: uppercase; color: #000000; margin-bottom: 10px; }

  .hp-title { font-family: 'Cormorant Garamond', serif; font-size: 50px; font-weight: 300; color: #3a2f5a; line-height: 1.08; margin-bottom: 12px; }
  .hp-title em { font-style: italic; color: #000000; }

  .hp-sub { font-size: 17px; color: #000000; font-weight: 300; max-width: 380px; line-height: 1.65; }

  .hp-divider { width: 56px; height: 1.5px; background: linear-gradient(90deg, #d8bee5, #fcdce1); margin: 22px auto 0; border-radius: 2px; }

  .hp-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
    animation: gridIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }

  @keyframes gridIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  .action-card {
    background: rgba(255,255,255,0.72); backdrop-filter: blur(20px);
    border-radius: 24px; padding: 34px 30px 28px;
    text-decoration: none; display: flex; flex-direction: column;
    position: relative; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    border: 1.5px solid rgba(216,190,229,0.28);
    box-shadow: 0 4px 24px rgba(167,171,222,0.1);
  }

  .action-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 24px 24px 0 0; opacity: 0; transition: opacity 0.25s;
  }

  .action-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(167,171,222,0.2); }
  .action-card:hover::after { opacity: 1; }

  .card-capsules::after { background: linear-gradient(90deg, #d8bee5, #c8ceee); }
  .card-timeline::after { background: linear-gradient(90deg, #fcdce1, #e8daf0); }
  .card-summary::after { background: linear-gradient(90deg, #c8ceee, #a7abde); }
  .card-profile::after { background: linear-gradient(90deg, #e8daf0, #fcdce1); }

  .card-icon-wrapper {
    width: 50px; height: 50px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px; transition: transform 0.25s;
  }

  .action-card:hover .card-icon-wrapper { transform: scale(1.1); }

  .card-capsules .card-icon-wrapper { background: rgba(216,190,229,0.32); color: #8b7aad; }
  .card-timeline .card-icon-wrapper { background: rgba(252,220,225,0.42); color: #c48a9e; }
  .card-summary .card-icon-wrapper { background: rgba(200,206,238,0.42); color: #6b72a8; }
  .card-profile .card-icon-wrapper { background: rgba(232,218,240,0.45); color: #8b7aad; }

  .action-card h2 { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; color: #3a2f5a; margin-bottom: 7px; }
  .action-card p { font-size: 13px; color: #b0a0cc; font-weight: 300; line-height: 1.55; flex: 1; }

  .card-arrow { margin-top: 22px; font-size: 20px; color: #d8bee5; transition: transform 0.22s, color 0.22s; align-self: flex-end; }
  .action-card:hover .card-arrow { transform: translate(4px, -2px); color: #a7abde; }

  @media (max-width: 600px) {
    .hp-grid { grid-template-columns: 1fr; }
    .hp-title { font-size: 34px; }
    .hp-main { padding: 30px 16px 60px; }
    .hp-logo-ring { width: 120px; height: 120px; }
  }
`;

function HomePage() {
  const cards = [
    { title: "Capsules", description: "Seal and manage your cherished memories safely", icon: LayoutGrid, path: "/home/capsule", colorClass: "card-capsules" },
    { title: "Timeline", description: "Journey through your memories across time", icon: Clock, path: "/home/timeline", colorClass: "card-timeline" },
    { title: "AI Summary", description: "Discover patterns and insights from your vault", icon: FileText, path: "/home/summary", colorClass: "card-summary" },
    { title: "Profile", description: "Manage your account and personal settings", icon: User, path: "/home/profile", colorClass: "card-profile" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">
        <div className="hp-blob hp-blob1" /><div className="hp-blob hp-blob2" /><div className="hp-blob hp-blob3" />
        <Navbar />
        <main className="hp-main">
          <div className="hp-hero">
            <div className="hp-logo-ring">
              <div className="hp-logo-inner">
                <img src={LOGO_SRC} alt="Memory Vault" className="hp-logo-img"
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<span class="hp-logo-fallback">✦</span>'; }} />
              </div>
            </div>
            <p className="hp-eyebrow">Welcome back</p>
            <h1 className="hp-title">Your <em>Memory</em> Vault</h1>
            <p className="hp-sub">A sanctuary for your most precious moments, sealed in time and unlocked when you're ready.</p>
            <div className="hp-divider" />
          </div>

          <div className="hp-grid">
            {cards.map(({ title, description, icon: Icon, path, colorClass }, i) => (
              <Link to={path} key={i} className={`action-card ${colorClass}`}>
                <div className="card-icon-wrapper"><Icon size={24} /></div>
                <h2>{title}</h2>
                <p>{description}</p>
                <span className="card-arrow">→</span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default HomePage;