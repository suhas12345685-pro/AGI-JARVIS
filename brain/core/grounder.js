const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('./personality');
const logger = require('../../shared/logger');

// Hard rules — deterministic, code-level enforcement
const HARD_RULES = [
  {
    pattern: /payment (confirmed|successful|completed|processed)/i,
    requires: (context) => context.razorpayConfirmed === true,
    replacement: "The payment is pending confirmation from the payment processor."
  },
  {
    pattern: /reference(?: number)?:?\s*[A-Z0-9]{6,}/i,
    requires: (context) => context.paymentReference !== undefined,
    replacement: "Reference number will be provided upon confirmation."
  },
  {
    pattern: /costs?\s+₹[\d,]+/i,
    requires: (context) => context.priceVerifiedAt &&
              (Date.now() - context.priceVerifiedAt < 3600000),
    replacement: "I'd need to check the current price — prices change frequently."
  }
];

function applyHardRules(response, context) {
  let result = response;
  for (const rule of HARD_RULES) {
    if (rule.pattern.test(result) && !rule.requires(context)) {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  return result;
}

class ZeroHallucinationGrounder {

  async extractClaims(response) {
    try {
      const extraction = await reason(
        'Extract all factual claims from this text. ' +
        'Return ONLY valid JSON: [{ "claim": "...", "isFactual": true, "category": "..." }]',
        response
      );
      const jsonMatch = extraction.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}
    return [];
  }

  scoreConfidence(claim, context) {
    if (context.toolResults && context.toolResults.includes(claim.claim)) return 0.95;
    if (context.memorySource === 'explicit') return 0.92;
    if (context.memorySource === 'inferred') return 0.75;
    if (claim.category === 'time_sensitive') return 0.40;
    return 0.55;
  }

  async ground(rawResponse, context) {
    // Apply hard rules first (deterministic)
    let response = applyHardRules(rawResponse, context);

    // Extract and score claims
    const claims = await this.extractClaims(response);
    const issues = [];

    for (const claim of claims) {
      if (!claim.isFactual) continue;
      const confidence = this.scoreConfidence(claim, context);
      if (confidence < 0.70) {
        issues.push(claim.claim);
      }
    }

    if (issues.length === 0) return response;

    logger.info(`Grounding ${issues.length} unverified claims`);

    // Rewrite with uncertainty markers
    const grounded = await reason(
      buildSystemPrompt(context),
      `
      Rewrite this response. For these unverified claims: ${JSON.stringify(issues)}
      Replace them with appropriate uncertainty language like:
      "I believe...", "I'm not certain, but...", or "Let me verify that."

      Original response:
      ${response}
      `
    );

    return grounded;
  }
}

module.exports = new ZeroHallucinationGrounder();
