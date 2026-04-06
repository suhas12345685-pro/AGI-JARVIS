require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const brain   = require('./core/brain');
const logger  = require('../shared/logger');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// Main thinking endpoint
app.post('/think', async (req, res) => {
  try {
    const { input, source, userId, context } = req.body;
    if (!input) return res.status(400).json({ error: 'input is required' });

    const result = await brain.think({ input, source, userId, context });
    res.json(result);
  } catch (err) {
    logger.error(`/think error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Payment confirmation endpoint (Phase 8)
app.post('/payments/confirm', (req, res) => {
  try {
    const { approved } = req.body;
    const payments = require('./payments/engine');
    payments.confirmFromPhone(approved);
    res.json({ status: 'received' });
  } catch (err) {
    logger.error(`/payments/confirm error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// OTP receive endpoint (Phase 8)
app.post('/otp/receive', (req, res) => {
  try {
    const { otp } = req.body;
    const payments = require('./payments/engine');
    payments.receiveOTP(otp);
    res.json({ status: 'received' });
  } catch (err) {
    logger.error(`/otp/receive error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.JARVIS_PORT || 3000;
const HOST = process.env.JARVIS_HOST || '0.0.0.0';

(async () => {
  await brain.init();
  app.listen(PORT, HOST, () => {
    logger.info(`JARVIS brain online → http://${HOST}:${PORT}`);
  });
})();
