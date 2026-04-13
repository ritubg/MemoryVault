import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, Music, Film, Sparkles } from "lucide-react";
import Navbar from "./Navbar";
import logger from "../services/logger";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .add-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-color);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .add-content {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px 60px;
    position: relative;
    width: 100%;
    margin: 0 auto;
    max-width: 1400px;
  }

  .bg-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.38; pointer-events: none; }
  .blob1 { width: 500px; height: 500px; background: #e8daf0; top: -120px; left: -120px; }
  .blob2 { width: 360px; height: 360px; background: #fcdce1; bottom: 0; right: -80px; }
  .blob3 { width: 280px; height: 280px; background: #c8ceee; top: 50%; left: 55%; }

  .form-shell {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(216,190,229,0.3);
    border-radius: 32px;
    width: 820px;
    max-width: 100%;
    box-shadow: 0 12px 60px rgba(167,171,222,0.15);
    position: relative;
    z-index: 2;
    animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
    overflow: hidden;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .form-header {
    background: linear-gradient(135deg, rgba(216,190,229,0.35) 0%, rgba(200,206,238,0.25) 100%);
    border-bottom: 1px solid rgba(216,190,229,0.2);
    padding: 36px 48px 28px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-icon { font-size: 32px; }

  .form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 300;
    color: #000000;
    line-height: 1.1;
  }

  .form-tagline {
    font-size: 12.5px;
    color: #b0a0cc;
    font-weight: 300;
    letter-spacing: 0.05em;
    margin-top: 3px;
  }

  .back-btn {
    margin-left: auto;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(200,206,238,0.5);
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 12.5px;
    color: #000000;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .back-btn:hover { background: rgba(255,255,255,0.9); color: #4a3f6b; }

  .form-body { padding: 36px 48px 44px; }

  .section-label {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #000000;
    font-weight: 500;
    margin-bottom: 20px;
    margin-top: 32px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(216,190,229,0.25);
  }
  .section-label:first-child { margin-top: 0; }

  .field-row {
    display: grid;
    grid-template-columns: 180px 1fr;
    align-items: start;
    gap: 20px;
    margin-bottom: 18px;
  }

  .field-label {
    font-size: 13.5px;
    color: #000000;
    font-weight: 400;
    padding-top: 11px;
    letter-spacing: 0.01em;
  }

  .field-label .required { color: #d8bee5; margin-left: 3px; }

  .field-input, .field-textarea, .field-select {
    width: 100%;
    background: rgba(248,244,252,0.8);
    border: 1.5px solid rgba(216,190,229,0.35);
    border-radius: 12px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #4a3f6b;
    outline: none;
    transition: all 0.22s;
    -webkit-appearance: none;
  }

  .field-input:focus, .field-textarea:focus {
    border-color: #d8bee5;
    background: rgba(255,255,255,0.95);
    box-shadow: 0 0 0 3px rgba(216,190,229,0.2);
  }

  .field-textarea {
    resize: vertical;
    min-height: 90px;
    line-height: 1.6;
  }

  .upload-zone {
    border: 2px dashed rgba(216,190,229,0.5);
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.22s;
    background: rgba(248,244,252,0.5);
  }
  .upload-zone:hover { border-color: #d8bee5; background: rgba(248,244,252,0.85); }

  .upload-icon { font-size: 22px; margin-bottom: 6px; }
  .upload-text { font-size: 12.5px; color: #b0a0cc; }
  .upload-text strong { color: #8b7aad; font-weight: 500; }

  .file-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .file-pill {
    background: rgba(216,190,229,0.3);
    border: 1px solid rgba(216,190,229,0.5);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11.5px;
    color: #7a6a9a;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pill-remove { cursor: pointer; color: #c4b8d8; font-size: 13px; line-height: 1; }
  .pill-remove:hover { color: #8b7aad; }

  /* Media preview thumbnails */
  .media-preview-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  .media-thumb {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 10px;
    border: 1.5px solid rgba(216,190,229,0.4);
  }
  .audio-preview-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(200,206,238,0.25);
    border: 1px solid rgba(200,206,238,0.5);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    color: #6a7aad;
    cursor: default;
  }
  .video-preview-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(252,220,225,0.25);
    border: 1px solid rgba(252,220,225,0.5);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    color: #ad6a7a;
    cursor: default;
  }

  .form-footer {
    border-top: 1px solid rgba(216,190,229,0.2);
    padding: 24px 48px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: rgba(248,244,252,0.4);
  }

  .cancel-btn {
    padding: 12px 24px;
    border-radius: 12px;
    border: 1.5px solid rgba(59, 10, 83, 0.4);
    background: transparent;
    color: #000000;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cancel-btn:hover { background: rgba(216,190,229,0.1); color: #8b7aad; }

  .submit-btn {
    padding: 12px 32px;
    border-radius: 12px;
    border: 1.5px solid rgba(59, 10, 83, 0.4);
    background: linear-gradient(135deg, #a7abde 100%, #a7abde 100%);
    color: #000000;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(167,171,222,0.35);
  }
  .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(167,171,222,0.5); }
  .submit-btn:active { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .success-banner {
    background: linear-gradient(135deg, rgba(216,190,229,0.25), rgba(200,206,238,0.2));
    border: 1px solid rgba(216,190,229,0.4);
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 24px;
    font-size: 13px;
    color: #7a6a9a;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }

  @media (max-width: 600px) {
    .form-header { padding: 24px 20px; }
    .form-body { padding: 24px 20px 32px; }
    .form-footer { padding: 20px; }
    .field-row { grid-template-columns: 1fr; gap: 6px; }
    .field-label { padding-top: 0; }
  }
`;

// Convert a File to { name, data (base64 dataURI), type }
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, data: reader.result, type: file.type });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function AddCapsule() {
  const navigate = useNavigate();
  const photoRef = useRef();
  const audioRef = useRef();
  const videoRef = useRef();

  const [form, setForm] = useState({ name: "", open_date: "", notes: "", letter: "" });
  const [photos, setPhotos] = useState([]); // [{name, data, type}]
  const [audios, setAudios] = useState([]);
  const [videos, setVideos] = useState([]);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addFiles = async (setter, e) => {
    const files = Array.from(e.target.files);
    const converted = await Promise.all(files.map(fileToBase64));
    setter(prev => [...prev, ...converted]);
  };

  const removeFile = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!form.name || !form.open_date) return;
    setUploading(true);

    const user = JSON.parse(localStorage.getItem("mv_user") || "{}");
    logger.info('AddCapsule', 'Submitting capsule', { name: form.name, email: user.email });

    const payload = {
      name: form.name,
      open_date: form.open_date,
      notes: form.notes,
      letter: form.letter,
      email: user.email,
      media: {
        images: photos,
        audio: audios,
        video: videos,
      },
    };

    const res = await fetch("http://localhost:5001/add_capsule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      logger.info('AddCapsule', 'Capsule created successfully', { name: form.name });
    } else {
      logger.error('AddCapsule', 'Capsule creation failed', res.status);
    }

    setUploading(false);
    setSuccess(true);
    setTimeout(() => navigate("/home/capsule"), 1600);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="add-root">
        <Navbar />
        <div className="add-content">
          <div className="bg-blob blob1" />
          <div className="bg-blob blob2" />
          <div className="bg-blob blob3" />

          <div className="form-shell">
            <div className="form-header">
              <div>
                <div className="form-title">New Time Capsule</div>
                <div className="form-tagline">Seal your memories</div>
              </div>
              <button className="back-btn" onClick={() => navigate("/home/capsule")}>← Back</button>
            </div>

            <div className="form-body">
              {success && (
                <div className="success-banner">
                  <Sparkles size={16} /> Capsule sealed! Redirecting you…
                </div>
              )}

              <div className="section-label">Capsule Details</div>

              <div className="field-row">
                <label className="field-label">Capsule Name <span className="required">*</span></label>
                <input className="field-input" name="name" placeholder="e.g. Summer 2025 Memories" value={form.name} onChange={handleChange} />
              </div>

              <div className="field-row">
                <label className="field-label">Date Created</label>
                <input className="field-input" type="date" value={today} disabled style={{ opacity: 0.5 }} />
              </div>

              <div className="field-row">
                <label className="field-label">Date to Open <span className="required">*</span></label>
                <input className="field-input" name="open_date" type="date" min={today} value={form.open_date} onChange={handleChange} />
              </div>

              <div className="section-label">Contents</div>

              <div className="field-row">
                <label className="field-label">Notes / Comments</label>
                <textarea className="field-textarea" name="notes" placeholder="Write anything you want to remember…" value={form.notes} onChange={handleChange} style={{ minHeight: 80 }} />
              </div>

              <div className="field-row">
                <label className="field-label">Letter to Future Self</label>
                <textarea className="field-textarea" name="letter" placeholder="Dear future me…" value={form.letter} onChange={handleChange} style={{ minHeight: 120 }} />
              </div>

              <div className="section-label">Media Attachments</div>

              {/* Photos */}
              <div className="field-row">
                <label className="field-label">Photos</label>
                <div>
                  <div className="upload-zone" onClick={() => photoRef.current.click()}>
                    <div className="upload-icon"><ImageIcon size={22} /></div>
                    <div className="upload-text"><strong>Click to add photos</strong><br />JPG, PNG, GIF</div>
                    <input ref={photoRef} type="file" accept="image/*" multiple hidden onChange={e => addFiles(setPhotos, e)} />
                  </div>
                  {photos.length > 0 && (
                    <div className="media-preview-grid">
                      {photos.map((f, i) => (
                        <div key={i} style={{ position: "relative" }}>
                          <img src={f.data} alt={f.name} className="media-thumb" />
                          <span
                            onClick={() => removeFile(setPhotos, i)}
                            style={{ position: "absolute", top: -6, right: -6, background: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, border: "1px solid #d8bee5", color: "#8b7aad" }}
                          >×</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Audio */}
              <div className="field-row">
                <label className="field-label">Audio</label>
                <div>
                  <div className="upload-zone" onClick={() => audioRef.current.click()}>
                    <div className="upload-icon"><Music size={22} /></div>
                    <div className="upload-text"><strong>Click to add audio</strong><br />MP3, WAV, M4A</div>
                    <input ref={audioRef} type="file" accept="audio/*" multiple hidden onChange={e => addFiles(setAudios, e)} />
                  </div>
                  {audios.length > 0 && (
                    <div className="file-pills" style={{ marginTop: 10 }}>
                      {audios.map((f, i) => (
                        <div className="audio-preview-pill" key={i}>
                          <Music size={14} style={{ marginRight: 4 }} /> {f.name.length > 22 ? f.name.slice(0, 20) + "…" : f.name}
                          <span className="pill-remove" onClick={() => removeFile(setAudios, i)}>×</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="field-row">
                <label className="field-label">Video</label>
                <div>
                  <div className="upload-zone" onClick={() => videoRef.current.click()}>
                    <div className="upload-icon"><Film size={22} /></div>
                    <div className="upload-text"><strong>Click to add video</strong><br />MP4, MOV, AVI</div>
                    <input ref={videoRef} type="file" accept="video/*" multiple hidden onChange={e => addFiles(setVideos, e)} />
                  </div>
                  {videos.length > 0 && (
                    <div className="file-pills" style={{ marginTop: 10 }}>
                      {videos.map((f, i) => (
                        <div className="video-preview-pill" key={i}>
                          <Film size={14} style={{ marginRight: 4 }} /> {f.name.length > 22 ? f.name.slice(0, 20) + "…" : f.name}
                          <span className="pill-remove" onClick={() => removeFile(setVideos, i)}>×</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button className="cancel-btn" onClick={() => navigate("/home/capsule")}>Cancel</button>
              <button className="submit-btn" onClick={handleSubmit} disabled={uploading || success}>
                {uploading ? "Sealing…" : <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Seal Capsule</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCapsule;