import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .add-root {
    min-height: 100vh;
    background: #faf7fc;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px 60px;
    position: relative;
    overflow: hidden;
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
    color: #4a3f6b;
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
    color: #8b7aad;
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
    color: #c4b8d8;
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
    color: #7a6a9a;
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
    border: 1.5px solid rgba(216,190,229,0.4);
    background: transparent;
    color: #b0a0cc;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cancel-btn:hover { background: rgba(216,190,229,0.1); color: #8b7aad; }

  .submit-btn {
    padding: 12px 32px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #d8bee5 0%, #a7abde 100%);
    color: #fff;
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

function AddCapsule() {
  const navigate = useNavigate();
  const photoRef = useRef();
  const audioRef = useRef();
  const videoRef = useRef();

  const [form, setForm] = useState({
    name: "",
    open_date: "",
    notes: "",
    letter: ""
  });
  const [photos, setPhotos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [videos, setVideos] = useState([]);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addFiles = (setter, e) => {
    const files = Array.from(e.target.files);
    setter(prev => [...prev, ...files]);
  };

  const removeFile = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("open_date", form.open_date);
    formData.append("notes", form.notes);
    formData.append("letter", form.letter);
    formData.append("email", localStorage.getItem("email"));
    photos.forEach(f => formData.append("photos", f));
    audios.forEach(f => formData.append("audios", f));
    videos.forEach(f => formData.append("videos", f));

    await fetch("http://127.0.0.1:5000/add_capsule", { method: "POST", body: formData });
    setSuccess(true);
    setTimeout(() => navigate("/Capsule"), 1600);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="add-root">
        <div className="bg-blob blob1" />
        <div className="bg-blob blob2" />
        <div className="bg-blob blob3" />

        <div className="form-shell">
          <div className="form-header">
            <span className="header-icon">✦</span>
            <div>
              <div className="form-title">New Time Capsule</div>
              <div className="form-tagline">Seal your memories · They'll be waiting</div>
            </div>
            <button className="back-btn" onClick={() => navigate("/Capsule")}>← Back</button>
          </div>

          <div className="form-body">
            {success && (
              <div className="success-banner">
                <span>✨</span> Capsule sealed! Redirecting you…
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
              <label className="field-label">Letter</label>
              <textarea className="field-textarea" name="letter" placeholder="Dear future me…" value={form.letter} onChange={handleChange} style={{ minHeight: 120 }} />
            </div>

            <div className="section-label">Media Attachments</div>

            <div className="field-row">
              <label className="field-label">Photos</label>
              <div>
                <div className="upload-zone" onClick={() => photoRef.current.click()}>
                  <div className="upload-icon">🖼</div>
                  <div className="upload-text"><strong>Click to add photos</strong><br />JPG, PNG, GIF</div>
                  <input ref={photoRef} type="file" accept="image/*" multiple hidden onChange={e => addFiles(setPhotos, e)} />
                </div>
                {photos.length > 0 && (
                  <div className="file-pills">
                    {photos.map((f, i) => (
                      <div className="file-pill" key={i}>
                        🖼 {f.name.length > 20 ? f.name.slice(0, 18) + "…" : f.name}
                        <span className="pill-remove" onClick={() => removeFile(setPhotos, i)}>×</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="field-row">
              <label className="field-label">Audio</label>
              <div>
                <div className="upload-zone" onClick={() => audioRef.current.click()}>
                  <div className="upload-icon">🎵</div>
                  <div className="upload-text"><strong>Click to add audio</strong><br />MP3, WAV, M4A</div>
                  <input ref={audioRef} type="file" accept="audio/*" multiple hidden onChange={e => addFiles(setAudios, e)} />
                </div>
                {audios.length > 0 && (
                  <div className="file-pills">
                    {audios.map((f, i) => (
                      <div className="file-pill" key={i}>
                        🎵 {f.name.length > 20 ? f.name.slice(0, 18) + "…" : f.name}
                        <span className="pill-remove" onClick={() => removeFile(setAudios, i)}>×</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="field-row">
              <label className="field-label">Video</label>
              <div>
                <div className="upload-zone" onClick={() => videoRef.current.click()}>
                  <div className="upload-icon">🎬</div>
                  <div className="upload-text"><strong>Click to add video</strong><br />MP4, MOV, AVI</div>
                  <input ref={videoRef} type="file" accept="video/*" multiple hidden onChange={e => addFiles(setVideos, e)} />
                </div>
                {videos.length > 0 && (
                  <div className="file-pills">
                    {videos.map((f, i) => (
                      <div className="file-pill" key={i}>
                        🎬 {f.name.length > 20 ? f.name.slice(0, 18) + "…" : f.name}
                        <span className="pill-remove" onClick={() => removeFile(setVideos, i)}>×</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button className="cancel-btn" onClick={() => navigate("/Capsule")}>Cancel</button>
            <button className="submit-btn" onClick={handleSubmit}>✦ Seal Capsule</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCapsule;