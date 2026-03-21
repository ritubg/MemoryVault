import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LOGO_SRC = "/logo.jpeg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #f8f4fb; font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden; padding: 24px;
  }

  .auth-blob { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.35; pointer-events: none; }
  .auth-blob1 { width: 500px; height: 500px; background: #e8daf0; top: -120px; left: -120px; }
  .auth-blob2 { width: 380px; height: 380px; background: #fcdce1; bottom: -80px; right: -80px; }
  .auth-blob3 { width: 260px; height: 260px; background: #c8ceee; top: 35%; left: 60%; }

  .auth-card {
    background: rgba(255,255,255,0.8); backdrop-filter: blur(24px);
    border: 1.5px solid rgba(216,190,229,0.3); border-radius: 30px;
    width: 420px; max-width: 100%;
    box-shadow: 0 12px 60px rgba(167,171,222,0.18);
    position: relative; z-index: 2;
    overflow: hidden;
    animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes cardIn { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .auth-top {
    background: linear-gradient(140deg, rgba(216,190,229,0.3) 0%, rgba(200,206,238,0.2) 100%);
    border-bottom: 1px solid rgba(216,190,229,0.2);
    padding: 36px 36px 28px;
    display: flex; flex-direction: column; align-items: center;
  }

  .auth-logo-ring {
    width: 86px; height: 86px; border-radius: 50%; padding: 3px;
    background: linear-gradient(135deg, #d8bee5, #a7abde, #fcdce1);
    margin-bottom: 18px;
    box-shadow: 0 6px 28px rgba(167,171,222,0.35);
  }

  .auth-logo-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #f8f4fb; display: flex; align-items: center; justify-content: center; }
  .auth-logo-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

  .auth-brand { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: #4a3f6b; letter-spacing: 0.02em; margin-bottom: 2px; }
  .auth-tagline { font-size: 12px; color: #c4b8d8; letter-spacing: 0.05em; }

  .auth-body { padding: 32px 36px 36px; }

  .auth-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: #3a2f5a; margin-bottom: 4px; }
  .auth-sub { font-size: 12.5px; color: #b0a0cc; margin-bottom: 26px; font-weight: 300; }

  .field { margin-bottom: 16px; }
  .field-label { font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: #c4b8d8; font-weight: 500; margin-bottom: 6px; display: block; }

  .field-input {
    width: 100%; background: rgba(248,244,252,0.85);
    border: 1.5px solid rgba(216,190,229,0.35); border-radius: 12px;
    padding: 11px 14px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #4a3f6b; outline: none;
    transition: all 0.22s;
  }

  .field-input:focus {
    border-color: #d8bee5; background: #fff;
    box-shadow: 0 0 0 3px rgba(216,190,229,0.22);
  }

  .field-input::placeholder { color: #d4c8e6; }

  .auth-submit {
    width: 100%; margin-top: 8px; padding: 13px;
    background: linear-gradient(135deg, #d8bee5 0%, #a7abde 100%);
    border: none; border-radius: 13px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    color: #fff; cursor: pointer; letter-spacing: 0.03em;
    box-shadow: 0 4px 20px rgba(167,171,222,0.38);
    transition: all 0.25s;
  }

  .auth-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(167,171,222,0.52); }

  .auth-footer { text-align: center; margin-top: 22px; font-size: 13px; color: #b0a0cc; }
  .auth-footer a { color: #8b7aad; text-decoration: none; font-weight: 500; }
  .auth-footer a:hover { color: #4a3f6b; }

  .error-msg { background: rgba(252,220,225,0.4); border: 1px solid rgba(252,220,225,0.7); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #c48a9e; margin-bottom: 18px; }
`;

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.status === 200) {
      localStorage.setItem("email", form.email);
      navigate("/home");
    } else {
      setError(data.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-blob auth-blob1" /><div className="auth-blob auth-blob2" /><div className="auth-blob auth-blob3" />
        <div className="auth-card">
          <div className="auth-top">
            <div className="auth-logo-ring">
              <div className="auth-logo-inner">
                <img src={LOGO_SRC} alt="Memory Vault" className="auth-logo-img"
                  onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement.innerHTML='<span style="font-size:32px">✦</span>'; }} />
              </div>
            </div>
            <div className="auth-brand">MemoryVault</div>
            <div className="auth-tagline">Seal your memories in time</div>
          </div>

          <div className="auth-body">
            <h2 className="auth-heading">Welcome back</h2>
            <p className="auth-sub">Sign in to access your vault</p>

            {error && <div className="error-msg">{error}</div>}

            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>

            <button className="auth-submit" onClick={handleSubmit}>Sign In →</button>

            <div className="auth-footer">
              Don't have an account? <Link to="/signup">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;