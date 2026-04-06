const logger = require('../../shared/logger');

// WebSocket-based push notification to phone app
let phoneSocket = null;

function setSocket(ws) {
  phoneSocket = ws;
  logger.info('Phone connected via WebSocket');
}

async function send(data) {
  if (!phoneSocket || phoneSocket.readyState !== 1) {
    logger.warn('Phone not connected. Push notification queued.');
    return false;
  }

  const payload = typeof data === 'string'
    ? { type: 'notification', message: data }
    : data;

  phoneSocket.send(JSON.stringify(payload));
  logger.info(`Push sent to phone: ${payload.type || 'notification'}`);
  return true;
}

module.exports = { setSocket, send };
