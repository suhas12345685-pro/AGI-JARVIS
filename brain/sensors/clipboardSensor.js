// brain/sensors/clipboardSensor.js
const context = require('./contextStore');
let _last = null;

async function checkClipboard() {
  try {
    const { default: clipboard } = await import('clipboardy');
    const content = await clipboard.read();
    if (content !== _last) {
      _last = content;
      context.update('clipboard', { content });
    }
  } catch { /* clipboard locked or empty — ignore */ }
}

setInterval(checkClipboard, 1000);
module.exports = {};
