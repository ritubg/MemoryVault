import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logger from "../services/logger";

const LOGO_SRC = "/logo.jpeg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-root {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg-color); font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden; padding: 24px;
  }

  .auth-blob { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.35; pointer-events: none; }
  .auth-blob1 { width: 500px; height: 500px; background: #e8daf0; top: -120px; left: -120px; }
  .auth-blob2 { width: 380px; height: 380px; background: #fcdce1; bottom: -80px; right: -80px; }
  .auth-blob3 { width: 260px; height: 260px; background: #c8ceee; top: 35%; left: 60%; }

  .auth-card {
    background: rgba(255,255,255,0.8); backdrop-filter: blur(24px);
    border: 1.5px solid rgba(216,190,229,0.3); border-radius: 30px;
    width: 460px; max-width: 100%;
    box-shadow: 0 12px 60px rgba(167,171,222,0.18);
    position: relative; z-index: 2; overflow: hidden;
    animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes cardIn { from { opacity:0; transform:translateY(28px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

  .auth-top {
    background: linear-gradient(140deg, rgba(216,190,229,0.3) 0%, rgba(200,206,238,0.2) 100%);
    border-bottom: 1px solid rgba(216,190,229,0.2);
    padding: 28px 36px 22px;
    display: flex; flex-direction: column; align-items: center;
  }

  .auth-logo-ring { width:78px; height:78px; border-radius:50%; padding:3px; background:linear-gradient(135deg,#d8bee5,#a7abde,#fcdce1); margin-bottom:12px; box-shadow:0 6px 28px rgba(167,171,222,0.35); }
  .auth-logo-inner { width:100%; height:100%; border-radius:50%; overflow:hidden; background:#f8f4fb; display:flex; align-items:center; justify-content:center; }
  .auth-logo-img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
  .auth-brand { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:#4a3f6b; letter-spacing:0.02em; margin-bottom:2px; }
  .auth-tagline { font-size:11.5px; color:#c4b8d8; letter-spacing:0.05em; }

  .auth-body { padding: 26px 36px 30px; }
  .auth-heading { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:300; color:#3a2f5a; margin-bottom:3px; }
  .auth-sub { font-size:12.5px; color:#b0a0cc; margin-bottom:20px; font-weight:300; }

  .photo-area { display:flex; justify-content:center; margin-bottom:20px; }
  .photo-trigger {
    width:74px; height:74px; border-radius:50%; cursor:pointer;
    border:2px dashed rgba(216,190,229,0.55); background:rgba(248,244,252,0.8);
    overflow:hidden; display:flex; align-items:center; justify-content:center;
    transition:all 0.22s;
  }
  .photo-trigger:hover { border-color:#d8bee5; }
  .photo-trigger img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
  .photo-plus { display:flex; flex-direction:column; align-items:center; gap:2px; font-size:22px; color:#d4c8e6; }
  .photo-plus span { font-size:9.5px; letter-spacing:0.08em; text-transform:uppercase; color:#d4c8e6; font-family:'DM Sans',sans-serif; }

  .field { margin-bottom:13px; }
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:13px; }
  .field-label { font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:#c4b8d8; font-weight:500; margin-bottom:5px; display:block; }

  .field-input {
    width:100%; background:rgba(248,244,252,0.85);
    border:1.5px solid rgba(216,190,229,0.35); border-radius:11px;
    padding:10px 13px; font-family:'DM Sans',sans-serif;
    font-size:13.5px; color:#4a3f6b; outline:none; transition:all 0.22s;
  }
  .field-input:focus { border-color:#d8bee5; background:#fff; box-shadow:0 0 0 3px rgba(216,190,229,0.2); }
  .field-input::placeholder { color:#d4c8e6; }
  input[type="date"].field-input::-webkit-calendar-picker-indicator { opacity:0.4; cursor:pointer; }

  .auth-submit {
    width:100%; margin-top:6px; padding:13px;
    background:linear-gradient(135deg,#d8bee5 0%,#a7abde 100%);
    border:none; border-radius:13px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    color:#fff; cursor:pointer; letter-spacing:0.03em;
    box-shadow:0 4px 20px rgba(167,171,222,0.38); transition:all 0.25s;
  }
  .auth-submit:hover { transform:translateY(-1px); box-shadow:0 6px 28px rgba(167,171,222,0.52); }

  .auth-footer { text-align:center; margin-top:18px; font-size:13px; color:#b0a0cc; }
  .auth-footer a { color:#8b7aad; text-decoration:none; font-weight:500; }
  .auth-footer a:hover { color:#4a3f6b; }

  .error-msg { background:rgba(252,220,225,0.4); border:1px solid rgba(252,220,225,0.7); border-radius:10px; padding:10px 14px; font-size:13px; color:#c48a9e; margin-bottom:14px; }

  @media (max-width:480px) {
    .auth-body { padding:20px 18px 26px; }
    .auth-top { padding:22px 18px 18px; }
    .field-row { grid-template-columns:1fr; }
  }
`;

function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"", dob:"", photo:null });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (file) { setForm({ ...form, photo: file }); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    setError("");
    logger.info('Signup', 'Signup attempt', { email: form.email });
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
    const res = await fetch("http://localhost:5001/signup", { method:"POST", body:formData });
    const data = await res.json();
    if (res.status === 200) {
      logger.info('Signup', 'Signup successful', { email: form.email });
      navigate("/login");
    } else {
      logger.warn('Signup', 'Signup failed', { email: form.email, reason: data.message });
      setError(data.message || "Signup failed.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-blob auth-blob1"/><div className="auth-blob auth-blob2"/><div className="auth-blob auth-blob3"/>
        <div className="auth-card">
          <div className="auth-top">
            <div className="auth-logo-ring">
              <div className="auth-logo-inner">
                <img src={LOGO_SRC} alt="Memory Vault" className="auth-logo-img"
                  onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement.innerHTML='<span style="font-size:28px">✦</span>'; }}/>
              </div>
            </div>
            <div className="auth-brand">MemoryVault</div>
            <div className="auth-tagline">Seal your memories in time</div>
          </div>

          <div className="auth-body">
            <h2 className="auth-heading">Create your vault</h2>
            <p className="auth-sub">Start preserving what matters most</p>

            {error && <div className="error-msg">{error}</div>}

            <div className="photo-area">
              <label className="photo-trigger" htmlFor="photoInput">
                {preview ? <img src={preview} alt="Preview"/> : <div className="photo-plus">+<span>Photo</span></div>}
              </label>
              <input type="file" id="photoInput" accept="image/*" hidden onChange={handlePhoto}/>
            </div>

            <div className="field-row">
              <div>
                <label className="field-label">Full Name</label>
                <input className="field-input" type="text" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange}/>
              </div>
              <div>
                <label className="field-label">Date of Birth</label>
                <input className="field-input" type="date" name="dob" value={form.dob} onChange={handleChange}/>
              </div>
            </div>

            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange}/>
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange}/>
            </div>

            <button className="auth-submit" onClick={handleSubmit}>Create Vault →</button>

            <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;