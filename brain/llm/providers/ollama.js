const { Ollama } = require('ollama');

let client;
function getClient() {
  if (!client) {
    client = new Ollama({ host: process.env.OLLAMA_BASE_URL || 'http://localhost:11434' });
  }
  return client;
}

async function complete(systemPrompt, userMessage, options = {}) {
  const res = await getClient().chat({
    model: options.model || process.env.OLLAMA_MODEL || 'llama3',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });
  return res.message.content;
}

module.exports = { complete };
