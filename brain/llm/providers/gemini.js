const { GoogleGenerativeAI } = require('@google/generative-ai');

let client;
function getClient() {
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
}

async function complete(systemPrompt, userMessage, options = {}) {
  const model = getClient().getGenerativeModel({
    model: options.model || 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(userMessage);
  return result.response.text();
}

module.exports = { complete };
