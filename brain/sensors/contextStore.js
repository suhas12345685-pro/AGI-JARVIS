// brain/sensors/contextStore.js
const { EventEmitter } = require('events');

class ContextStore extends EventEmitter {
  constructor() {
    super();
    this.state = {
      mic:       { transcript: null, ts: null },
      screen:    { description: null, app: null, title: null, ts: null },
      webcam:    { description: null, ts: null },
      location:  { city: null, country: null, time: null, ts: null },
      window:    { app: null, title: null, ts: null },
      system:    { cpu: 0, ram: 0, ts: null },
      clipboard: { content: null, ts: null },
      files:     { recent: [], ts: null },
    };
  }

  update(key, data) {
    this.state[key] = { ...this.state[key], ...data, ts: Date.now() };
    if (process.env.DEBUG) console.log(`[context] ${key} updated`);
    this.emit('contextChanged', key, this.state);
  }

  snapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }
}

module.exports = new ContextStore();
