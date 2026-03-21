import React, { useState, useEffect } from "react";
import { Plus, Baby, Star } from "lucide-react";
import Navbar from "./Navbar";
import AddEventModal from "./AddEventModal";
import { getEvents, addEvent } from "../services/timelineService";
import "./Timeline.css";

// Formats an ISO date string to "dd-mm-yyyy"
const formatDate = (isoDate) => {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Card color variants cycle through palette
const COLOR_COUNT = 6;

function Timeline() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("mv_user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      initializeTimeline(parsedUser);
    }
  }, []);

  const initializeTimeline = (parsedUser) => {
    const existing = getEvents(parsedUser.email);

    // If no DOB event exists yet, auto-insert it
    const hasDobEvent = existing.some((e) => e.is_dob);
    if (!hasDobEvent && parsedUser.dob) {
      const dobEvent = {
        id: `dob_${parsedUser.email}`,
        event_name: "Date of Birth",
        date: new Date(parsedUser.dob).toISOString(),
        notes: `Welcome to your life story, ${parsedUser.name || ""}! 🌟`,
        media: { images: [], audio: [], video: [] },
        is_dob: true,
      };
      const updated = addEvent(parsedUser.email, dobEvent);
      setEvents(updated);
    } else {
      setEvents(existing);
    }
  };

  const handleAddEvent = (newEvent) => {
    if (!user) return;
    const updated = addEvent(user.email, newEvent);
    setEvents(updated);
  };

  const renderMediaInCard = (media) => {
    if (!media) return null;
    const hasMedia =
      media.images?.length > 0 ||
      media.audio?.length > 0 ||
      media.video?.length > 0;
    if (!hasMedia) return null;

    return (
      <div className="card-media">
        {media.images?.length > 0 && (
          <div className="card-media-images">
            {media.images.slice(0, 3).map((img, i) => (
              <img key={i} src={img.data} alt={img.name} className="card-thumb" title={img.name} />
            ))}
          </div>
        )}
        {media.audio?.map((a, i) => (
          <audio key={i} controls className="card-audio-player" src={a.data} />
        ))}
        {media.video?.slice(0, 1).map((v, i) => (
          <video key={i} controls className="card-video-player" src={v.data} />
        ))}
      </div>
    );
  };

  return (
    <div className="timeline-page">
      <Navbar />
      <div className="timeline-content">
        {/* Page Header */}
        <div className="timeline-header">
          <div className="timeline-title-group">
            <h1>My Timeline</h1>
            <p>A journey through your most precious moments</p>
          </div>
          <button className="add-event-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Add Event
          </button>
        </div>

        {/* No user warning */}
        {!user && (
          <div className="timeline-empty">
            <p>Please log in to view your timeline.</p>
          </div>
        )}

        {/* Timeline Track */}
        {user && (
          <div className="timeline-outer">
            <div className="timeline-track">
              {events.map((event, index) => {
                const isAbove = index % 2 === 0;
                const colorClass = event.is_dob ? "card-dob" : `card-color-${index % COLOR_COUNT}`;

                return (
                  <div
                    key={event.id}
                    className={`timeline-item ${isAbove ? "above" : "below"}`}
                  >
                    {/* Card (above or below based on index parity) */}
                    <div className={`event-card ${colorClass}`}>
                      {event.is_dob && <span className="dob-badge">Date of Birth</span>}
                      <div className="card-date">{formatDate(event.date)}</div>
                      <h3 className="card-name">{event.event_name}</h3>
                      {event.notes && <p className="card-notes">{event.notes}</p>}
                      {renderMediaInCard(event.media)}
                    </div>

                    {/* Connector between card and node */}
                    <div className="card-connector" />

                    {/* Node circle on the line */}
                    <div className={`timeline-node ${event.is_dob ? "node-dob" : "node-default"}`}>
                      {event.is_dob ? <Baby size={22} /> : <Star size={18} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEvent}
        userDob={user?.dob}
      />
    </div>
  );
}

export default Timeline;
