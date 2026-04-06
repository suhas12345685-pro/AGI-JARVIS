// brain/context/decisionLayer.js
const path = require('path');
const context = require('../sensors/contextStore');
const outbound = require('../../shared/outbound');
const logger = require('../../shared/logger');

const _cooldowns = {};

function onCooldown(key, ms) {
  const now = Date.now();
  if (_cooldowns[key] && now - _cooldowns[key] < ms) return true;
  _cooldowns[key] = now;
  return false;
}

function looksLikeCode(text) {
  if (!text || text.length < 20) return false;
  return /function |const |let |var |def |class |import |=>|\{|\}|<\//.test(text);
}

context.on('contextChanged', async (key, state) => {
  try {
    if (key === 'system') {
      const { cpu } = state.system;
      if (cpu > 90 && !onCooldown('cpu_warn', 60000)) {
        await outbound.broadcast(`CPU is at ${cpu}%, sir — something may be thrashing. Want me to check what's running?`);
      }
    }

    if (key === 'screen') {
      const desc = state.screen.description || '';
      if (/error|exception|failed|undefined is not/i.test(desc) && !onCooldown('screen_err', 30000)) {
        await outbound.broadcast(`Looks like there's an error on screen, sir. Want me to help debug it?`);
      }
    }

    if (key === 'files') {
      const latest = state.files.recent[0];
      if (latest && /\.(zip|exe|dmg|msi)$/i.test(latest) && !onCooldown('new_file', 5000)) {
        const name = path.basename(latest);
        await outbound.broadcast(`New file: ${name}. Want me to inspect or unpack it?`);
      }
    }

    if (key === 'clipboard') {
      if (looksLikeCode(state.clipboard.content)) {
        // Silent — context is ready, JARVIS uses it on next voice trigger
        logger.info('Clipboard: code detected, context updated silently');
      }
    }
    // window, mic, webcam, location: always silent — just context updates
  } catch (err) {
    logger.warn(`DecisionLayer error: ${err.message}`);
  }
});

module.exports = {};
