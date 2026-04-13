// timelineService.js
// Backend API adapter for timeline events (MongoDB via Flask backend).

import logger from './logger';

const API_URL = "http://127.0.0.1:5001/api/events";

/**
 * Fetch all events for a user, sorted chronologically.
 */
export const getEvents = async (userEmail) => {
  if (!userEmail) return [];
  try {
    const res = await fetch(`${API_URL}/${userEmail}`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    const events = data.events || [];
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (err) {
    logger.error('timelineService', 'Error fetching events', err.message);
    return [];
  }
};

/**
 * Save a new event for a user.
 */
export const addEvent = async (userEmail, event) => {
  try {
    const res = await fetch(`${API_URL}/${userEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      logger.error('timelineService', 'Failed to add event (non-ok response)', res.status);
    }
  } catch (err) {
    logger.error('timelineService', 'Error adding event', err.message);
  }
  return await getEvents(userEmail);
};

/**
 * Delete an event by ID.
 */
export const deleteEvent = async (userEmail, eventId) => {
  try {
    const res = await fetch(`${API_URL}/${userEmail}/${eventId}`, {
      method: "DELETE",
    });
    if (!res.ok) logger.error('timelineService', 'Failed to delete event (non-ok response)', res.status);
  } catch (err) {
    logger.error('timelineService', 'Error deleting event', err.message);
  }
  return await getEvents(userEmail);
};

/**
 * Clear all events for a user.
 */
export const clearEvents = async (_userEmail) => {
  logger.warn('timelineService', 'clearEvents not fully implemented on server yet');
};
