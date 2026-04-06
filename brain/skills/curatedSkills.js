module.exports = [
  // TIER 1 — Core Cognitive
  { name: 'proactive-agent',            installCmd: 'npx skills add halthelobster/proactive-agent/proactive-agent' },
  { name: 'self-improving-agent',       installCmd: 'npx skills add charon-fan/agent-playbook/self-improving-agent' },
  { name: 'brainstorming',              installCmd: 'npx skills add obra/superpowers/brainstorming' },
  { name: 'using-superpowers',          installCmd: 'npx skills add obra/superpowers/using-superpowers' },
  { name: 'systematic-debugging',       installCmd: 'npx skills add obra/superpowers/systematic-debugging' },
  { name: 'verification-before-completion', installCmd: 'npx skills add obra/superpowers/verification-before-completion' },

  // TIER 2 — Agentic Execution
  { name: 'writing-plans',              installCmd: 'npx skills add obra/superpowers/writing-plans' },
  { name: 'executing-plans',            installCmd: 'npx skills add obra/superpowers/executing-plans' },
  { name: 'dispatching-parallel-agents',installCmd: 'npx skills add obra/superpowers/dispatching-parallel-agents' },
  { name: 'subagent-driven-development',installCmd: 'npx skills add obra/superpowers/subagent-driven-development' },
  { name: 'planning-with-files',        installCmd: 'npx skills add othmanadi/planning-with-files/planning-with-files' },
  { name: 'skill-vetter',               installCmd: 'npx skills add useai-pro/openclaw-skills-security/skill-vetter' },

  // TIER 3 — Web & Data
  { name: 'agent-browser',              installCmd: 'npx skills add vercel-labs/agent-browser/agent-browser' },
  { name: 'browser-use',                installCmd: 'npx skills add browser-use/browser-use/browser-use' },
  { name: 'web-search',                 installCmd: 'npx skills add inferen-sh/skills/web-search' },
  { name: 'firecrawl',                  installCmd: 'npx skills add firecrawl/cli/firecrawl' },
  { name: 'search',                     installCmd: 'npx skills add tavily-ai/skills/search' },

  // TIER 4 — Voice & Media
  { name: 'elevenlabs-tts',             installCmd: 'npx skills add inferen-sh/skills/elevenlabs-tts' },

  // TIER 5 — UI & Interface
  { name: 'chat-ui',                    installCmd: 'npx skills add inferen-sh/skills/chat-ui' },
  { name: 'agent-ui',                   installCmd: 'npx skills add inferen-sh/skills/agent-ui' },
  { name: 'frontend-design',            installCmd: 'npx skills add anthropics/skills/frontend-design' },

  // TIER 6 — Backend & Data
  { name: 'python-executor',            installCmd: 'npx skills add inferen-sh/skills/python-executor' },
  { name: 'workflow-automation',         installCmd: 'npx skills add supercent-io/skills-template/workflow-automation' },
  { name: 'data-analysis',              installCmd: 'npx skills add supercent-io/skills-template/data-analysis' },
  { name: 'database-schema-design',     installCmd: 'npx skills add supercent-io/skills-template/database-schema-design' },
  { name: 'nodejs-backend-patterns',    installCmd: 'npx skills add wshobson/agents/nodejs-backend-patterns' },

  // TIER 7 — Security & Quality
  { name: 'security-best-practices',    installCmd: 'npx skills add supercent-io/skills-template/security-best-practices' },
  { name: 'test-driven-development',    installCmd: 'npx skills add obra/superpowers/test-driven-development' },
  { name: 'code-review',                installCmd: 'npx skills add supercent-io/skills-template/code-review' },
];
