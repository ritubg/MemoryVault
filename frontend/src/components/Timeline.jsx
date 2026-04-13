import React, { useState, useEffect, useRef } from "react";
import { Plus, Baby, Star, Image as ImageIcon, Music, Film, FileText, Maximize2 } from "lucide-react";
import Navbar from "./Navbar";
import AddEventModal from "./AddEventModal";
import EventDetailsModal from "./EventDetailsModal";
import { getEvents, addEvent } from "../services/timelineService";
import logger from "../services/logger";
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
  const [viewingEvent, setViewingEvent] = useState(null);
  const [user, setUser] = useState(null);

  const initialized = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("mv_user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      
      if (!initialized.current) {
        initialized.current = true;
        initializeTimeline(parsedUser);
      }
    }
  }, []);

  const initializeTimeline = async (parsedUser) => {
    logger.info('Timeline', 'Loading events', { email: parsedUser.email });
    const existing = await getEvents(parsedUser.email);

    // If no DOB event exists yet, auto-insert it
    const hasDobEvent = existing.some((e) => e.is_dob);
    if (!hasDobEvent && parsedUser.dob) {
      logger.info('Timeline', 'Inserting DOB event', { email: parsedUser.email });
      const dobEvent = {
        id: `dob_${parsedUser.email}`,
        event_name: "Date of Birth",
        date: new Date(parsedUser.dob).toISOString(),
        notes: `Welcome to your life story, ${parsedUser.name || ""}!`,
        media: { images: [], audio: [], video: [] },
        is_dob: true,
      };
      const updated = await addEvent(parsedUser.email, dobEvent);
      setEvents(updated);
    } else {
      logger.info('Timeline', 'Events loaded', { count: existing.length });
      setEvents(existing);
    }
  };

  const handleAddEvent = async (newEvent) => {
    if (!user) return;
    logger.info('Timeline', 'Adding event', { email: user.email, event: newEvent.event_name });
    const updated = await addEvent(user.email, newEvent);
    logger.info('Timeline', 'Event added', { total: updated.length });
    setEvents(updated);
  };

  const renderMediaInCard = (media, notes) => {
    const hasImages = media?.images?.length > 0;
    const hasAudio = media?.audio?.length > 0;
    const hasVideo = media?.video?.length > 0;
    const hasNotes = !!notes;

    if (!hasImages && !hasAudio && !hasVideo && !hasNotes) return null;

    return (
      <div className="card-indicators">
        {hasNotes && <span className="indicator-icon" title="Has notes"><FileText size={14} /></span>}
        {hasImages && <span className="indicator-pill"><ImageIcon size={13} /> {media.images.length}</span>}
        {hasAudio && <span className="indicator-pill"><Music size={13} /> {media.audio.length}</span>}
        {hasVideo && <span className="indicator-pill"><Film size={13} /> {media.video.length}</span>}
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
                    <div className={`event-card ${colorClass}`} onClick={() => setViewingEvent(event)}>
                      <div className="card-hover-icon"><Maximize2 size={16} /></div>
                      {event.is_dob && <span className="dob-badge">Date of Birth</span>}
                      <div className="card-date">{formatDate(event.date)}</div>
                      <h3 className="card-name">{event.event_name}</h3>
                      {renderMediaInCard(event.media, event.notes)}
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

      {/* View Event Details Modal */}
      <EventDetailsModal
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(null)}
        event={viewingEvent}
      />
    </div>
  );
}

export default Timeline;
