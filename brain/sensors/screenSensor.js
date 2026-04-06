// brain/sensors/screenSensor.js
const activeWin = require('active-win');
const screenshot = require('screenshot-desktop');
const { Anthropic } = require('@anthropic-ai/sdk');
const context = require('./contextStore');
const logger = require('../../shared/logger');

let _lastTitle = null;
let _client = null;

function getClient() {
  if (!_client && process.env.ANTHROPIC_API_KEY) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

async function describeScreen(imgBuffer) {
  const client = getClient();
  if (!client) return 'Vision unavailable (no ANTHROPIC_API_KEY)';
  try {
    const res = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: imgBuffer.toString('base64') }
          },
          { type: 'text', text: 'Describe what is on this screen in 1-2 sentences. Focus on what the user is doing.' }
        ]
      }]
    });
    return res.content[0].text;
  } catch (err) {
    return `Vision error: ${err.message}`;
  }
}

async function checkWindow() {
  try {
    const win = await activeWin();
    if (!win || win.title === _lastTitle) return;
    _lastTitle = win.title;

    context.update('window', { app: win.owner.name, title: win.title });
    logger.info(`Active window: ${win.owner.name} — ${win.title}`);

    try {
      const img = await screenshot({ format: 'png' });
      const description = await describeScreen(img);
      context.update('screen', { description, app: win.owner.name, title: win.title });
      logger.info(`Screen: ${description.slice(0, 80)}`);
    } catch (err) {
      logger.warn(`Screenshot failed: ${err.message}`);
    }
  } catch (err) {
    logger.warn(`Window sensor error: ${err.message}`);
  }
}

setInterval(checkWindow, 2000);
module.exports = {};
