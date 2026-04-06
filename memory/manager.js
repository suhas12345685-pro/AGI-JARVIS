const shortTerm = require('./adapters/shortTerm');
const longTerm  = require('./adapters/longTerm');
const vector    = require('./adapters/vectorMemory');
const { reason } = require('../brain/llm/router');
const logger    = require('../shared/logger');

class MemoryManager {
  async init() {
    await shortTerm.connect();
    await vector.init();
    logger.info('Memory manager initialised (short + long + vector)');
  }

  async addExchange(userId, { input, response }) {
    await shortTerm.addExchange(userId, { input, response });

    const text = `User: ${input}\nJARVIS: ${response}`;
    await vector.store(`${userId}_${Date.now()}`, text, { userId });

    await this.extractFacts(userId, input, response);
  }

  async extractFacts(userId, input, response) {
    try {
      const extraction = await reason(
        'Extract memorable long-term facts from this conversation exchange. ' +
        'Return JSON: [{ "category": "...", "key": "...", "value": "..." }] or [] if nothing memorable. ' +
        'Categories: habit, preference, fact, relationship, schedule. ' +
        'Only extract things worth remembering indefinitely.',
        `User said: "${input}"\nJARVIS responded: "${response}"`
      );

      const jsonMatch = extraction.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return;

      const facts = JSON.parse(jsonMatch[0]);
      for (const fact of facts) {
        if (fact.category && fact.key && fact.value) {
          longTerm.set(userId, fact.category, fact.key, fact.value, 'inferred');
        }
      }
    } catch {
      // No facts extracted — that's fine
    }
  }

  async getSnapshot(userId) {
    const recentExchanges = await shortTerm.get(userId);
    const longTermSummary = longTerm.getSummary(userId);
    const last5 = recentExchanges.slice(-5)
      .map(e => `User: ${e.input}\nJARVIS: ${e.response}`)
      .join('\n---\n');

    return [
      longTermSummary ? `KNOWN FACTS:\n${longTermSummary}` : '',
      last5 ? `RECENT EXCHANGES:\n${last5}` : ''
    ].filter(Boolean).join('\n\n');
  }

  async recall(userId, query) {
    const exact = longTerm.get(userId, query);
    if (exact) return exact.value;

    const results = await vector.search(query);
    return results.map(r => r.text).join('\n');
  }

  async compress(userId) {
    const exchanges = await shortTerm.get(userId);
    if (exchanges.length < 15) return;

    const old = exchanges.slice(0, 10);
    const summary = await reason(
      'Compress these conversation exchanges into 3-5 memory bullet points.',
      JSON.stringify(old)
    );

    longTerm.set(userId, 'summary', `session_${Date.now()}`, summary, 'compressed');
    await shortTerm.clear(userId);
  }
}

module.exports = new MemoryManager();
