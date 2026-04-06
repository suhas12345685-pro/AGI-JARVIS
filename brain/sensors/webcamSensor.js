// brain/sensors/webcamSensor.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const context = require('./contextStore');
const logger = require('../../shared/logger');

let cam = null;
try {
  const NodeWebcam = require('node-webcam');
  cam = NodeWebcam.create({ width: 640, height: 480, quality: 75,
    output: 'jpeg', callbackReturn: 'location', verbose: false });
} catch {
  logger.warn('node-webcam unavailable. Webcam sensor disabled.');
  module.exports = {};
  return;
}

const tmpPath = path.join(os.tmpdir(), 'jarvis_webcam');
let _lastHash = null;

async function describeWebcam(buf) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const { Anthropic } = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', max_tokens: 150,
      messages: [{
        role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: buf.toString('base64') } },
          { type: 'text', text: 'Is the user present? What are they doing? One sentence.' }
        ]
      }]
    });
    return res.content[0].text;
  } catch { return null; }
}

async function checkWebcam() {
  return new Promise(resolve => {
    cam.capture(tmpPath, async (err, loc) => {
      if (err) { resolve(); return; }
      try {
        const filePath = loc.endsWith('.jpg') ? loc : loc + '.jpg';
        if (!fs.existsSync(filePath)) { resolve(); return; }
        const buf = fs.readFileSync(filePath);
        const hash = crypto.createHash('md5').update(buf).digest('hex');
        if (hash === _lastHash) { resolve(); return; }
        _lastHash = hash;
        const description = await describeWebcam(buf);
        if (description) context.update('webcam', { description });
      } catch { /* ignore */ }
      resolve();
    });
  });
}

setInterval(checkWebcam, 10000);
module.exports = {};
