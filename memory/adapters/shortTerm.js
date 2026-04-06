const { createClient } = require('redis');
const logger = require('../../shared/logger');

class ShortTermMemory {
  constructor() {
    this.client = null;
    this.maxExchanges = 20;
    this.connected = false;
  }

  async connect() {
    if (this.connected) return;
    try {
      this.client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
      this.client.on('error', (err) => logger.warn(`Redis error: ${err.message}`));
      await this.client.connect();
      this.connected = true;
      logger.info('Short-term memory (Redis) connected');
    } catch (err) {
      logger.warn(`Redis connection failed: ${err.message}. Short-term memory disabled.`);
    }
  }

  async addExchange(userId, exchange) {
    if (!this.connected) return;
    const key = `session:${userId}`;
    const existing = await this.get(userId);
    existing.push({ ...exchange, timestamp: Date.now() });
    const trimmed = existing.slice(-this.maxExchanges);
    await this.client.setEx(key, 86400, JSON.stringify(trimmed));
  }

  async get(userId) {
    if (!this.connected) return [];
    const data = await this.client.get(`session:${userId}`);
    return data ? JSON.parse(data) : [];
  }

  async clear(userId) {
    if (!this.connected) return;
    await this.client.del(`session:${userId}`);
  }
}

module.exports = new ShortTermMemory();
