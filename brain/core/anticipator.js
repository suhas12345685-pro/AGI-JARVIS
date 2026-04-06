const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('./personality');
const scheduler = require('./scheduler');
const cache = require('../../shared/cache');
const logger = require('../../shared/logger');

class Anticipator {

  async anticipate({ input, response, context }) {
    try {
      const predictions = await reason(
        buildSystemPrompt(context),
        `
        Based on this interaction, predict the next 3 things
        the user is likely to need (without being asked).

        User said: "${input}"
        JARVIS responded: "${response}"
        Current time: ${context.time}
        Memory: ${context.memorySnapshot || 'None'}

        For each prediction:
        - What does the user likely need?
        - Should JARVIS act NOW, PREPARE quietly, or WAIT and alert?
        - Confidence 0.0-1.0

        Return ONLY valid JSON (no markdown):
        [{ "need": "...", "action": "...", "tool": "...", "params": {}, "timing": "now|prepare|wait", "confidence": 0.8, "delay": 0, "message": "" }]
        Only return predictions with confidence > 0.60.
        `
      );

      let parsed;
      const jsonMatch = predictions.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return;
      parsed = JSON.parse(jsonMatch[0]);

      for (const p of parsed) {
        if (p.timing === 'now' && p.confidence >= 0.85) {
          logger.info(`Anticipator acting now: ${p.need} (confidence: ${p.confidence})`);
          await this.actNow(p);

        } else if (p.timing === 'prepare' && p.confidence >= 0.70) {
          logger.info(`Anticipator preparing: ${p.need} (confidence: ${p.confidence})`);
          await this.prepare(p);

        } else if (p.timing === 'wait') {
          logger.info(`Anticipator scheduling alert: ${p.need}`);
          scheduler.schedule(p);
        }
      }
    } catch (err) {
      logger.warn(`Anticipator error: ${err.message}`);
    }
  }

  async actNow(prediction) {
    const tools = require('../tools/registry');
    try {
      const result = await tools.execute(prediction.tool, prediction.params);
      logger.info(`Proactive action complete: ${prediction.need} → ${result}`);
    } catch (err) {
      logger.warn(`Proactive action failed: ${err.message}`);
    }
  }

  async prepare(prediction) {
    try {
      const tools = require('../tools/registry');
      const result = await tools.execute(prediction.tool, prediction.params);
      cache.set(prediction.need, result, 300);
    } catch (err) {
      logger.warn(`Proactive prepare failed: ${err.message}`);
    }
  }
}

module.exports = new Anticipator();
