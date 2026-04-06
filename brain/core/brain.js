const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('./personality');
const { wrapWithCoT } = require('../llm/promptEngine');
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

      this._initialized = true;
      logger.info('Brain fully initialised — all subsystems wired');
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

    const memorySnapshot = this.memory
      ? await this.memory.getSnapshot(userId)
      : 'Memory system not loaded.';

    const fullContext = {
      ...context,
      source,
      userId,
      memorySnapshot,
      time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
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
}

module.exports = new Brain();
