const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../../shared/logger');

class LongTermMemory {
  constructor() {
    const dbPath = path.resolve(process.env.SQLITE_PATH || './memory/long/jarvis.db');
    this.db = new Database(dbPath);
    this.init();
    logger.info(`Long-term memory (SQLite) loaded: ${dbPath}`);
  }

  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memory (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     TEXT    NOT NULL DEFAULT 'user',
        category    TEXT    NOT NULL,
        key         TEXT    NOT NULL,
        value       TEXT    NOT NULL,
        confidence  REAL    DEFAULT 1.0,
        source      TEXT    DEFAULT 'inferred',
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     TEXT    NOT NULL DEFAULT 'user',
        description TEXT    NOT NULL,
        timestamp   INTEGER NOT NULL,
        importance  INTEGER DEFAULT 3
      );

      CREATE TABLE IF NOT EXISTS payment_audit (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     TEXT    NOT NULL DEFAULT 'user',
        amount      REAL    NOT NULL,
        recipient   TEXT    NOT NULL,
        method      TEXT    NOT NULL,
        status      TEXT    NOT NULL,
        reference   TEXT,
        timestamp   INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_memory_key ON memory(key);
      CREATE INDEX IF NOT EXISTS idx_memory_category ON memory(category);
      CREATE INDEX IF NOT EXISTS idx_memory_user ON memory(user_id);
    `);
  }

  set(userId, category, key, value, source = 'inferred') {
    const now = Date.now();
    const existing = this.get(userId, key);
    if (existing) {
      this.db.prepare(`
        UPDATE memory SET value=?, updated_at=?, source=?
        WHERE user_id=? AND key=?
      `).run(value, now, source, userId, key);
    } else {
      this.db.prepare(`
        INSERT INTO memory (user_id, category, key, value, source, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(userId, category, key, value, source, now, now);
    }
  }

  get(userId, key) {
    return this.db.prepare(
      'SELECT * FROM memory WHERE user_id=? AND key=?'
    ).get(userId, key);
  }

  getByCategory(userId, category) {
    return this.db.prepare(
      'SELECT * FROM memory WHERE user_id=? AND category=?'
    ).all(userId, category);
  }

  getSummary(userId) {
    const rows = this.db.prepare(
      'SELECT category, key, value FROM memory WHERE user_id=? ORDER BY updated_at DESC LIMIT 50'
    ).all(userId);
    return rows.map(r => `[${r.category}] ${r.key}: ${r.value}`).join('\n');
  }
}

module.exports = new LongTermMemory();
