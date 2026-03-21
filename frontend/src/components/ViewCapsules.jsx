import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

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

  /* Modal */
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
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(216,190,229,0.4);
    border-radius: 28px;
    width: 520px;
    max-width: 100%;
    max-height: 85vh;
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
    font-size: 26px;
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
  .chip-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color:   #000000; margin-bottom: 4px; }
  .chip-value { font-size: 13px; color: #000000; font-weight: 500; }

  .content-block {
    margin-bottom: 20px;
  }
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
  }
`;

function ViewCapsules() {
  const navigate = useNavigate();
  const [capsules, setCapsules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [capsuleData, setCapsuleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/capsules/${localStorage.getItem("email")}`)
      .then(res => res.json())
      .then(data => { setCapsules(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openCapsule = async (capsule) => {
    setSelected(capsule);
    if (today >= capsule.open_date) {
      const res = await fetch("http://127.0.0.1:5000/open_capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: capsule.name, email: localStorage.getItem("email") })
      });
      const data = await res.json();
      if (data.status === "open") setCapsuleData(data.capsule);
      else setCapsuleData(null);
    } else {
      setCapsuleData(null);
    }
  };

  const closeModal = () => { setSelected(null); setCapsuleData(null); };

  const isUnlocked = (c) => today >= c.open_date;

  const formatDate = (d) => {
    if (!d) return "—";
    const [y, m, day] = d.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m)-1]} ${parseInt(day)}, ${y}`;
  };

  const daysUntil = (d) => {
    const diff = Math.ceil((new Date(d) - new Date(today)) / 86400000);
    return diff > 0 ? `Opens in ${diff} day${diff === 1 ? "" : "s"}` : "Ready to open";
  };

  return (
    <>
      <style>{styles}</style>
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
          <button className="add-btn" onClick={() => navigate("/add-capsule")}>✦ New Capsule</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 60, color: "#c4b8d8", position: "relative", zIndex: 2 }}>Loading…</div>
        ) : capsules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <div className="empty-title">No capsules yet</div>
            <p className="empty-sub">Create your first one to seal a memory in time</p>
          </div>
        ) : (
          <div className="grid">
            {capsules.map((c, i) => (
              <div className="capsule-card" key={i} onClick={() => openCapsule(c)}>
                <div className={`card-badge ${isUnlocked(c) ? "badge-open" : "badge-locked"}`}>
                  {isUnlocked(c) ? "✦ Unlocked" : "🔒 Sealed"}
                </div>
                <div className="card-name">{c.name}</div>
                <div className="card-meta">
                  <div className="meta-row"><span className="meta-icon"></span> Created {formatDate(c.date_created)}</div>
                  <div className="meta-row"><span className="meta-icon">🗝</span> Opens {formatDate(c.open_date)}</div>
                </div>
                <div className="card-footer">
                  <span className="open-hint">{daysUntil(c.open_date)}</span>
                  <span className="card-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <div>
                  <div className="modal-title">{selected.name}</div>
                  <div style={{ marginTop: 6 }}>
                    <span className={`card-badge ${isUnlocked(selected) ? "badge-open" : "badge-locked"}`} style={{ marginBottom: 0 }}>
                      {isUnlocked(selected) ? "✦ Unlocked" : "🔒 Sealed"}
                    </span>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>

              <div className="modal-body">
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
                    {capsuleData.notes && (
                      <div className="content-block">
                        <div className="content-label">Notes</div>
                        <div className="content-text">{capsuleData.notes}</div>
                      </div>
                    )}
                    {capsuleData.letter && (
                      <div className="content-block">
                        <div className="content-label">Letter</div>
                        <div className="content-text">{capsuleData.letter}</div>
                      </div>
                    )}
                    {!capsuleData.notes && !capsuleData.letter && (
                      <div style={{ textAlign: "center", color: "#c4b8d8", fontSize: 13, padding: "20px 0" }}>
                        No written content in this capsule.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="locked-state">
                    <div className="locked-icon">🔒</div>
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