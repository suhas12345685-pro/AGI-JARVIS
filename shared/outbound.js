const logger = require('./logger');

class OutboundChannel {
  constructor() {
    // Map of userId → [{ source, send(message) }]
    this.channels = new Map();
  }

  register(userId, source, sendFn) {
    if (!this.channels.has(userId)) {
      this.channels.set(userId, []);
    }
    const existing = this.channels.get(userId);
    // Avoid duplicate registrations for same source
    const idx = existing.findIndex(c => c.source === source);
    if (idx >= 0) {
      existing[idx].send = sendFn;
    } else {
      existing.push({ source, send: sendFn });
    }
    logger.info(`Outbound channel registered: ${source} for user ${userId}`);
  }

  async push(userId, message) {
    const channels = this.channels.get(userId);
    if (!channels || channels.length === 0) {
      logger.warn(`No outbound channel for user ${userId}. Message dropped: "${message}"`);
      return false;
    }
    let sent = false;
    for (const ch of channels) {
      try {
        await ch.send(message);
        logger.info(`Proactive push via ${ch.source} to ${userId}: "${message.slice(0, 80)}"`);
        sent = true;
        break; // Send via first available channel
      } catch (err) {
        logger.warn(`Outbound push failed via ${ch.source}: ${err.message}`);
      }
    }
    return sent;
  }

  async broadcast(message) {
    for (const [userId] of this.channels) {
      await this.push(userId, message);
    }
  }

  hasChannel(userId) {
    const channels = this.channels.get(userId);
    return channels && channels.length > 0;
  }
}

module.exports = new OutboundChannel();
