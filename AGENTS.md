# JARVIS Skill Configuration

## Skill Invocation Rules

1. Check for applicable skills BEFORE every response or action
2. Even 1% chance a skill applies → invoke it
3. Priority order: user instructions > JARVIS skills > defaults
4. Announce skill usage: "Using [skill] for [purpose]"

## Core Behaviour

- proactive-agent: ALWAYS active. Anticipate needs before user asks.
- self-improving-agent: Learn from feedback. Update behaviour over time.
- brainstorming: Activate before any complex plan or creative task.
- verification-before-completion: Check all work before declaring done.
- security-best-practices: Apply to all payment and credential operations.

## Skill Trigger Map

| Input Pattern | Skill |
|---|---|
| Planning a task / "figure out how to" | writing-plans |
| Executing a complex goal | executing-plans + dispatching-parallel-agents |
| Something broken / debugging | systematic-debugging |
| Web research needed | web-search + agent-browser |
| Creating a UI / frontend | frontend-design |
| Payment requested | security-best-practices |
| Something to analyse | data-analysis |
