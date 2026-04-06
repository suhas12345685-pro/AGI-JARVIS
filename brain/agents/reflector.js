const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('../core/personality');

async function reflect(goal, results, context = {}) {
  const summary = Object.entries(results)
    .map(([id, r]) => `Task ${id}: ${r.status} — ${r.output || r.error}`)
    .join('\n');

  const assessment = await reason(
    buildSystemPrompt(context),
    `
    Review the results of this completed plan and assess quality.

    Original goal: "${goal}"
    Task results:
    ${summary}

    Assessment questions:
    1. Was the goal fully achieved?
    2. Are there any errors or failures to address?
    3. Is the output accurate and grounded?
    4. What should be told to the user?

    Return ONLY valid JSON (no markdown):
    {
      "goalAchieved": true,
      "qualityScore": 8,
      "issues": [],
      "userMessage": "What JARVIS should say to the user"
    }
    `
  );

  try {
    const jsonMatch = assessment.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}

  return {
    goalAchieved: true,
    qualityScore: 7,
    issues: [],
    userMessage: assessment
  };
}

module.exports = { reflect };
