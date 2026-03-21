// timelineService.js
// LocalStorage adapter for timeline events.
// Designed for easy migration to MongoDB - just swap the implementation
// of these functions to API calls, keeping the same interface.

const EVENTS_KEY_PREFIX = "mv_timeline_";

/**
 * Get the localStorage key for a specific user's events.
 * MongoDB equivalent: collection key / user_id filter.
 */
const getUserKey = (userEmail) => `${EVENTS_KEY_PREFIX}${userEmail}`;

/**
 * Fetch all events for a user, sorted chronologically.
 * MongoDB equivalent: db.events.find({ user_email }).sort({ date: 1 })
 */
export const getEvents = (userEmail) => {
  if (!userEmail) return [];
  const raw = localStorage.getItem(getUserKey(userEmail));
  const events = raw ? JSON.parse(raw) : [];
  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Save a new event for a user.
 * MongoDB equivalent: db.events.insertOne({ ...event, user_email })
 */
export const addEvent = (userEmail, event) => {
  const events = getEvents(userEmail);

  // Prevent duplicate IDs
  const exists = events.find((e) => e.id === event.id);
  if (exists) return events;

  events.push(event);
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem(getUserKey(userEmail), JSON.stringify(events));
  return events;
};

/**
 * Delete an event by ID.
 * MongoDB equivalent: db.events.deleteOne({ id, user_email })
 */
export const deleteEvent = (userEmail, eventId) => {
  const events = getEvents(userEmail).filter((e) => e.id !== eventId);
  localStorage.setItem(getUserKey(userEmail), JSON.stringify(events));
  return events;
};

/**
 * Clear all events for a user (useful for testing).
 * MongoDB equivalent: db.events.deleteMany({ user_email })
 */
export const clearEvents = (userEmail) => {
  localStorage.removeItem(getUserKey(userEmail));
};
