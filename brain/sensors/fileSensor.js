// brain/sensors/fileSensor.js
const chokidar = require('chokidar');
const path = require('path');
const os = require('os');
const context = require('./contextStore');
const logger = require('../../shared/logger');

const watched = [
  path.join(os.homedir(), 'Downloads'),
  path.join(os.homedir(), 'Desktop'),
  path.join(os.homedir(), 'Documents'),
];

chokidar.watch(watched, { ignoreInitial: true, depth: 0 }).on('add', filePath => {
  const prev = context.state.files.recent;
  context.update('files', { recent: [filePath, ...prev].slice(0, 10) });
  logger.info(`New file detected: ${filePath}`);
});

module.exports = {};
