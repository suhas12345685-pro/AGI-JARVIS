const logger = require('../../shared/logger');

const providers = {
  claude: require('./providers/claude'),
  openai: require('./providers/openai'),
  gemini: require('./providers/gemini'),
  ollama: require('./providers/ollama'),
};

async function reason(systemPrompt, userMessage, options = {}) {
  const primary  = process.env.LLM_PROVIDER || 'ollama';
  const fallback = process.env.LLM_FALLBACK || 'ollama';

  try {
    logger.info(`Calling LLM: ${primary}`);
    return await providers[primary].complete(systemPrompt, userMessage, options);
  } catch (err) {
    logger.warn(`Primary LLM (${primary}) failed: ${err.message}. Falling back to ${fallback}.`);
    return await providers[fallback].complete(systemPrompt, userMessage, options);
  }
}

module.exports = { reason };
