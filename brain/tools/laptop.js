const axios = require('axios');

const LAPTOP = process.env.LAPTOP_AGENT_URL || 'http://localhost:8080';

async function action(params) {
  const res = await axios.post(`${LAPTOP}/action`, params, { timeout: 15000 });
  return res.data.result || 'Action completed.';
}

module.exports = { action };
