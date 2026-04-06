const OpenAI = require('openai');

let client;
function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

async function complete(systemPrompt, userMessage, options = {}) {
  const res = await getClient().chat.completions.create({
    model: options.model || 'gpt-4o',
    max_tokens: options.maxTokens || 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });
  return res.choices[0].message.content;
}

module.exports = { complete };
