// brain/sensors/locationSensor.js
const axios = require('axios');
const context = require('./contextStore');
const logger = require('../../shared/logger');

async function fetchLocation() {
  try {
    const res = await axios.get('http://ip-api.com/json', { timeout: 5000 });
    context.update('location', {
      city: res.data.city,
      country: res.data.country,
      time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });
    logger.info(`Location: ${res.data.city}, ${res.data.country}`);
  } catch (err) {
    logger.warn(`Location fetch failed: ${err.message}`);
    context.update('location', {
      city: 'Hyderabad', country: 'India',
      time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });
  }
}

fetchLocation();
setInterval(() => {
  context.update('location', {
    time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  });
}, 3600000);

module.exports = { fetchLocation };
