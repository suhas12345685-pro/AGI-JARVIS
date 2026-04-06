// brain/sensors/micSensor.js
const context = require('./contextStore');

function onTranscript(text) {
  if (text) context.update('mic', { transcript: text });
}

module.exports = { onTranscript };
