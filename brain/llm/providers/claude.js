const Anthropic = require('@anthropic-ai/sdk');

let client;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

async function complete(systemPrompt, userMessage, options = {}) {
  const res = await getClient().messages.create({
    model: options.model || 'claude-sonnet-4-20250514',
    max_tokens: options.maxTokens || 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  return res.content[0].text;
}

module.exports = { complete };
