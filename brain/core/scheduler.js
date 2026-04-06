const cron = require('node-cron');
const logger = require('../../shared/logger');

class Scheduler {
  constructor() {
    this.pending = [];
    this.calendarMonitorActive = false;
  }

  schedule({ message, delay, action, tool, params }) {
    const id = Date.now();
    this.pending.push({ id, message, delay, tool, params });

    setTimeout(async () => {
      if (message) {
        await this.notify(message);
      }
      if (tool) {
        try {
          const tools = require('../tools/registry');
          await tools.execute(tool, params);
        } catch (err) {
          logger.warn(`Scheduled task failed: ${err.message}`);
        }
      }
      this.pending = this.pending.filter(p => p.id !== id);
    }, delay || 0);

    logger.info(`Task scheduled: ${message || tool} (delay: ${delay || 0}ms)`);
  }

  async notify(message) {
    logger.info(`Notification: ${message}`);
    // Push notification to phone app (when connected)
    try {
      const push = require('../../connectors/phone/push');
      await push.send(message);
    } catch {
      // Phone push not available yet
    }
  }

  startCalendarMonitor() {
    if (this.calendarMonitorActive) return;
    this.calendarMonitorActive = true;

    cron.schedule('*/15 * * * *', async () => {
      try {
        const calendar = require('../tools/calendar');
        const upcoming = await calendar.getUpcoming(60);

        for (const event of upcoming) {
          const minsUntil = Math.floor((event.startTime - Date.now()) / 60000);
          if (minsUntil === 15 || minsUntil === 14) {
            await this.notify(
              `${event.title} starts in 15 minutes, sir.${event.location ? ' Location: ' + event.location : ''}`
            );
          }
        }
      } catch (err) {
        logger.warn(`Calendar monitor error: ${err.message}`);
      }
    });

    logger.info('Calendar monitor started (every 15 minutes)');
  }
}

module.exports = new Scheduler();
