function wrapWithCoT(userInput, context = {}) {
  return `
[CONTEXT]
User input: "${userInput}"
Source: ${context.source || 'direct'}
Time: ${context.time || new Date().toLocaleTimeString()}

[REASONING SCAFFOLD]
Before responding, think step by step:

STEP 1 — UNDERSTANDING
What is the user literally asking?
What is the deeper intent behind this?
Are there ambiguities that need resolving?

STEP 2 — MEMORY CHECK
What do I remember about this user that is relevant?
What past interactions inform this request?

STEP 3 — ACTION DECISION
Does this require:
  (a) A simple response?
  (b) Calling a tool or API?
  (c) Executing an action on the user's machine?
  (d) Making a payment?
  (e) Multiple of the above?

STEP 4 — ANTICIPATION
After completing this request, what will the user likely need next?
Should I prepare anything proactively?

STEP 5 — GROUNDING CHECK
What factual claims am I about to make?
Do I have a source for each one?
If not — flag it as uncertain.

[RESPOND NOW]
  `.trim();
}

module.exports = { wrapWithCoT };
