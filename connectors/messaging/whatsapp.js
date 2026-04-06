require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const brain = require('../../brain/core/brain');
const logger = require('../../shared/logger');

async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./connectors/messaging/wa_auth');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        logger.info('WhatsApp reconnecting...');
        startWhatsApp();
      } else {
        logger.info('WhatsApp logged out. Scan QR code again.');
      }
    } else if (connection === 'open') {
      logger.info('WhatsApp connected');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text;
    if (!text) return;

    try {
      const result = await brain.think({
        input: text,
        source: 'whatsapp',
        userId: msg.key.remoteJid
      });
      await sock.sendMessage(msg.key.remoteJid, { text: result.response });
    } catch (err) {
      logger.error(`WhatsApp handler error: ${err.message}`);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "I encountered an error processing your request, sir."
      });
    }
  });
}

startWhatsApp();
