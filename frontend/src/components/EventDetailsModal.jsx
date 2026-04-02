import React, { useState } from "react";
import { X, Image as ImageIcon, Music, Film, Calendar, FileText } from "lucide-react";
import "./EventDetailsModal.css";

// Formats an ISO date string to "Month Day, Year"
const formatLongDate = (isoDate) => {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

function EventDetailsModal({ isOpen, onClose, event }) {
  const [lightboxSrc, setLightboxSrc] = useState(null);

  if (!isOpen || !event) return null;

  const hasImages = event.media?.images?.length > 0;
  const hasAudio = event.media?.audio?.length > 0;
  const hasVideo = event.media?.video?.length > 0;

  return (
    <>
      {lightboxSrc && (
        <div className="event-lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="event-lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <img src={lightboxSrc} alt="Full size" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="event-details-overlay" onClick={(e) => {
        if (e.target.className === "event-details-overlay") onClose();
      }}>
        <div className="event-details-modal">
          <button className="event-modal-close" onClick={onClose}><X size={20} /></button>
          
          <div className="event-modal-header">
            {event.is_dob && <div className="event-dob-badge">Date of Birth</div>}
            <h2 className="event-modal-title">{event.event_name}</h2>
            <div className="event-modal-date">
              <Calendar size={16} /> <span>{formatLongDate(event.date)}</span>
            </div>
          </div>

          <div className="event-modal-body">
            {event.notes && (
              <div className="event-modal-section">
                <div className="event-section-label">
                  <FileText size={16} /> Notes
                </div>
                <div className="event-notes-content">{event.notes}</div>
              </div>
            )}

            {(hasImages || hasAudio || hasVideo) && (
              <div className="event-modal-section">
                <div className="event-section-label" style={{ marginTop: "1rem" }}>
                  <ImageIcon size={16} /> Media
                </div>
                
                {hasImages && (
                  <div className="event-media-grid">
                    {event.media.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img.data || img} 
                        alt={img.name || `Photo ${i+1}`}
                        className="event-media-photo"
                        onClick={() => setLightboxSrc(img.data || img)}
                      />
                    ))}
                  </div>
                )}

                {hasAudio && (
                  <div className="event-media-audio-list">
                    {event.media.audio.map((a, i) => (
                      <div className="event-audio-wrapper" key={i}>
                        <span><Music size={14} style={{ marginRight: 6 }} /> {a.name || `Audio ${i+1}`}</span>
                        <audio controls src={a.data || a} />
                      </div>
                    ))}
                  </div>
                )}

                {hasVideo && (
                  <div className="event-media-video-list">
                    {event.media.video.map((v, i) => (
                      <video key={i} controls src={v.data || v} className="event-video-player" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetailsModal;
