require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Telegraf } = require('telegraf');
const brain = require('../../brain/core/brain');
const outbound = require('../../shared/outbound');
const logger = require('../../shared/logger');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  logger.warn('TELEGRAM_BOT_TOKEN not set. Telegram connector disabled.');
  process.exit(0);
}

const bot = new Telegraf(token);

// Ensure brain subsystems are wired before handling messages
brain.init().then(() => {
  logger.info('Brain initialised for Telegram connector');
}).catch(err => {
  logger.warn(`Brain init warning: ${err.message}`);
});

function registerOutbound(ctx) {
  const userId = ctx.from.id.toString();
  const chatId = ctx.chat.id;
  if (!outbound.hasChannel(userId)) {
    outbound.register(userId, 'telegram', async (message) => {
      await bot.telegram.sendMessage(chatId, message);
    });
  }
}

bot.start((ctx) => {
  registerOutbound(ctx);
  ctx.reply("JARVIS online, sir. How may I assist you?");
});

bot.on('text', async (ctx) => {
  registerOutbound(ctx);
  try {
    const result = await brain.think({
      input: ctx.message.text,
      source: 'telegram',
      userId: ctx.from.id.toString()
    });
    await ctx.reply(result.response);
  } catch (err) {
    logger.error(`Telegram handler error: ${err.message}`);
    await ctx.reply("I encountered an error processing your request, sir.");
  }
});

bot.on('voice', async (ctx) => {
  await ctx.reply("Voice messages require the desktop interface, sir. Please type your request.");
});

bot.launch();
logger.info('Telegram connector started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
