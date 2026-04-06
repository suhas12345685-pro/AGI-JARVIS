const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('./personality');
const { wrapWithCoT } = require('../llm/promptEngine');
const cache = require('../../shared/cache');
const logger = require('../../shared/logger');

class Brain {
  constructor() {
    this.memory = null;
    this.grounder = null;
    this.anticipator = null;
    this.planner = null;
    this.executor = null;
    this.reflector = null;
    this._initialized = false;
  }

  async init() {
    if (this._initialized) return;
    try {
      // Wire memory (3-tier: Redis + SQLite + ChromaDB)
      const memory = require('../../memory/manager');
      await memory.init();
      this.memory = memory;

      // Wire grounder (zero-hallucination enforcement)
      this.grounder = require('./grounder');

      // Wire anticipator (proactive action system)
      this.anticipator = require('./anticipator');

      // Wire agentic pipeline (planner → executor → reflector)
      this.planner = require('../agents/planner');
      this.executor = require('../agents/executor');
      this.reflector = require('../agents/reflector');

      // Start autonomous awareness loop — JARVIS acts on its own
      this.startAutonomousLoop();

      this._initialized = true;
      logger.info('Brain fully initialised — all subsystems wired, autonomous loop active');
    } catch (err) {
      logger.error(`Brain init error: ${err.message}`);
      // Brain still works in degraded mode (simple LLM path, no memory/grounding)
      this._initialized = true;
    }
  }

  async think({ input, source = 'direct', userId = 'user', context = {} }) {
    // Ensure subsystems are wired on first call
    if (!this._initialized) await this.init();
    logger.info(`Brain.think called | source: ${source} | input: "${input}"`);
    if (source === 'voice') {
      const micSensor = require('../sensors/micSensor');
      micSensor.onTranscript(input);
    }

    const memorySnapshot = this.memory
      ? await this.memory.getSnapshot(userId)
      : 'Memory system not loaded.';

    const contextStore = require('../sensors/contextStore');
    const fullContext = {
      ...context,
      source,
      userId,
      memorySnapshot,
      time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      sensors: contextStore.snapshot(),
    };

    // Check if this requires agentic execution
    if (this.planner && this.executor && this.reflector) {
      const isComplex = await this.isComplexTask(input);
      if (isComplex) {
        return await this.agenticThink({ input, source, userId, context: fullContext });
      }
    }

    return await this.simpleThink({ input, source, userId, context: fullContext });
  }

  async simpleThink({ input, source, userId, context }) {
    // Check if anticipator already prepared a relevant result
    const cached = cache.get(`anticipation:${input}`);
    if (cached) {
      logger.info(`Anticipator cache hit for: "${input}"`);
      context.anticipatedResult = cached;
    }

    const systemPrompt = buildSystemPrompt(context);
    const userMessage = wrapWithCoT(input, context);

    let rawResponse = await reason(systemPrompt, userMessage);

    // Ground response (removes hallucinations)
    const response = this.grounder
      ? await this.grounder.ground(rawResponse, context)
      : rawResponse;

    // Update memory
    if (this.memory) {
      await this.memory.addExchange(userId, { input, response });
    }

    // Trigger anticipation asynchronously
    if (this.anticipator) {
      this.anticipator.anticipate({ input, response, context })
        .catch(err => logger.warn(`Anticipator error: ${err.message}`));
    }

    return { response, source, timestamp: Date.now() };
  }

  async agenticThink({ input, source, userId, context }) {
    logger.info('Agent pipeline activated for complex task');
    const plan = await this.planner.plan(input, context);
    const results = await this.executor.execute(plan);
    const verdict = await this.reflector.reflect(input, results, context);

    const response = verdict.userMessage || verdict;

    if (this.memory) {
      await this.memory.addExchange(userId, { input, response });
    }

    return { response, source, agentResults: results, timestamp: Date.now() };
  }

  async isComplexTask(input) {
    const complexPatterns = [
      /research.*and.*(create|write|build|make|save)/i,
      /compare.*and.*(summarize|document|list)/i,
      /find.*and.*(download|install|set\s*up)/i,
      /step.by.step/i,
      /multiple.*steps/i,
      /figure\s+out\s+how\s+to/i,
    ];
    return complexPatterns.some(p => p.test(input));
  }

  startAutonomousLoop() {
    const cron = require('node-cron');
    const outbound = require('../../shared/outbound');
    const scheduler = require('./scheduler');

    // Every 10 minutes: JARVIS reviews context and decides if it should act
    cron.schedule('*/10 * * * *', async () => {
      try {
        if (!this.memory) return;

        // Get all known users from outbound channels
        const channels = outbound.channels;
        for (const [userId] of channels) {
          const snapshot = await this.memory.getSnapshot(userId);
          if (!snapshot) continue;

          const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
          const pendingTasks = scheduler.pending
            .filter(p => p.userId === userId)
            .map(p => p.message || p.tool)
            .join(', ');

          const assessment = await reason(
            'You are JARVIS\'s autonomous awareness module. You review context and decide whether to proactively reach out to the user. Be selective — only act when there is genuine value.',
            `
            Current time: ${now}
            User memory: ${snapshot}
            Pending scheduled tasks: ${pendingTasks || 'None'}

            Should JARVIS proactively reach out to the user right now?
            Consider: pending tasks, time of day, things the user mentioned wanting.
            Return ONLY valid JSON (no markdown):
            { "shouldAct": true/false, "reason": "...", "message": "What JARVIS should say to the user" }
            If shouldAct is false, just return { "shouldAct": false }.
            `
          );

          const jsonMatch = assessment.match(/\{[\s\S]*\}/);
          if (!jsonMatch) continue;
          const decision = JSON.parse(jsonMatch[0]);

          if (decision.shouldAct && decision.message) {
            logger.info(`Autonomous loop: reaching out to ${userId} — ${decision.reason}`);
            await outbound.push(userId, decision.message);
          }
        }
      } catch (err) {
        logger.warn(`Autonomous loop error: ${err.message}`);
      }
    });

    // Start calendar monitor as well
    scheduler.startCalendarMonitor();
    logger.info('Autonomous awareness loop started (every 10 minutes)');
  }
}

module.exports = new Brain();
