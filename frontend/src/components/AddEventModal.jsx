import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Music, Film, Baby, CalendarDays, StickyNote } from "lucide-react";
import "./AddEventModal.css";

const AddEventModal = ({ isOpen, onClose, onAdd, userDob }) => {
  const [form, setForm] = useState({
    event_name: "",
    date: "",
    notes: "",
  });
  const [images, setImages] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({ event_name: "", date: "", notes: "" });
      setImages([]);
      setAudioFiles([]);
      setVideoFiles([]);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];
  const minDate = userDob ? new Date(userDob).toISOString().split("T")[0] : undefined;

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, data: reader.result, type: file.type });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e, setter) => {
    const files = Array.from(e.target.files);
    const converted = await Promise.all(files.map(fileToBase64));
    setter((prev) => [...prev, ...converted]);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.event_name.trim()) newErrors.event_name = "Event name is required.";
    if (!form.date) {
      newErrors.date = "Date is required.";
    } else {
      const selectedDate = new Date(form.date);
      const dobDate = userDob ? new Date(userDob) : null;
      const todayDate = new Date(today);
      if (dobDate && selectedDate < dobDate) {
        newErrors.date = "Date cannot be before your date of birth.";
      }
      if (selectedDate > todayDate) {
        newErrors.date = "Date cannot be in the future.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event_name: form.event_name.trim(),
      date: new Date(form.date).toISOString(),
      notes: form.notes.trim(),
      media: {
        images: images,
        audio: audioFiles,
        video: videoFiles,
      },
      is_dob: false,
    };

    onAdd(newEvent);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Event</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Event Name */}
          <div className="form-group">
            <label>
              <CalendarDays size={16} />
              Event Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. First day at school"
              value={form.event_name}
              onChange={(e) => setForm({ ...form, event_name: e.target.value })}
              className={errors.event_name ? "input-error" : ""}
            />
            {errors.event_name && <p className="error-msg">{errors.event_name}</p>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label>
              <CalendarDays size={16} />
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              min={minDate}
              max={today}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={errors.date ? "input-error" : ""}
            />
            {errors.date && <p className="error-msg">{errors.date}</p>}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>
              <StickyNote size={16} />
              Notes / Comments <span className="optional">(optional)</span>
            </label>
            <textarea
              placeholder="Add any details or memories..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Media Section */}
          <div className="media-section">
            <p className="media-title">
              <Upload size={15} /> Media Attachments <span className="optional">(optional)</span>
            </p>
            <div className="media-upload-row">
              {/* Images */}
              <label className="upload-btn upload-image">
                <ImageIcon size={16} /> Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => handleFileChange(e, setImages)}
                />
              </label>
              {/* Audio */}
              <label className="upload-btn upload-audio">
                <Music size={16} /> Audio
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  hidden
                  onChange={(e) => handleFileChange(e, setAudioFiles)}
                />
              </label>
              {/* Video */}
              <label className="upload-btn upload-video">
                <Film size={16} /> Video
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  hidden
                  onChange={(e) => handleFileChange(e, setVideoFiles)}
                />
              </label>
            </div>

            {/* Previews */}
            {images.length > 0 && (
              <div className="preview-row">
                {images.map((img, i) => (
                  <img key={i} src={img.data} alt={img.name} className="preview-img" title={img.name} />
                ))}
              </div>
            )}
            {audioFiles.length > 0 && (
              <div className="preview-row">
                {audioFiles.map((a, i) => (
                  <div key={i} className="preview-audio">
                    <Music size={14} />
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            )}
            {videoFiles.length > 0 && (
              <div className="preview-row">
                {videoFiles.map((v, i) => (
                  <div key={i} className="preview-video-label">
                    <Film size={14} />
                    <span>{v.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-add">
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
