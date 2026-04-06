const logger = require('../../shared/logger');

// Calendar integration placeholder
// In production, connect to Google Calendar API or local calendar store

const events = [];

async function read(params) {
  const now = Date.now();
  const upcoming = events.filter(e => e.startTime > now);
  return JSON.stringify(upcoming);
}

async function getUpcoming(minutesAhead = 60) {
  const now = Date.now();
  const cutoff = now + minutesAhead * 60 * 1000;
  return events.filter(e => e.startTime > now && e.startTime <= cutoff);
}

function addEvent(event) {
  events.push({
    title: event.title,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location || '',
  });
  logger.info(`Calendar event added: ${event.title}`);
}

module.exports = { read, getUpcoming, addEvent };
