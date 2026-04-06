const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('../core/personality');

async function plan(goal, context = {}) {
  const response = await reason(
    buildSystemPrompt(context),
    `
    You are JARVIS's planning module. Break this goal into discrete sub-tasks.

    Goal: "${goal}"

    Rules:
    - Each task must be atomic (cannot be broken down further)
    - Identify dependencies between tasks
    - Mark tasks that can run in parallel
    - Assign the right tool to each task

    Available tools: web_search, web_fetch, file_read, file_write, shell_exec,
                     laptop_control, calendar_read, direct_response

    Return ONLY valid JSON (no markdown, no explanation):
    {
      "goal": "...",
      "tasks": [
        {
          "id": "t1",
          "description": "...",
          "tool": "web_search",
          "params": { "query": "..." },
          "dependsOn": [],
          "parallel": true
        }
      ]
    }
    `
  );

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}

  return {
    goal,
    tasks: [{
      id: 't1',
      description: goal,
      tool: 'direct_response',
      params: { input: goal },
      dependsOn: [],
      parallel: false
    }]
  };
}

module.exports = { plan };
