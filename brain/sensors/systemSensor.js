// brain/sensors/systemSensor.js
const si = require('systeminformation');
const context = require('./contextStore');
const logger = require('../../shared/logger');

async function checkSystem() {
  try {
    const [load, mem] = await Promise.all([si.currentLoad(), si.mem()]);
    const cpu = Math.round(load.currentLoad);
    const ram = Math.round((1 - mem.available / mem.total) * 100);
    const prev = context.state.system;
    if (Math.abs(cpu - prev.cpu) > 10 || Math.abs(ram - prev.ram) > 10) {
      context.update('system', { cpu, ram });
    }
  } catch (err) {
    logger.warn(`System sensor error: ${err.message}`);
  }
}

checkSystem();
setInterval(checkSystem, 5000);
module.exports = {};
