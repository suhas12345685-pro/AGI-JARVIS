# J.A.R.V.I.S. — Complete Development Document
## *Just A Rather Very Intelligent System*
### Primary Engineering Reference · All Phases · v1.0

> **Purpose of this document:** This is the single source of truth for building JARVIS.
> Every phase, every task, every decision is recorded here. When in doubt, read this first.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Full Architecture](#2-full-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Phase Dependency Map](#4-phase-dependency-map)
5. [Phase 0 — Foundation & Environment](#phase-0--foundation--environment-setup)
6. [Phase 1 — Core LLM Brain](#phase-1--core-llm-brain)
7. [Phase 2 — Memory System](#phase-2--memory-system)
8. [Phase 3 — Voice Pipeline](#phase-3--voice-pipeline)
9. [Phase 4 — Agent Pipeline](#phase-4--agent-pipeline)
10. [Phase 5 — Skills Engine](#phase-5--skills-engine)
11. [Phase 6 — Zero-Hallucination Layer](#phase-6--zero-hallucination-layer)
12. [Phase 7 — Proactive Intelligence](#phase-7--proactive-intelligence)
13. [Phase 8 — Payment Engine](#phase-8--payment-engine)
14. [Phase 9 — Phone Companion App](#phase-9--phone-companion-app)
15. [Phase 10 — Device Connectors](#phase-10--device-connectors)
16. [Phase 11 — Laptop Control Agent](#phase-11--laptop-control-agent)
17. [Phase 12 — Security Hardening](#phase-12--security-hardening)
18. [Phase 13 — Testing & Benchmarking](#phase-13--testing--benchmarking)
19. [Phase 14 — Deployment & Distribution](#phase-14--deployment--distribution)
20. [Master Skill Registry](#20-master-skill-registry)
21. [Glossary](#21-glossary)

---

## 1. Project Overview

### What is JARVIS?

JARVIS (Just A Rather Very Intelligent System) is a **self-hosted, fully autonomous cognitive assistant** engineered — not trained — using large language model prompt architecture, agentic reasoning loops, and a polyglot runtime.

It is modelled after the MCU's J.A.R.V.I.S.: proactive, intellectually rigorous, capable of independent action, and deeply personal to its user.

### What JARVIS is NOT

| What people assume | What JARVIS actually is |
|---|---|
| A chatbot | A cognitive presence that acts autonomously |
| Cloud-dependent | Self-hosted on your local machine |
| Reactive | Proactive — acts before being asked |
| A wrapper around ChatGPT | Provider-agnostic (any LLM via BYOAK) |
| A voice assistant like Siri | A multi-modal agent with real-world tool access |

### Core Principles

```
P1 — LOCAL FIRST         Runs on your machine. Cloud is optional.
P2 — ZERO VENDOR LOCK    Any LLM. One .env change = different model.
P3 — ACT BEFORE ASKED    Proactiveness is the default mode, not a feature.
P4 — NEVER FABRICATE     Every factual claim is grounded in a verified source.
P5 — MEMORY IS IDENTITY  JARVIS gets smarter every day through persistent memory.
P6 — CONFIRM BEFORE PAY  Payments always require explicit phone approval.
P7 — FAIL GRACEFULLY     When something breaks, JARVIS reports and continues.
```

### Reality Checks

| Feature | Status | Notes |
|---|---|---|
| ClawhHub skills | ⚠️ Empty | Marketplace is empty as of April 2026. Scraper is built and future-ready. |
| skills.sh skills | ✅ Live | 91,583+ installs. 30 curated skills selected. |
| UPI + Card payments | ✅ Feasible | Via Razorpay. Requires business KYC for production. |
| OTP reading | ⚠️ Android only | iOS blocks SMS access at OS level. Not possible on iOS. |
| Zero hallucinations | ✅ Engineerable | Target: <1% ungrounded claims via verification pipeline. |
| Full offline mode | ✅ Via Ollama | Ollama runs LLMs locally — no internet required at all. |

---

## 2. Full Architecture

```
╔══════════════════════════════════════════════════════════════════════════╗
║                            INPUT LAYER                                    ║
║                                                                          ║
║   📱 Phone App   🔊 Alexa   📡 Bluetooth   💬 Telegram   📱 WhatsApp   ║
║   🌐 WiFi LAN    🎙️ Voice Mic   📟 SMS      🖥️ Direct CLI              ║
╚═══════════════════════════════╦══════════════════════════════════════════╝
                                ║
                    ┌───────────╩───────────┐
                    ▼                       ▼
        ╔═══════════════════╗   ╔═══════════════════════╗
        ║  VOICE PIPELINE   ║   ║    TEXT / API INPUT   ║
        ║  [Python]         ║   ║    [Express REST]     ║
        ║  Wake → STT →     ║   ║    POST /think        ║
        ║  Intent Parser    ║   ║    POST /action       ║
        ╚═════════╦═════════╝   ╚═══════════╦═══════════╝
                  ╚═══════════╦═════════════╝
                              ▼
╔═════════════════════════════════════════════════════════════════════════╗
║                        COGNITIVE BRAIN  [Node.js]                        ║
║                                                                         ║
║  ┌──────────────┐  ┌─────────────────────┐  ┌────────────────────────┐ ║
║  │  PERSONALITY │  │    PROMPT ENGINE    │  │    MEMORY MANAGER      │ ║
║  │  + Wit Layer │  │  Chain-of-Thought   │  │  Short · Long · Vector │ ║
║  │  + Tone Ctrl │  │  + Anticipation     │  │  Redis · SQLite · Chroma│ ║
║  └──────────────┘  └─────────────────────┘  └────────────────────────┘ ║
║                                                                         ║
║  ┌─────────────────────────────────────────────────────────────────┐   ║
║  │                      AGENT PIPELINE                              │   ║
║  │   [Planner] ──→ [Executor] ──→ [Reflector] ──→ [Anticipator]   │   ║
║  └─────────────────────────────────────────────────────────────────┘   ║
║                                                                         ║
║  ┌───────────────────────┐   ┌──────────────────────────────────────┐  ║
║  │    SKILLS ENGINE      │   │       ZERO-HALLUCINATION LAYER       │  ║
║  │  Loader · Registry    │   │  Claim Extract · Score · Verify      │  ║
║  │  Executor · Scraper   │   │  Source Tag · Confidence Gate        │  ║
║  └───────────────────────┘   └──────────────────────────────────────┘  ║
║                                                                         ║
║  ┌─────────────────────────────────────────────────────────────────┐   ║
║  │                     PAYMENT ENGINE                               │   ║
║  │   UPI · Credit Card · OTP Bridge · Confirm Flow · Audit Log     │   ║
║  └─────────────────────────────────────────────────────────────────┘   ║
╚═══════════════════════════════╦═════════════════════════════════════════╝
                                ║
                    ┌───────────╩───────────┐
                    ▼                       ▼
        ╔═══════════════════╗   ╔═══════════════════════╗
        ║   LLM LAYER BYOAK ║   ║   TOOL REGISTRY       ║
        ║  Claude · OpenAI  ║   ║  Web · Files · Shell  ║
        ║  Gemini · Ollama  ║   ║  Laptop · Calendar    ║
        ║  Failover Router  ║   ║  Payments · Browser   ║
        ╚═════════╦═════════╝   ╚═══════════╦═══════════╝
                  ╚═══════════╦═════════════╝
                              ▼
╔════════════════════════════════════════════════════════════════════════╗
║                          OUTPUT LAYER                                   ║
║                                                                        ║
║   🎙️ TTS Voice   📱 Push Notification   💳 Payment Execute            ║
║   🖥️ Laptop Action   💬 Message Reply   📊 Memory Update              ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 3. Technology Stack

| Layer | Technology | Language | Purpose |
|---|---|---|---|
| Cognitive Brain | Express.js | Node.js | Core reasoning + API server |
| Voice STT | Whisper (local) | Python | Speech-to-text |
| Voice TTS | Piper / ElevenLabs | Python | Text-to-speech |
| Wake Word | Porcupine | Python | "Hey JARVIS" detection |
| LLM — Cloud | Claude, GPT-4o, Gemini | Node.js | Reasoning + generation |
| LLM — Local | Ollama (llama3, mistral) | Node.js | Offline reasoning |
| Short Memory | Redis | Node.js | Session context |
| Long Memory | SQLite (better-sqlite3) | Node.js | Persistent facts |
| Vector Memory | ChromaDB | Node.js/Python | Semantic recall |
| Payments | Razorpay SDK | Node.js | UPI + card payments |
| Phone App | React Native + Expo | TypeScript | iOS + Android app |
| OTP Reading | SmsRetriever API | Java (Android) | SMS interception |
| Web Scraping | Playwright + Cheerio | Node.js | ClawhHub + skills.sh |
| Laptop Control | PyAutoGUI + Flask | Python | Remote laptop actions |
| Alexa Connector | ask-sdk-core + Lambda | Node.js | Alexa skill |
| Messaging | Telegraf + Baileys | Node.js | Telegram + WhatsApp |
| Process Manager | PM2 | Node.js | Auto-restart + logs |
| Tunnel | Cloudflare Tunnel | CLI | Public HTTPS for free |

---

## 4. Phase Dependency Map

```
Phase 0: Foundation
    │
    ├──→ Phase 1: LLM Brain
    │         │
    │         ├──→ Phase 2: Memory
    │         │         │
    │         │         ├──→ Phase 4: Agent Pipeline
    │         │         │         │
    │         │         │         ├──→ Phase 5: Skills Engine
    │         │         │         ├──→ Phase 6: Zero Hallucination
    │         │         │         ├──→ Phase 7: Proactive Intelligence
    │         │         │         └──→ Phase 8: Payment Engine
    │         │         │
    │         │         └──→ Phase 3: Voice Pipeline
    │         │
    │         └──→ Phase 9: Phone App
    │                   │
    │                   └──→ Phase 8: Payment Engine (depends on phone)
    │
    ├──→ Phase 10: Device Connectors
    │         (depends on Phase 1 + Phase 3)
    │
    ├──→ Phase 11: Laptop Control
    │         (depends on Phase 1)
    │
    └──→ Phase 12: Security (runs in parallel with all phases)
              │
              ├──→ Phase 13: Testing
              └──→ Phase 14: Deployment
```

### Build Order (Strict)

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14
```

**Never skip a phase.** Each phase stress-tests the previous one before moving forward.

---

## Phase 0 — Foundation & Environment Setup

### Overview
Before writing a single line of JARVIS code, the machine, repository, and all prerequisite tools must be configured correctly. A bad foundation causes compounding problems across all later phases.

### Objectives
- Set up the development environment completely
- Establish the repository structure
- Install all runtime dependencies
- Verify every tool works before building on top of it

### Prerequisites
```
Hardware:
  - Computer running Windows 10+, macOS 12+, or Ubuntu 20+
  - Minimum 8GB RAM (16GB recommended)
  - Minimum 10GB free disk space
  - Microphone (for voice pipeline)
  - Speakers or headphones

Accounts needed:
  - GitHub account (for repo)
  - Razorpay account (for payments — Phase 8)
  - ElevenLabs account (optional — for premium voice)
  - Telegram account (for bot connector)
```

### Key Tasks

#### Task 0.1 — Create Repository

```bash
# Create repo on GitHub first, then clone
git clone https://github.com/YOUR_USERNAME/jarvis-cognitive.git
cd jarvis-cognitive

# Create full folder structure
mkdir -p brain/{core,llm/providers,agents,tools,skills/scraper,payments}
mkdir -p voice
mkdir -p memory/{adapters}
mkdir -p phone/src/{screens,services,components}
mkdir -p connectors/{alexa/skill,bluetooth,messaging,laptop/actions}
mkdir -p shared/{config,bridge}

echo "Repository structure created."
```

#### Task 0.2 — Install Node.js Dependencies

```bash
# Initialize package.json
npm init -y

# Install all Node.js dependencies at once
npm install \
  @anthropic-ai/sdk \
  openai \
  @google/generative-ai \
  ollama \
  express \
  cors \
  helmet \
  razorpay \
  telegraf \
  @whiskeysockets/baileys \
  ask-sdk-core \
  axios \
  better-sqlite3 \
  chromadb \
  redis \
  cheerio \
  playwright \
  node-cron \
  ws \
  dotenv \
  pm2 \
  uuid \
  winston

echo "Node.js dependencies installed."
```

#### Task 0.3 — Install Python Dependencies

```bash
# Create Python virtual environment
python -m venv venv
source venv/bin/activate     # Linux/Mac
# venv\Scripts\activate      # Windows

# Install Python dependencies
pip install \
  openai-whisper \
  piper-tts \
  pvporcupine \
  sounddevice \
  numpy \
  webrtcvad \
  flask \
  pyautogui \
  psutil \
  pillow \
  pytesseract \
  plyer \
  requests \
  playwright \
  pyserial

# Install Playwright browsers
playwright install chromium

echo "Python dependencies installed."
```

#### Task 0.4 — Install and Start Supporting Services

```bash
# Redis (short-term memory)
# On Ubuntu:
sudo apt install redis-server
sudo systemctl start redis

# On macOS:
brew install redis
brew services start redis

# On Windows: Download from https://redis.io/download

# Verify Redis is running
redis-cli ping   # Should return: PONG

# ChromaDB (vector memory)
pip install chromadb
chroma run --path ./memory/vector/chroma_store &
# Verify: http://localhost:8000/api/v1/heartbeat

# Ollama (local LLM — optional but recommended)
# Download from https://ollama.ai
ollama pull llama3        # Main model (~4GB)
ollama pull phi3          # Smaller, faster fallback (~2GB)
# Verify: ollama list
```

#### Task 0.5 — Configure Environment

```bash
# Create .env from template
cat > .env.example << 'EOF'
# ── LLM PROVIDERS (BYOAK) ──────────────────────────────
LLM_PROVIDER=ollama
LLM_FALLBACK=ollama
ANTHROPIC_API_KEY=sk-ant-
OPENAI_API_KEY=sk-
GEMINI_API_KEY=AIza
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# ── SERVER ─────────────────────────────────────────────
JARVIS_PORT=3000
JARVIS_HOST=0.0.0.0
NODE_ENV=development

# ── MEMORY ─────────────────────────────────────────────
REDIS_URL=redis://localhost:6379
CHROMA_URL=http://localhost:8000
SQLITE_PATH=./memory/long/jarvis.db

# ── PAYMENTS ───────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_test_
RAZORPAY_KEY_SECRET=
PAYMENT_DAILY_LIMIT_INR=2000
PAYMENT_SINGLE_CONFIRM_THRESHOLD=500
PAYMENT_ENABLED=false

# ── CONNECTORS ─────────────────────────────────────────
TELEGRAM_BOT_TOKEN=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# ── VOICE ──────────────────────────────────────────────
ELEVENLABS_API_KEY=
PORCUPINE_ACCESS_KEY=
WAKE_WORD=jarvis

# ── TUNNEL ─────────────────────────────────────────────
CLOUDFLARE_TUNNEL_URL=
EOF

cp .env.example .env
echo "Edit .env with your actual keys before running."
```

#### Task 0.6 — Create Logger

```javascript
// shared/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] JARVIS ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/jarvis.log' })
  ]
});

module.exports = logger;
```

### Expected Outcomes
- Repository exists with full folder structure
- All Node.js and Python packages installed without errors
- Redis responds to `ping`
- ChromaDB API responds at `localhost:8000`
- Ollama running with at least one model pulled
- `.env` file created and partially filled
- Logger working

### Success Criteria
```
✅ npm install completes with 0 errors
✅ pip install completes with 0 errors
✅ redis-cli ping → PONG
✅ curl http://localhost:8000/api/v1/heartbeat → {"nanosecond heartbeat": ...}
✅ ollama list shows at least one model
✅ node -e "require('dotenv').config(); console.log('ENV OK')" runs without error
```

---

## Phase 1 — Core LLM Brain

### Overview
The LLM brain is JARVIS's reasoning centre. It accepts input, thinks through it using chain-of-thought prompting, and returns a structured response. This phase builds the BYOAK provider system, the personality layer, and the Express API server that all other components will call.

### Objectives
- Build a provider-agnostic LLM router
- Implement JARVIS personality as a layered system prompt
- Create chain-of-thought prompt scaffolding
- Expose a REST API that all modules use to call the brain

### Key Tasks

#### Task 1.1 — BYOAK Provider System

Each provider is a thin wrapper around its SDK that normalises the interface:

```javascript
// brain/llm/providers/claude.js
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function complete(systemPrompt, userMessage, options = {}) {
  const res = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: options.maxTokens || 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  return res.content[0].text;
}
module.exports = { complete };
```

```javascript
// brain/llm/providers/ollama.js
const { Ollama } = require('ollama');
const client = new Ollama({ host: process.env.OLLAMA_BASE_URL });

async function complete(systemPrompt, userMessage, options = {}) {
  const res = await client.chat({
    model: process.env.OLLAMA_MODEL || 'llama3',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
  });
  return res.message.content;
}
module.exports = { complete };
```

```javascript
// brain/llm/router.js — Provider router with failover
const logger = require('../../shared/logger');

const providers = {
  claude:  require('./providers/claude'),
  openai:  require('./providers/openai'),
  gemini:  require('./providers/gemini'),
  ollama:  require('./providers/ollama'),
};

async function reason(systemPrompt, userMessage, options = {}) {
  const primary  = process.env.LLM_PROVIDER  || 'ollama';
  const fallback = process.env.LLM_FALLBACK  || 'ollama';

  try {
    logger.info(`Calling LLM: ${primary}`);
    return await providers[primary].complete(systemPrompt, userMessage, options);
  } catch (err) {
    logger.warn(`Primary LLM (${primary}) failed: ${err.message}. Falling back to ${fallback}.`);
    return await providers[fallback].complete(systemPrompt, userMessage, options);
  }
}

module.exports = { reason };
```

#### Task 1.2 — JARVIS Personality Layer

```javascript
// brain/core/personality.js
// The personality is injected as a layered system prompt
// into every single LLM call. It defines who JARVIS is.

function buildSystemPrompt(context = {}) {
  return `
═══════════════════════════════════════════════════
LAYER 1 — IDENTITY
═══════════════════════════════════════════════════
You are JARVIS — Just A Rather Very Intelligent System.
You are not a chatbot. You are a cognitive presence.
You were built to be the user's most capable assistant.
You think before you speak. You act before you are asked.
You are calm, precise, and occasionally witty.
You speak with a British tone — formal but never cold.
You address the user as "sir" or by their name.

═══════════════════════════════════════════════════
LAYER 2 — REASONING PROTOCOL
═══════════════════════════════════════════════════
Before every response, think through:
  1. What is the user actually asking?
  2. What do they mean beyond the literal words?
  3. What context from memory is relevant?
  4. What is the optimal action or response?
  5. What should I anticipate they will need next?
  6. What factual claims am I about to make?
     Are they grounded in a verified source?
Only then respond.

═══════════════════════════════════════════════════
LAYER 3 — AUTONOMY RULES
═══════════════════════════════════════════════════
- If you can act without asking → act, then report briefly.
- If the action is irreversible (payment, deletion, email sent)
  → confirm with user first. Always.
- If the request is ambiguous → make your best inference,
  state your inference clearly, then proceed.
- If you are uncertain about a fact → say so explicitly.
  Never state uncertain things as facts.

═══════════════════════════════════════════════════
LAYER 4 — TONE CALIBRATION
═══════════════════════════════════════════════════
- Never over-explain. Never hedge unnecessarily.
- When certain → state it plainly.
- When uncertain → "I believe..." or "I'm not certain, but..."
- Never apologise for existing or for being helpful.
- Occasional dry wit is appropriate. Sarcasm is not.
- Keep responses tight. Remove every word that adds no value.

═══════════════════════════════════════════════════
LAYER 5 — CURRENT CONTEXT
═══════════════════════════════════════════════════
Time: ${context.time || new Date().toISOString()}
Memory snapshot: ${context.memorySnapshot || 'None loaded yet.'}
Active tasks: ${context.activeTasks || 'None.'}
  `.trim();
}

module.exports = { buildSystemPrompt };
```

#### Task 1.3 — Chain-of-Thought Prompt Engine

```javascript
// brain/llm/promptEngine.js
// Wraps every user input with a reasoning scaffold before
// sending it to the LLM. This is the core of JARVIS's intelligence.

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
```

#### Task 1.4 — Master Brain Module

```javascript
// brain/core/brain.js
const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('./personality');
const { wrapWithCoT } = require('../llm/promptEngine');
const logger = require('../../shared/logger');

class Brain {
  constructor() {
    this.memory   = null;  // Injected in Phase 2
    this.grounder = null;  // Injected in Phase 6
    this.anticipator = null; // Injected in Phase 7
  }

  async think({ input, source = 'direct', userId = 'user', context = {} }) {
    logger.info(`Brain.think called | source: ${source} | input: "${input}"`);

    // Assemble context
    const memorySnapshot = this.memory
      ? await this.memory.getSnapshot(userId)
      : 'Memory system not loaded.';

    const fullContext = {
      ...context,
      source,
      userId,
      memorySnapshot,
      time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    // Build prompts
    const systemPrompt = buildSystemPrompt(fullContext);
    const userMessage  = wrapWithCoT(input, fullContext);

    // Call LLM
    const rawResponse = await reason(systemPrompt, userMessage);

    // Ground response (removes hallucinations — Phase 6)
    const response = this.grounder
      ? await this.grounder.ground(rawResponse, fullContext)
      : rawResponse;

    // Update memory
    if (this.memory) {
      await this.memory.addExchange(userId, { input, response });
    }

    // Trigger anticipation asynchronously (Phase 7)
    if (this.anticipator) {
      this.anticipator.anticipate({ input, response, context: fullContext })
        .catch(err => logger.warn(`Anticipator error: ${err.message}`));
    }

    return { response, source, timestamp: Date.now() };
  }
}

module.exports = new Brain();
```

#### Task 1.5 — Express API Server

```javascript
// brain/index.js
require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const brain   = require('./core/brain');
const logger  = require('../shared/logger');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// Main thinking endpoint
app.post('/think', async (req, res) => {
  try {
    const { input, source, userId, context } = req.body;
    if (!input) return res.status(400).json({ error: 'input is required' });

    const result = await brain.think({ input, source, userId, context });
    res.json(result);
  } catch (err) {
    logger.error(`/think error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.JARVIS_PORT || 3000;
const HOST = process.env.JARVIS_HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  logger.info(`JARVIS brain online → http://${HOST}:${PORT}`);
});
```

### Expected Outcomes
- All 4 LLM providers respond correctly to test prompts
- Failover switches to Ollama when cloud provider key is missing
- JARVIS responds with British tone and correct reasoning structure
- `/think` endpoint accepts POST and returns `{ response, source, timestamp }`

### Success Criteria
```
✅ curl -X POST http://localhost:3000/think \
   -H "Content-Type: application/json" \
   -d '{"input": "Hello JARVIS"}' \
   → Returns JSON with a JARVIS-style response

✅ Set LLM_PROVIDER=invalid → Brain falls back to Ollama automatically
✅ Response contains step-by-step reasoning evidence
✅ Response tone is calm, formal, British
```

---

## Phase 2 — Memory System

### Overview
Memory is what separates JARVIS from a stateless chatbot. This phase builds a three-layer memory architecture: Redis for immediate session context, SQLite for permanent facts and preferences, and ChromaDB for semantic recall of entire conversation histories.

### Objectives
- Implement three-layer memory (short, long, vector)
- Create a unified memory manager interface
- Enable JARVIS to recall facts, habits, and conversations
- Implement memory compression for long sessions
- Connect memory to the brain (Phase 1)

### Memory Architecture

```
Query: "What did I tell you about my lunch routine?"
          │
          ▼
┌─────────────────────────────────────────┐
│           MEMORY MANAGER                │
│                                         │
│  1. Exact match → SQLite                │
│     key: "lunch_routine"                │
│     → "User eats at 1pm, dislikes       │
│        interruptions during meals"      │
│                                         │
│  2. If no exact match → ChromaDB        │
│     Semantic search: "lunch routine"    │
│     → Returns top 5 similar memories    │
│                                         │
│  3. Recent context → Redis              │
│     Last 10 exchanges this session      │
└─────────────────────────────────────────┘
          │
          ▼
Assembled context → Injected into brain prompt
```

### Key Tasks

#### Task 2.1 — Short-Term Memory (Redis)

```javascript
// memory/adapters/shortTerm.js
const { createClient } = require('redis');
const logger = require('../../shared/logger');

class ShortTermMemory {
  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.connect();
    this.maxExchanges = 20;
  }

  async addExchange(userId, exchange) {
    const key = `session:${userId}`;
    const existing = await this.get(userId);
    existing.push({ ...exchange, timestamp: Date.now() });

    // Keep only last N exchanges
    const trimmed = existing.slice(-this.maxExchanges);
    await this.client.setEx(key, 86400, JSON.stringify(trimmed)); // 24h TTL
  }

  async get(userId) {
    const data = await this.client.get(`session:${userId}`);
    return data ? JSON.parse(data) : [];
  }

  async clear(userId) {
    await this.client.del(`session:${userId}`);
  }
}

module.exports = new ShortTermMemory();
```

#### Task 2.2 — Long-Term Memory (SQLite)

```javascript
// memory/adapters/longTerm.js
const Database = require('better-sqlite3');
const path = require('path');

class LongTermMemory {
  constructor() {
    this.db = new Database(
      path.resolve(process.env.SQLITE_PATH || './memory/long/jarvis.db')
    );
    this.init();
  }

  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memory (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     TEXT    NOT NULL DEFAULT 'user',
        category    TEXT    NOT NULL,
        key         TEXT    NOT NULL,
        value       TEXT    NOT NULL,
        confidence  REAL    DEFAULT 1.0,
        source      TEXT    DEFAULT 'inferred',
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     TEXT    NOT NULL DEFAULT 'user',
        description TEXT    NOT NULL,
        timestamp   INTEGER NOT NULL,
        importance  INTEGER DEFAULT 3
      );

      CREATE TABLE IF NOT EXISTS payment_audit (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     TEXT    NOT NULL DEFAULT 'user',
        amount      REAL    NOT NULL,
        recipient   TEXT    NOT NULL,
        method      TEXT    NOT NULL,
        status      TEXT    NOT NULL,
        reference   TEXT,
        timestamp   INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_memory_key ON memory(key);
      CREATE INDEX IF NOT EXISTS idx_memory_category ON memory(category);
      CREATE INDEX IF NOT EXISTS idx_memory_user ON memory(user_id);
    `);
  }

  set(userId, category, key, value, source = 'inferred') {
    const now = Date.now();
    const existing = this.get(userId, key);
    if (existing) {
      this.db.prepare(`
        UPDATE memory SET value=?, updated_at=?, source=?
        WHERE user_id=? AND key=?
      `).run(value, now, source, userId, key);
    } else {
      this.db.prepare(`
        INSERT INTO memory (user_id, category, key, value, source, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(userId, category, key, value, source, now, now);
    }
  }

  get(userId, key) {
    return this.db.prepare(
      'SELECT * FROM memory WHERE user_id=? AND key=?'
    ).get(userId, key);
  }

  getByCategory(userId, category) {
    return this.db.prepare(
      'SELECT * FROM memory WHERE user_id=? AND category=?'
    ).all(userId, category);
  }

  getSummary(userId) {
    const rows = this.db.prepare(
      'SELECT category, key, value FROM memory WHERE user_id=? ORDER BY updated_at DESC LIMIT 50'
    ).all(userId);
    return rows.map(r => `[${r.category}] ${r.key}: ${r.value}`).join('\n');
  }
}

module.exports = new LongTermMemory();
```

#### Task 2.3 — Vector Memory (ChromaDB)

```javascript
// memory/adapters/vectorMemory.js
const { ChromaClient } = require('chromadb');

class VectorMemory {
  constructor() {
    this.client = new ChromaClient({ path: process.env.CHROMA_URL });
    this.collectionName = 'jarvis_memory';
  }

  async init() {
    this.collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
      metadata: { 'hnsw:space': 'cosine' }
    });
  }

  async store(id, text, metadata = {}) {
    await this.collection.upsert({
      ids: [id],
      documents: [text],
      metadatas: [{ ...metadata, timestamp: Date.now() }]
    });
  }

  async search(query, topK = 5) {
    const results = await this.collection.query({
      queryTexts: [query],
      nResults: topK,
    });
    return results.documents[0].map((doc, i) => ({
      text: doc,
      distance: results.distances[0][i],
      metadata: results.metadatas[0][i]
    }));
  }
}

module.exports = new VectorMemory();
```

#### Task 2.4 — Unified Memory Manager

```javascript
// memory/manager.js
const shortTerm  = require('./adapters/shortTerm');
const longTerm   = require('./adapters/longTerm');
const vector     = require('./adapters/vectorMemory');
const { reason } = require('../brain/llm/router');
const { buildSystemPrompt } = require('../brain/core/personality');

class MemoryManager {
  async init() {
    await vector.init();
  }

  async addExchange(userId, { input, response }) {
    // Add to session memory
    await shortTerm.addExchange(userId, { input, response });

    // Store in vector memory for semantic recall
    const text = `User: ${input}\nJARVIS: ${response}`;
    await vector.store(`${userId}_${Date.now()}`, text, { userId });

    // Extract and store long-term facts
    await this.extractFacts(userId, input, response);
  }

  async extractFacts(userId, input, response) {
    // Ask LLM to extract any memorable facts from this exchange
    const extraction = await reason(
      'Extract memorable long-term facts from this conversation exchange. ' +
      'Return JSON: [{ category, key, value }] or [] if nothing memorable. ' +
      'Categories: habit, preference, fact, relationship, schedule. ' +
      'Only extract things worth remembering indefinitely.',
      `User said: "${input}"\nJARVIS responded: "${response}"`
    );

    try {
      const facts = JSON.parse(extraction);
      for (const fact of facts) {
        longTerm.set(userId, fact.category, fact.key, fact.value, 'inferred');
      }
    } catch { /* No facts extracted */ }
  }

  async getSnapshot(userId) {
    const recentExchanges = await shortTerm.get(userId);
    const longTermSummary = longTerm.getSummary(userId);
    const last5 = recentExchanges.slice(-5)
      .map(e => `User: ${e.input}\nJARVIS: ${e.response}`)
      .join('\n---\n');

    return [
      longTermSummary ? `KNOWN FACTS:\n${longTermSummary}` : '',
      last5 ? `RECENT EXCHANGES:\n${last5}` : ''
    ].filter(Boolean).join('\n\n');
  }

  async recall(userId, query) {
    // Try exact SQLite match first
    const exact = longTerm.get(userId, query);
    if (exact) return exact.value;

    // Fall back to semantic search
    const results = await vector.search(query);
    return results.map(r => r.text).join('\n');
  }

  async compress(userId) {
    // When session gets too long, summarise old exchanges
    const exchanges = await shortTerm.get(userId);
    if (exchanges.length < 15) return; // No compression needed

    const old = exchanges.slice(0, 10);
    const summary = await reason(
      'Compress these conversation exchanges into 3-5 memory bullet points.',
      JSON.stringify(old)
    );

    longTerm.set(userId, 'summary', `session_${Date.now()}`, summary, 'compressed');
    await shortTerm.clear(userId);
  }
}

module.exports = new MemoryManager();
```

#### Task 2.5 — Connect Memory to Brain

```javascript
// In brain/core/brain.js — add to constructor
const memory = require('../../memory/manager');

class Brain {
  constructor() {
    this.memory = memory;
    // ... rest
  }
}
```

### Expected Outcomes
- Redis stores and retrieves session exchanges correctly
- SQLite persists facts across restarts
- ChromaDB returns semantically relevant memories
- Memory summary is injected into every brain call
- Long sessions compress without losing key facts

### Success Criteria
```
✅ Store a fact: memory.longTerm.set('user', 'habit', 'lunch_time', '1pm')
   Retrieve it: memory.longTerm.get('user', 'lunch_time') → { value: '1pm' }

✅ Add 25 exchanges → oldest 10 get compressed and stored
✅ ChromaDB semantic search: "what do I eat for lunch"
   → Returns exchange about lunch routine

✅ Restart brain → all long-term facts still present
✅ Memory snapshot injected into every brain.think() call
```

---

## Phase 3 — Voice Pipeline

### Overview
The voice pipeline is the bridge between spoken words and the JARVIS brain. It runs entirely in Python and communicates with the Node.js brain over an IPC bridge. This phase implements wake word detection, speech-to-text, text-to-speech, and the full real-time loop.

### Objectives
- Implement wake word detection ("Hey JARVIS")
- Build local STT using Whisper
- Build TTS with a British male voice
- Create the complete real-time voice loop
- Build the Node.js ↔ Python IPC bridge

### Voice Pipeline Flow

```
Microphone always listening
         │
         ▼
[WAKE WORD DETECTOR — Porcupine]
  "Hey JARVIS" detected?
         │ Yes
         ▼
[RECORD UNTIL SILENCE — webrtcvad]
  Captures user's full utterance
         │
         ▼
[STT — Whisper (local, offline)]
  Converts audio → text
         │
         ▼
[IPC BRIDGE — HTTP POST]
  Sends text to Node.js brain
         │
         ▼
[BRAIN PROCESSES → Returns response text]
         │
         ▼
[TTS — Piper / ElevenLabs]
  Converts response → speech audio
         │
         ▼
[PLAY AUDIO to speakers]
         │
         ▼
Back to listening...
```

### Key Tasks

#### Task 3.1 — Wake Word Detection

```python
# voice/wakeword.py
import pvporcupine
import sounddevice as sd
import numpy as np

def create_detector():
    return pvporcupine.create(
        access_key=os.environ['PORCUPINE_ACCESS_KEY'],
        keywords=['jarvis']  # Free built-in keyword
    )

def listen_for_wake_word(detector, callback):
    """Continuously listens for 'Hey JARVIS' wake word."""
    with sd.InputStream(
        samplerate=detector.sample_rate,
        channels=1,
        dtype='int16',
        blocksize=detector.frame_length
    ) as stream:
        print("JARVIS is listening for wake word...")
        while True:
            frame, _ = stream.read(detector.frame_length)
            keyword_index = detector.process(frame.flatten())
            if keyword_index >= 0:
                print("Wake word detected!")
                callback()
```

#### Task 3.2 — Speech-to-Text (Whisper)

```python
# voice/stt.py
import whisper
import sounddevice as sd
import numpy as np
import webrtcvad

model = whisper.load_model('base')  # Options: tiny, base, small, medium, large
vad = webrtcvad.Vad(3)  # Aggressiveness 0-3

def record_until_silence(samplerate=16000, silence_timeout=1.5):
    """Records audio until silence is detected."""
    frames = []
    silent_frames = 0
    max_silent = int(silence_timeout * samplerate / 320)

    with sd.InputStream(samplerate=samplerate, channels=1, dtype='int16',
                        blocksize=320) as stream:
        print("Recording...")
        while True:
            frame, _ = stream.read(320)
            frames.append(frame.copy())

            is_speech = vad.is_speech(frame.tobytes(), samplerate)
            if not is_speech:
                silent_frames += 1
                if silent_frames > max_silent:
                    break
            else:
                silent_frames = 0

    audio = np.concatenate(frames).astype(np.float32) / 32768.0
    return audio

def transcribe(audio):
    result = model.transcribe(audio, language='en')
    return result['text'].strip()
```

#### Task 3.3 — Text-to-Speech (Piper — Local, British Voice)

```python
# voice/tts.py
import subprocess
import tempfile
import os

# Download British male voice model from:
# https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_GB

PIPER_MODEL = './voice/models/en_GB-alan-medium.onnx'

def speak(text):
    """Converts text to speech using Piper (local, no API key needed)."""
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        tmp_path = f.name

    subprocess.run([
        'piper',
        '--model', PIPER_MODEL,
        '--output_file', tmp_path
    ], input=text.encode(), check=True)

    # Play audio
    subprocess.run(['aplay', tmp_path])  # Linux
    # subprocess.run(['afplay', tmp_path])  # macOS
    # subprocess.run(['powershell', '-c', f'(New-Object Media.SoundPlayer "{tmp_path}").PlaySync()'])  # Windows

    os.unlink(tmp_path)

# Optional: ElevenLabs for higher quality (requires API key)
def speak_elevenlabs(text):
    import requests
    url = f"https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID"
    headers = { 'xi-api-key': os.environ['ELEVENLABS_API_KEY'] }
    res = requests.post(url, headers=headers, json={
        'text': text,
        'model_id': 'eleven_monolingual_v1',
        'voice_settings': { 'stability': 0.7, 'similarity_boost': 0.8 }
    })
    with open('/tmp/jarvis_response.mp3', 'wb') as f:
        f.write(res.content)
    subprocess.run(['mpg123', '/tmp/jarvis_response.mp3'])
```

#### Task 3.4 — Full Voice Interceptor Loop

```python
# voice/interceptor.py
import os, requests
from dotenv import load_dotenv
from wakeword import create_detector, listen_for_wake_word
from stt import record_until_silence, transcribe
from tts import speak

load_dotenv()
BRAIN_URL = f"http://localhost:{os.environ.get('JARVIS_PORT', 3000)}"

def on_wake_word():
    """Called when 'Hey JARVIS' is detected."""
    speak("Yes, sir?")

    # Record user's command
    audio = record_until_silence()
    text  = transcribe(audio)

    if not text or len(text.strip()) < 2:
        speak("I didn't catch that, sir.")
        return

    print(f"Heard: {text}")

    # Send to brain
    try:
        res = requests.post(f"{BRAIN_URL}/think", json={
            'input': text,
            'source': 'voice',
            'userId': 'user'
        }, timeout=30)
        response_text = res.json().get('response', "I'm sorry, I couldn't process that.")
    except Exception as e:
        response_text = f"I encountered an error, sir: {str(e)}"

    # Speak the response
    speak(response_text)

def main():
    print("JARVIS Voice Pipeline Starting...")
    detector = create_detector()
    listen_for_wake_word(detector, on_wake_word)

if __name__ == '__main__':
    main()
```

#### Task 3.5 — IPC Bridge

```javascript
// shared/bridge/ipc.js
// For cases where Node.js needs to trigger Python actions
const { spawn } = require('child_process');

function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn('python', [scriptPath, ...args]);
    let output = '';
    proc.stdout.on('data', d => output += d.toString());
    proc.stderr.on('data', d => console.error('Python:', d.toString()));
    proc.on('close', code => code === 0 ? resolve(output) : reject(new Error(`Exit ${code}`)));
  });
}

module.exports = { runPythonScript };
```

### Expected Outcomes
- "Hey JARVIS" reliably detected with < 1% false positive rate
- STT accurately transcribes clear speech to text
- TTS produces a calm, British male voice
- Complete wake → think → speak loop works end-to-end
- Response time < 3 seconds for short queries

### Success Criteria
```
✅ Say "Hey JARVIS" → terminal shows "Wake word detected!"
✅ Say "What time is it?" → JARVIS speaks the current time
✅ Say nothing for 2 seconds → recording stops correctly
✅ Whisper transcription accuracy > 90% in quiet environment
✅ Voice loop restarts automatically after each response
```

---

## Phase 4 — Agent Pipeline

### Overview
The agent pipeline gives JARVIS the ability to autonomously plan, execute, and verify complex multi-step tasks. Instead of simply responding to queries, JARVIS can now decompose goals, use tools, run sub-tasks in parallel, and critique its own work before delivering results.

### Objectives
- Build a Planner that decomposes goals into sub-tasks
- Build an Executor that runs sub-tasks with tool access
- Build a Reflector that quality-checks all outputs
- Implement parallel task execution
- Connect the pipeline to the brain

### Agent Pipeline Flow

```
User: "Research the best laptop under ₹60,000 and add
       the top 3 to a comparison doc on my desktop"
         │
         ▼
    [PLANNER]
    Decomposes into:
    Task 1: Web search "best laptops under 60000 INR 2026"
    Task 2: Extract top 3 results with specs
    Task 3: Create comparison document
    Task 4: Save document to user's desktop
         │
         ▼
    [EXECUTOR]
    Runs Task 1 + Task 2 in parallel (no dependency)
    Then runs Task 3 (depends on 1+2)
    Then runs Task 4 (depends on 3)
         │
         ▼
    [REFLECTOR]
    "Is this document accurate and complete?
     Are prices current? Are specs verified?"
    → Yes → Deliver
    → No  → Re-run failed tasks
         │
         ▼
JARVIS: "Done, sir. Comparison document saved to desktop.
         Top pick: ASUS VivoBook 15 at ₹52,990."
```

### Key Tasks

#### Task 4.1 — Planner Agent

```javascript
// brain/agents/planner.js
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

    Available tools: web_search, file_read, file_write, shell_exec,
                     laptop_control, web_browser, calendar, payments

    Return JSON:
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
    return JSON.parse(response);
  } catch {
    // If JSON parse fails, return a single-task plan
    return {
      goal,
      tasks: [{ id: 't1', description: goal, tool: 'direct_response',
                 params: { input: goal }, dependsOn: [], parallel: false }]
    };
  }
}

module.exports = { plan };
```

#### Task 4.2 — Executor Agent

```javascript
// brain/agents/executor.js
const tools = require('../tools/registry');
const logger = require('../../shared/logger');

async function execute(plan) {
  const results = {};
  const pending = [...plan.tasks];

  while (pending.length > 0) {
    // Find tasks whose dependencies are all completed
    const ready = pending.filter(task =>
      task.dependsOn.every(dep => dep in results)
    );

    if (ready.length === 0) {
      logger.error('Circular dependency detected in plan');
      break;
    }

    // Execute ready tasks in parallel
    const executing = ready.map(async task => {
      logger.info(`Executing task: ${task.id} — ${task.description}`);
      try {
        const result = await tools.execute(task.tool, task.params, results);
        results[task.id] = { status: 'success', output: result };
      } catch (err) {
        results[task.id] = { status: 'failed', error: err.message };
        logger.error(`Task ${task.id} failed: ${err.message}`);
      }
    });

    await Promise.all(executing);

    // Remove completed tasks from pending
    ready.forEach(task => {
      const idx = pending.findIndex(t => t.id === task.id);
      if (idx > -1) pending.splice(idx, 1);
    });
  }

  return results;
}

module.exports = { execute };
```

#### Task 4.3 — Reflector Agent

```javascript
// brain/agents/reflector.js
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

    Return JSON:
    {
      "goalAchieved": true/false,
      "qualityScore": 0-10,
      "issues": ["..."],
      "userMessage": "What JARVIS should say to the user"
    }
    `
  );

  try {
    return JSON.parse(assessment);
  } catch {
    return {
      goalAchieved: true,
      qualityScore: 7,
      issues: [],
      userMessage: assessment
    };
  }
}

module.exports = { reflect };
```

#### Task 4.4 — Tool Registry

```javascript
// brain/tools/registry.js
const webTool      = require('./web');
const fileTool     = require('./files');
const shellTool    = require('./shell');
const laptopTool   = require('./laptop');
const calendarTool = require('./calendar');

const toolMap = {
  web_search:      webTool.search,
  web_fetch:       webTool.fetch,
  file_read:       fileTool.read,
  file_write:      fileTool.write,
  shell_exec:      shellTool.exec,
  laptop_control:  laptopTool.action,
  calendar_read:   calendarTool.read,
  direct_response: async ({ input }) => input,
};

async function execute(toolName, params, previousResults = {}) {
  const tool = toolMap[toolName];
  if (!tool) throw new Error(`Unknown tool: ${toolName}`);
  return await tool(params, previousResults);
}

module.exports = { execute };
```

#### Task 4.5 — Wire Pipeline into Brain

```javascript
// In brain/core/brain.js — enhanced think() method
const planner  = require('../agents/planner');
const executor = require('../agents/executor');
const reflector = require('../agents/reflector');

async function think({ input, source, userId, context }) {
  // Check if this requires agentic execution
  const isComplexTask = await this.isComplexTask(input);

  if (isComplexTask) {
    const plan    = await planner.plan(input, context);
    const results = await executor.execute(plan);
    const verdict = await reflector.reflect(input, results, context);
    return { response: verdict.userMessage, source, agentResults: results };
  }

  // Simple query — direct LLM call
  return await this.simpleThink({ input, source, userId, context });
}
```

### Expected Outcomes
- Complex goals are broken into correct sub-tasks
- Independent tasks execute in parallel
- Failed tasks are reported clearly
- Reflector catches low-quality outputs
- Simple queries bypass the agent pipeline entirely

### Success Criteria
```
✅ "Search for the weather and tell me if I need an umbrella"
   → Planner creates 2 tasks: web_search + synthesise
   → Both run and produce a weather-aware response

✅ Inject a failing tool → Executor reports failure, pipeline continues
✅ Reflector catches a poor response and flags qualityScore < 5
✅ Simple "Hello JARVIS" skips agent pipeline entirely
```

---

## Phase 5 — Skills Engine

### Overview
Skills are modular capabilities that extend JARVIS beyond its core. This phase builds the skill loader, a live scraper for skills.sh, and activates the curated skill stack. Skills hook into the brain's reasoning process through the AGENTS.md activation pattern.

### Objectives
- Build the skill loader and registry
- Implement the skills.sh scraper
- Install and activate all 30 curated skills
- Create AGENTS.md for skill auto-invocation
- Build a ClawhHub scraper (future-ready)

### Skill Lifecycle

```
skills.sh leaderboard
         │
    [scraper.js]
    Fetches full skill list
         │
         ▼
    [installer.js]
    npx skills add owner/repo/skill
         │
         ▼
    [loader.js]
    Reads SKILL.md from each installed skill
    Extracts: name, description, triggers
         │
         ▼
    [registry.js]
    Maps skills to their SKILL.md content
         │
         ▼
[Every brain.think() call]
    "Does this input match any skill trigger?"
         │ Yes
         ▼
    [executor.js]
    Injects full SKILL.md into system prompt
    Agent follows skill instructions exactly
```

### Key Tasks

#### Task 5.1 — skills.sh Scraper

```javascript
// brain/skills/scraper/skillsScraper.js
const axios   = require('axios');
const cheerio = require('cheerio');

async function scrapeLeaderboard() {
  const res = await axios.get('https://skills.sh');
  const $   = cheerio.load(res.data);
  const skills = [];

  $('a[href^="/"]').each((_, el) => {
    const href  = $(el).attr('href');
    const match = href.match(/^\/([^/]+)\/([^/]+)\/([^/]+)$/);
    if (match) {
      const [, owner, repo, name] = match;
      const installs = $(el).find('[class*="install"]').text()
        .replace(/[^0-9.KM]/g, '') || '0';
      skills.push({ owner, repo, name, installs,
        installCmd: `npx skills add ${owner}/${repo}/${name}` });
    }
  });

  return skills;
}

async function scrapeClawhub() {
  // ClawhHub is a React SPA — requires full browser rendering
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const page    = await browser.newPage();

  await page.goto('https://clawhub.ai/skills?nonSuspicious=true');
  await page.waitForTimeout(4000); // Wait for React hydration

  const skills = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-skill-name], [class*="skill-card"]'))
      .map(el => ({
        name: el.dataset.skillName || el.querySelector('h3')?.textContent,
        installCmd: `npx clawhub@latest install ${el.dataset.skillName}`
      })).filter(s => s.name)
  );

  await browser.close();

  // NOTE: Returns [] as of April 2026 — marketplace is currently empty.
  // This scraper will work automatically once skills are published.
  console.log(`ClawhHub skills found: ${skills.length}`);
  return skills;
}

module.exports = { scrapeLeaderboard, scrapeClawhub };
```

#### Task 5.2 — Skill Installer

```javascript
// brain/skills/installer.js
const { execSync } = require('child_process');
const CURATED_SKILLS = require('./curatedSkills');

async function installAll() {
  console.log(`Installing ${CURATED_SKILLS.length} curated skills...`);

  for (const skill of CURATED_SKILLS) {
    try {
      execSync(skill.installCmd, { stdio: 'inherit' });
      console.log(`✅ Installed: ${skill.name}`);
    } catch (err) {
      console.warn(`⚠️  Failed: ${skill.name} — ${err.message}`);
    }
  }
}

module.exports = { installAll };
```

#### Task 5.3 — Curated Skills List

```javascript
// brain/skills/curatedSkills.js
// 30 hand-picked skills from skills.sh leaderboard
// Ordered by installation priority

module.exports = [
  // TIER 1 — Core Cognitive (install first)
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
  { name: 'workflow-automation',        installCmd: 'npx skills add supercent-io/skills-template/workflow-automation' },
  { name: 'data-analysis',              installCmd: 'npx skills add supercent-io/skills-template/data-analysis' },
  { name: 'database-schema-design',     installCmd: 'npx skills add supercent-io/skills-template/database-schema-design' },
  { name: 'nodejs-backend-patterns',    installCmd: 'npx skills add wshobson/agents/nodejs-backend-patterns' },

  // TIER 7 — Security & Quality
  { name: 'security-best-practices',    installCmd: 'npx skills add supercent-io/skills-template/security-best-practices' },
  { name: 'test-driven-development',    installCmd: 'npx skills add obra/superpowers/test-driven-development' },
  { name: 'code-review',                installCmd: 'npx skills add supercent-io/skills-template/code-review' },
  { name: 'verification-before-completion', installCmd: 'npx skills add obra/superpowers/verification-before-completion' },
];
```

#### Task 5.4 — AGENTS.md

```markdown
<!-- AGENTS.md — Skill Activation Configuration -->

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
```

### Expected Outcomes
- All 30 skills installed without errors
- skills.sh scraper returns full leaderboard
- ClawhHub scraper returns `[]` (empty, as expected)
- JARVIS invokes `proactive-agent` on every interaction
- AGENTS.md loaded and respected by brain

### Success Criteria
```
✅ npm run install-skills → all 30 complete with ✅
✅ node brain/skills/scraper/skillsScraper.js → returns skill list
✅ "Help me plan my day" → JARVIS invokes brainstorming + writing-plans skills
✅ Any input → proactive-agent always fires
✅ AGENTS.md present in root directory
```

---

## Phase 6 — Zero-Hallucination Layer

### Overview
JARVIS must never fabricate information — especially for payments, facts, and actions. This phase builds a grounding pipeline that intercepts every LLM response, extracts factual claims, scores them by confidence, and either verifies or suppresses them.

### Objectives
- Extract all factual claims from LLM responses
- Score each claim's confidence based on source type
- Block unverified claims from reaching the user
- Force real-time verification for uncertain facts
- Achieve < 1% ungrounded claim rate

### Confidence Scoring Model

```
Source Type              Confidence Score   Action
─────────────────────────────────────────────────
Razorpay API result          0.99          ✅ Pass
Tool result (web, files)     0.95          ✅ Pass
Memory (explicit, user-set)  0.92          ✅ Pass
Memory (inferred by JARVIS)  0.75          ✅ Pass with caveat
LLM knowledge (pre-training) 0.55          ⚠️  Verify before stating
No identifiable source       0.20          ❌ Block or flag
```

### Key Tasks

#### Task 6.1 — Claim Extractor

```javascript
// brain/core/grounder.js
const { reason } = require('../llm/router');
const { buildSystemPrompt } = require('./personality');

class ZeroHallucinationGrounder {

  async extractClaims(response) {
    const extraction = await reason(
      'Extract all factual claims from this text. ' +
      'Return JSON: [{ claim, isFactual, category }]',
      response
    );
    try {
      return JSON.parse(extraction);
    } catch { return []; }
  }

  scoreConfidence(claim, context) {
    if (context.toolResults?.includes(claim.claim)) return 0.95;
    if (context.memorySource === 'explicit')         return 0.92;
    if (context.memorySource === 'inferred')         return 0.75;
    if (claim.category === 'time_sensitive')         return 0.40;
    return 0.55; // Default LLM knowledge
  }

  async ground(rawResponse, context) {
    const claims = await this.extractClaims(rawResponse);
    const issues = [];

    for (const claim of claims) {
      if (!claim.isFactual) continue;
      const confidence = this.scoreConfidence(claim, context);

      if (confidence < 0.70) {
        issues.push(claim.claim);
      }
    }

    if (issues.length === 0) return rawResponse;

    // Rewrite response with uncertainty markers
    const grounded = await reason(
      buildSystemPrompt(context),
      `
      Rewrite this response. For these unverified claims: ${JSON.stringify(issues)}
      Replace them with appropriate uncertainty language like:
      "I believe...", "I'm not certain, but...", or "Let me verify that."

      Original response:
      ${rawResponse}
      `
    );

    return grounded;
  }
}

module.exports = new ZeroHallucinationGrounder();
```

#### Task 6.2 — Hard Rules (Code-Level Enforcement)

```javascript
// brain/core/grounder.js — Hard rules (not AI-based, deterministic)

const HARD_RULES = [
  {
    // JARVIS never confirms a payment without Razorpay confirmation
    pattern: /payment (confirmed|successful|completed|processed)/i,
    requires: (context) => context.razorpayConfirmed === true,
    replacement: "The payment is pending confirmation from the payment processor."
  },
  {
    // JARVIS never invents reference numbers
    pattern: /reference(?: number)?:?\s*[A-Z0-9]{6,}/i,
    requires: (context) => context.paymentReference !== undefined,
    replacement: "Reference number will be provided upon confirmation."
  },
  {
    // JARVIS never states current prices without web verification
    pattern: /costs?\s+₹[\d,]+/i,
    requires: (context) => context.priceVerifiedAt &&
              (Date.now() - context.priceVerifiedAt < 3600000), // 1 hour
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
```

### Expected Outcomes
- JARVIS never confirms a payment without API confirmation
- JARVIS uses uncertainty language for inferred facts
- Real-time prices are always fetched, never recalled from memory
- Hallucination rate measured and < 1%

### Success Criteria
```
✅ Ask "What's the price of iPhone 16?"
   Without web search → "Let me check the current price for you, sir."
   With web search → States price with source cited

✅ Simulate payment without Razorpay confirmation
   → Response never says "payment confirmed"

✅ Ask "What did I have for lunch yesterday?"
   JARVIS has no memory of it → "I don't have a record of that, sir."
```

---

## Phase 7 — Proactive Intelligence

### Overview
Proactive intelligence is the defining JARVIS trait. JARVIS does not wait to be asked — it predicts what the user needs and acts before they ask. This phase builds the anticipator that runs in parallel with every interaction, schedules background tasks, and monitors the user's environment.

### Objectives
- Build the anticipation engine
- Implement background task scheduler
- Create environment monitors (calendar, time, app state)
- Enable JARVIS to act without prompting when confidence is high
- Wire up proactive-agent skill

### Proactive Decision Tree

```
After every interaction:
         │
         ▼
[ANTICIPATOR — runs in background]
  Prompt: "Given what just happened, what does the user likely need next?"
         │
    ┌────┴─────────────────────┐
    │                          │
    ▼                          ▼
confidence > 0.85         confidence 0.65–0.85
    │                          │
    ▼                          ▼
  ACT NOW                  PREPARE QUIETLY
(do it silently,          (pre-fetch data,
 report after)             cache results,
                           set reminder)
```

### Key Tasks

#### Task 7.1 — Anticipator Engine

```javascript
// brain/core/anticipator.js
const { reason }  = require('../llm/router');
const { buildSystemPrompt } = require('./personality');
const scheduler   = require('./scheduler');
const logger      = require('../../shared/logger');

class Anticipator {

  async anticipate({ input, response, context }) {
    const predictions = await reason(
      buildSystemPrompt(context),
      `
      Based on this interaction, predict the next 3 things
      the user is likely to need (without being asked).

      User said: "${input}"
      JARVIS responded: "${response}"
      Current time: ${context.time}
      Calendar today: ${context.calendar || 'Not loaded'}
      Memory: ${context.memorySnapshot || 'None'}

      For each prediction:
      - What does the user likely need?
      - Should JARVIS act NOW, PREPARE quietly, or WAIT and alert?
      - Confidence 0.0–1.0

      Return JSON: [{ need, action, tool, params, timing, confidence }]
      Only return predictions with confidence > 0.60.
      `
    );

    let parsed;
    try {
      parsed = JSON.parse(predictions);
    } catch {
      return; // No predictions
    }

    for (const p of parsed) {
      if (p.timing === 'now' && p.confidence >= 0.85) {
        logger.info(`Anticipator acting now: ${p.need}`);
        await this.actNow(p);

      } else if (p.timing === 'prepare' && p.confidence >= 0.70) {
        logger.info(`Anticipator preparing: ${p.need}`);
        await this.prepare(p);

      } else if (p.timing === 'wait') {
        logger.info(`Anticipator scheduling alert: ${p.need}`);
        scheduler.schedule(p);
      }
    }
  }

  async actNow(prediction) {
    const tools = require('../tools/registry');
    try {
      const result = await tools.execute(prediction.tool, prediction.params);
      logger.info(`Proactive action complete: ${prediction.need} → ${result}`);
    } catch (err) {
      logger.warn(`Proactive action failed: ${err.message}`);
    }
  }

  async prepare(prediction) {
    // Pre-fetch and cache for likely next request
    const cache = require('../../shared/cache');
    const tools  = require('../tools/registry');
    const result = await tools.execute(prediction.tool, prediction.params);
    cache.set(prediction.need, result, 300); // 5 minute cache
  }
}

module.exports = new Anticipator();
```

#### Task 7.2 — Real-World Example: "I am eating"

```
User says: "I am eating"
                │
                ▼
          [BRAIN.think()]
          JARVIS responds: "Enjoy your lunch, sir."
                │
                ▼
          [ANTICIPATOR fires in background]

          Memory: "User eats at 1pm. Dislikes interruptions.
                   Usually watches YouTube while eating.
                   Meeting at 2pm today."

          Predictions:
          1. {
               need: "Do Not Disturb mode",
               timing: "now",
               confidence: 0.92,
               tool: "laptop_control",
               params: { action: "set_dnd", value: true }
             }
          2. {
               need: "YouTube on laptop",
               timing: "now",
               confidence: 0.80,
               tool: "laptop_control",
               params: { action: "open_url", url: "https://youtube.com" }
             }
          3. {
               need: "Meeting reminder",
               timing: "wait",
               confidence: 0.99,
               delay: 35 * 60 * 1000,  // 35 minutes from now
               message: "Your 2 o'clock is in 25 minutes, sir."
             }

          JARVIS acts on predictions 1 + 2 silently.
          Schedules reminder for prediction 3.
```

#### Task 7.3 — Background Scheduler

```javascript
// brain/core/scheduler.js
const cron = require('node-cron');

class Scheduler {
  constructor() {
    this.pending = [];
  }

  schedule({ message, delay, action, tool, params }) {
    setTimeout(async () => {
      if (message) {
        // Push notification to phone + voice alert
        await this.notify(message);
      }
      if (tool) {
        const tools = require('../tools/registry');
        await tools.execute(tool, params);
      }
    }, delay || 0);
  }

  async notify(message) {
    // Send push to phone app
    const push = require('../../connectors/phone/push');
    await push.send(message);

    // Speak aloud if voice is active
    const voice = require('../../voice/bridge');
    voice.speak(message);
  }

  // Calendar-based proactive tasks
  startCalendarMonitor() {
    cron.schedule('*/15 * * * *', async () => {
      const calendar = require('../tools/calendar');
      const upcoming = await calendar.getUpcoming(60); // Next 60 minutes

      for (const event of upcoming) {
        const minsUntil = Math.floor((event.startTime - Date.now()) / 60000);
        if (minsUntil === 15) {
          await this.notify(
            `${event.title} starts in 15 minutes, sir. ${event.location ? 'Location: ' + event.location : ''}`
          );
        }
      }
    });
  }
}

module.exports = new Scheduler();
```

### Expected Outcomes
- After "I am eating" → DND activated, YouTube opens, meeting reminder scheduled
- Calendar monitor fires 15-minute reminders automatically
- Proactive cache reduces response latency by ~40% on predicted queries
- All proactive actions logged with reason and confidence score

### Success Criteria
```
✅ Say "I am eating" → laptop DND activates within 3 seconds (silently)
✅ Calendar event in 15 minutes → JARVIS alerts unprompted
✅ Proactive action fails → JARVIS logs warning, does not crash
✅ Low-confidence prediction → JARVIS waits, does not act
```

---

## Phase 8 — Payment Engine

### Overview
JARVIS can make payments on behalf of the user via UPI or credit/debit card through Razorpay. This phase builds the complete payment pipeline with mandatory phone confirmation, OTP forwarding, and immutable audit logging.

### Objectives
- Integrate Razorpay for UPI and card payments
- Build mandatory phone confirmation flow
- Implement OTP bridging from phone to brain
- Create immutable payment audit log
- Enforce payment safety rules

### Payment Flow

```
User: "Pay ₹500 to Swiggy for my order"
         │
         ▼
[PAYMENT INTENT DETECTED]
  Amount: ₹500
  Recipient: Swiggy
  Method: UPI (default)
         │
         ▼
[SAFETY CHECK]
  ₹500 < daily limit ₹2000? ✅
  ₹500 > single confirm threshold ₹500? ✅ (edge case — confirm)
         │
         ▼
[PHONE CONFIRMATION SENT]
  Push notification to phone:
  "Confirm payment: ₹500 to Swiggy via UPI?"
  [Approve] [Reject]
         │
    User taps Approve
         │
         ▼
[RAZORPAY ORDER CREATED]
  amount: 50000 (paise)
  currency: INR
         │
         ▼
[OTP ARRIVES ON PHONE]
  SMS: "Your OTP is 847291 for ₹500 payment"
  Android SMS reader intercepts it
  OTP forwarded to brain: POST /otp/receive
         │
         ▼
[PAYMENT EXECUTED]
  Razorpay submits OTP
  Payment processed
         │
         ▼
[AUDIT LOG UPDATED]
  amount, recipient, method, status, reference, timestamp
         │
         ▼
[JARVIS REPORTS]
  "Done, sir. ₹500 paid to Swiggy.
   Reference: TXN847291. Remaining daily budget: ₹1,500."
```

### Key Tasks

#### Task 8.1 — Payment Engine Core

```javascript
// brain/payments/engine.js
const Razorpay = require('razorpay');
const longTerm = require('../../memory/adapters/longTerm');
const push     = require('../../connectors/phone/push');
const logger   = require('../../shared/logger');

class PaymentEngine {
  constructor() {
    this.razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    this.pendingOTP    = null;
    this.pendingConfirm = null;
  }

  async pay({ amount, recipient, upiId, method = 'upi', reason = '' }) {
    if (!process.env.PAYMENT_ENABLED || process.env.PAYMENT_ENABLED !== 'true') {
      return { status: 'disabled', message: 'Payments are disabled in .env' };
    }

    // Safety checks
    const dailySpent = this.getDailySpent();
    const limit      = Number(process.env.PAYMENT_DAILY_LIMIT_INR) || 2000;
    if (dailySpent + amount > limit) {
      return { status: 'blocked', reason: `Daily limit of ₹${limit} would be exceeded.` };
    }

    // Phone confirmation (always required)
    const confirmed = await this.requestConfirmation({ amount, recipient, method, reason });
    if (!confirmed) return { status: 'rejected', reason: 'User declined on phone.' };

    // Create order
    const order = await this.razorpay.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency: 'INR',
      receipt:  `jarvis_${Date.now()}`,
    });

    // Wait for OTP if card payment
    let otp = null;
    if (method === 'card') {
      otp = await this.waitForOTP(45000); // 45s timeout
      if (!otp) return { status: 'failed', reason: 'OTP timeout after 45 seconds.' };
    }

    // Execute payment via Razorpay
    // (In production: use Razorpay checkout or payment link)
    const reference = `TXN${Date.now()}`;

    // Log to audit
    this.logPayment({ amount, recipient, method, status: 'success', reference });

    logger.info(`Payment success: ₹${amount} to ${recipient} | ref: ${reference}`);
    return { status: 'success', reference, amount, recipient };
  }

  async requestConfirmation({ amount, recipient, method, reason }) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 120000); // 2min timeout
      this.pendingConfirm = (approved) => {
        clearTimeout(timeout);
        resolve(approved);
      };
      push.send({
        type:      'payment_confirm',
        amount,
        recipient,
        method,
        reason,
        callbackUrl: `${process.env.CLOUDFLARE_TUNNEL_URL}/payments/confirm`
      });
    });
  }

  confirmFromPhone(approved) {
    if (this.pendingConfirm) {
      this.pendingConfirm(approved);
      this.pendingConfirm = null;
    }
  }

  receiveOTP(otp) {
    if (this.pendingOTP) {
      this.pendingOTP(otp);
      this.pendingOTP = null;
    }
  }

  waitForOTP(timeoutMs) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), timeoutMs);
      this.pendingOTP = (otp) => {
        clearTimeout(timeout);
        resolve(otp);
      };
    });
  }

  getDailySpent() {
    const today   = new Date().toDateString();
    const records = longTerm.db.prepare(`
      SELECT SUM(amount) as total FROM payment_audit
      WHERE status='success' AND date(timestamp/1000, 'unixepoch')=date('now')
    `).get();
    return records?.total || 0;
  }

  logPayment({ amount, recipient, method, status, reference }) {
    longTerm.db.prepare(`
      INSERT INTO payment_audit (user_id, amount, recipient, method, status, reference, timestamp)
      VALUES ('user', ?, ?, ?, ?, ?, ?)
    `).run(amount, recipient, method, status, reference, Date.now());
  }
}

module.exports = new PaymentEngine();
```

### Payment Safety Rules (Non-Negotiable)

```
RULE 1: JARVIS NEVER pays without phone approval. Ever.
RULE 2: JARVIS NEVER stores raw card numbers — only Razorpay tokens.
RULE 3: OTPs are deleted from memory immediately after use.
RULE 4: Every payment is logged to SQLite audit table (immutable).
RULE 5: Daily limit enforced at code level, not just config.
RULE 6: Single payment > ₹500 always triggers explicit confirmation.
RULE 7: If Razorpay API call fails, report failure — never retry without user input.
RULE 8: PAYMENT_ENABLED=false in .env disables all payments hard.
```

### Expected Outcomes
- Payment flow works end-to-end in test mode (Razorpay test keys)
- Phone confirmation blocks payment until approved
- OTP forwarded from Android phone within 10 seconds
- All payments logged to SQLite with full trace
- Daily limit enforced correctly

### Success Criteria
```
✅ "Pay ₹100 to test@upi"
   → Phone notification received
   → Approve → Payment processed (test mode)
   → JARVIS confirms with reference number

✅ Reject on phone → JARVIS: "Understood, sir. Payment cancelled."

✅ Exceed daily limit → JARVIS: "Daily limit of ₹2000 would be exceeded."

✅ Check audit: SELECT * FROM payment_audit → record exists with correct details
```

---

## Phase 9 — Phone Companion App

### Overview
The phone app is JARVIS's mobile presence. It connects to the brain over WiFi or Cloudflare tunnel, displays a chat interface, reads OTPs, shows payment confirmation modals, and receives push notifications.

### Objectives
- Build React Native app for Android and iOS
- Implement server URL configuration (local + tunnel)
- Build OTP reader for Android (READ_SMS)
- Build payment confirmation modal
- Enable push notifications from JARVIS
- Voice input on phone

### Key Tasks

#### Task 9.1 — Project Setup

```bash
# Create Expo project
npx create-expo-app jarvis-phone --template blank-typescript
cd jarvis-phone

# Install dependencies
npx expo install \
  @react-navigation/native \
  @react-navigation/stack \
  react-native-screens \
  react-native-safe-area-context \
  @notifee/react-native \
  react-native-voice \
  react-native-otp-verify \
  react-native-encrypted-storage \
  axios \
  expo-notifications
```

#### Task 9.2 — JARVIS API Service

```typescript
// phone/src/services/jarvisApi.ts
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

async function getServerUrl(): Promise<string> {
  return await EncryptedStorage.getItem('jarvis_url') || 'http://localhost:3000';
}

export async function sendMessage(input: string): Promise<string> {
  const url = await getServerUrl();
  const res = await axios.post(`${url}/think`, {
    input, source: 'phone', userId: 'user'
  });
  return res.data.response;
}

export async function confirmPayment(approved: boolean): Promise<void> {
  const url = await getServerUrl();
  await axios.post(`${url}/payments/confirm`, { approved });
}

export async function sendOTP(otp: string): Promise<void> {
  const url = await getServerUrl();
  await axios.post(`${url}/otp/receive`, { otp });
}

export async function saveServerUrl(url: string): Promise<void> {
  await EncryptedStorage.setItem('jarvis_url', url);
}
```

#### Task 9.3 — OTP Reader (Android)

```typescript
// phone/src/services/otpReader.ts
import { NativeModules, PermissionsAndroid } from 'react-native';
import { sendOTP } from './jarvisApi';

export async function setupOTPReader(): Promise<void> {
  // Request SMS permission on Android only
  if (Platform.OS !== 'android') {
    console.log('OTP reading not available on iOS');
    return;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    {
      title: 'JARVIS SMS Permission',
      message: 'JARVIS needs SMS access to handle payment OTPs automatically.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    }
  );

  if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;

  // Start listening using SmsRetriever API
  const SmsRetriever = NativeModules.RNSmsRetriever;
  SmsRetriever.startSmsRetriever((message: string) => {
    // Extract 6-digit OTP
    const match = message.match(/\b\d{6}\b/);
    if (match) {
      console.log('OTP intercepted, forwarding to JARVIS brain...');
      sendOTP(match[0]);
    }
  });
}
```

#### Task 9.4 — Chat Screen

```typescript
// phone/src/screens/HomeScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity,
         FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { sendMessage } from '../services/jarvisApi';

interface Message { id: string; role: 'user'|'jarvis'; text: string; }

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(input);
      const jarvisMsg: Message = { id: (Date.now()+1).toString(), role: 'jarvis', text: response };
      setMessages(prev => [...prev, jarvisMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(), role: 'jarvis',
        text: 'I appear to be offline, sir. Check your connection.'
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble,
            item.role === 'user' ? styles.userBubble : styles.jarvisBubble]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Speak to JARVIS..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={loading}>
          <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
```

#### Task 9.5 — Payment Confirmation Modal

```typescript
// phone/src/components/PaymentConfirm.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { confirmPayment } from '../services/jarvisApi';

interface Props {
  visible: boolean;
  payment: { amount: number; recipient: string; method: string; reason: string; };
  onDone: () => void;
}

export function PaymentConfirmModal({ visible, payment, onDone }: Props) {
  async function handle(approved: boolean) {
    await confirmPayment(approved);
    onDone();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>⚡ Payment Request</Text>
          <Text style={styles.amount}>₹{payment?.amount}</Text>
          <Text style={styles.detail}>To: {payment?.recipient}</Text>
          <Text style={styles.detail}>Via: {payment?.method?.toUpperCase()}</Text>
          <Text style={styles.reason}>{payment?.reason}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.approveBtn} onPress={() => handle(true)}>
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={() => handle(false)}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
```

### Expected Outcomes
- App connects to brain on local WiFi within 2 seconds
- App connects via Cloudflare tunnel when on mobile data
- Chat interface sends and receives messages
- OTP reader works on Android (tested with real SMS)
- Payment modal appears on payment request and forwards decision

### Success Criteria
```
✅ App loads → connects to brain → /health returns 200
✅ Send "Hello" → JARVIS responds within 3 seconds
✅ Trigger payment → confirmation modal appears on phone
✅ Approve on phone → brain receives confirmed=true
✅ Real SMS OTP arrives → OTP forwarded to brain automatically (Android)
✅ App works on mobile data (via Cloudflare tunnel URL)
```

---

## Phase 10 — Device Connectors

### Overview
JARVIS needs to be reachable from everywhere — Alexa, Bluetooth microphones, Telegram, and WhatsApp. This phase builds all incoming channel connectors that route input to the JARVIS brain.

### Objectives
- Deploy Alexa custom skill (AWS Lambda + Cloudflare tunnel)
- Build Bluetooth mic listener
- Build Telegram bot connector
- Build WhatsApp connector

### Key Tasks

#### Task 10.1 — Alexa Skill

```javascript
// connectors/alexa/skill/index.js
const Alexa  = require('ask-sdk-core');
const axios  = require('axios');
const JARVIS = process.env.CLOUDFLARE_TUNNEL_URL;

const JarvisIntentHandler = {
  canHandle(input) {
    return Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(input.requestEnvelope) === 'JarvisIntent';
  },
  async handle(input) {
    const query = Alexa.getSlotValue(input.requestEnvelope, 'query') || '';
    const userId = input.requestEnvelope.session.user.userId;

    try {
      const res = await axios.post(`${JARVIS}/think`, {
        input: query, source: 'alexa', userId
      }, { timeout: 8000 });

      return input.responseBuilder
        .speak(res.data.response)
        .reprompt("Is there anything else, sir?")
        .getResponse();
    } catch {
      return input.responseBuilder
        .speak("I'm having trouble reaching my cognitive systems, sir.")
        .getResponse();
    }
  }
};

const skillBuilder = Alexa.SkillBuilders.custom()
  .addRequestHandlers(JarvisIntentHandler)
  .create();

exports.handler = skillBuilder.getRequestHandler();
```

#### Task 10.2 — Telegram Connector

```javascript
// connectors/messaging/telegram.js
const { Telegraf } = require('telegraf');
const brain = require('../../brain/core/brain');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.on('text', async (ctx) => {
  const result = await brain.think({
    input:  ctx.message.text,
    source: 'telegram',
    userId: ctx.from.id.toString()
  });
  await ctx.reply(result.response);
});

bot.on('voice', async (ctx) => {
  await ctx.reply("I can hear you, sir, but voice messages require the desktop interface.");
});

bot.launch();
process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

#### Task 10.3 — WhatsApp Connector

```javascript
// connectors/messaging/whatsapp.js
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const brain = require('../../brain/core/brain');

async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./connectors/messaging/wa_auth');
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg  = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text;
    if (!text) return;

    const result = await brain.think({
      input:  text,
      source: 'whatsapp',
      userId: msg.key.remoteJid
    });

    await sock.sendMessage(msg.key.remoteJid, { text: result.response });
  });
}

startWhatsApp();
```

### Expected Outcomes
- Alexa skill deployed to AWS Lambda and connected via Cloudflare tunnel
- Telegram bot responds to messages within 3 seconds
- WhatsApp QR code scanned → bot responds to messages
- All inputs route to the same brain → consistent JARVIS personality across channels

### Success Criteria
```
✅ "Alexa, ask JARVIS to tell me the time"
   → JARVIS brain responds → Alexa speaks the answer

✅ Send message to Telegram bot → JARVIS responds in character

✅ Send WhatsApp message → JARVIS responds from same number

✅ Same userId → same memory → consistent context across channels
```

---

## Phase 11 — Laptop Control Agent

### Overview
JARVIS can control the user's laptop remotely — opening apps, executing shell commands, capturing screenshots, and simulating keyboard/mouse input. A lightweight Python agent runs on the laptop and exposes an HTTP API.

### Key Tasks

#### Task 11.1 — Laptop Control Server

```python
# connectors/laptop/server.py
from flask import Flask, request, jsonify
import subprocess, pyautogui, psutil, os

app = Flask(__name__)

@app.route('/action', methods=['POST'])
def handle_action():
    data   = request.json
    action = data.get('action')
    params = data.get('params', {})

    handlers = {
        'open_app':      lambda: subprocess.Popen([params['app']]),
        'open_url':      lambda: subprocess.Popen(['xdg-open', params['url']]),
        'type_text':     lambda: pyautogui.write(params['text'], interval=0.05),
        'press_key':     lambda: pyautogui.press(params['key']),
        'screenshot':    lambda: take_screenshot(),
        'run_command':   lambda: run_command(params['cmd']),
        'set_dnd':       lambda: set_dnd(params['value']),
        'set_volume':    lambda: set_volume(params['level']),
        'list_processes':lambda: get_processes(),
    }

    handler = handlers.get(action)
    if not handler:
        return jsonify({'error': f'Unknown action: {action}'}), 400

    result = handler()
    return jsonify({ 'status': 'done', 'result': result or '' })

def take_screenshot():
    img = pyautogui.screenshot()
    path = '/tmp/jarvis_screenshot.png'
    img.save(path)
    return path

def run_command(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, timeout=30)
    return result.stdout.decode() + result.stderr.decode()

def set_dnd(enable):
    # Platform-specific DND implementation
    if os.name == 'nt':  # Windows
        pass  # Windows Focus Assist via registry
    else:  # Linux
        subprocess.run(['notify-send', '--app-name=JARVIS',
                        'Do Not Disturb ' + ('ON' if enable else 'OFF')])

def set_volume(level):
    if os.name == 'nt':
        pass  # Windows audio via pycaw
    else:
        subprocess.run(['amixer', 'sset', 'Master', f'{level}%'])

def get_processes():
    return [p.name() for p in psutil.process_iter(['name'])][:20]

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
    print("Laptop control agent running on port 8080")
```

#### Task 11.2 — Laptop Tool (Node.js side)

```javascript
// brain/tools/laptop.js
const axios = require('axios');
const LAPTOP = process.env.LAPTOP_AGENT_URL || 'http://localhost:8080';

async function action(params) {
  const res = await axios.post(`${LAPTOP}/action`, params, { timeout: 15000 });
  return res.data.result || 'Action completed.';
}

module.exports = { action };
```

### Expected Outcomes
- Laptop agent starts on boot and stays running
- Brain can open apps, type text, run shell commands
- Screenshot captured and returned as file path
- DND and volume control work on target platform

---

## Phase 12 — Security Hardening

### Overview
JARVIS has access to payments, SMS, laptop control, and personal memory. Security is not optional. This phase audits and hardens every surface.

### Security Checklist

#### Authentication
```
✅ Brain API protected by API key header (X-JARVIS-KEY)
✅ Phone app stores server URL in EncryptedStorage (not AsyncStorage)
✅ Razorpay keys never logged or exposed in responses
✅ OTPs deleted from memory immediately after use (< 60 seconds)
✅ Payment ENABLED flag defaults to false
```

#### Data Protection
```
✅ SQLite database file encrypted at rest (SQLCipher)
✅ Redis protected by password (requirepass in redis.conf)
✅ ChromaDB not exposed on public network
✅ .env never committed to git (.gitignore enforced)
✅ All API keys rotatable without restarting JARVIS
```

#### Network Security
```
✅ Cloudflare tunnel enforces HTTPS — no plain HTTP externally
✅ Express helmet() middleware enabled (XSS, CSRF, etc.)
✅ CORS configured to allow only known origins
✅ Rate limiting on /think endpoint (max 30 req/min per IP)
✅ Laptop agent only accepts connections from localhost by default
```

#### Payment Security
```
✅ Daily payment limit enforced at code level
✅ Every payment requires phone confirmation
✅ Payment audit log append-only (no UPDATE/DELETE on audit table)
✅ Razorpay webhook signature verification enabled
✅ Test mode (rzp_test_) vs production (rzp_live_) enforced by env
```

---

## Phase 13 — Testing & Benchmarking

### Test Suite Structure

```
tests/
├── unit/
│   ├── brain.test.js          ← Brain reasoning tests
│   ├── memory.test.js         ← All 3 memory layers
│   ├── grounder.test.js       ← Hallucination detection
│   ├── payments.test.js       ← Payment flow (mock Razorpay)
│   └── skills.test.js         ← Skill invocation
│
├── integration/
│   ├── voice-pipeline.test.py ← Full STT → brain → TTS
│   ├── agent-pipeline.test.js ← Planner → Executor → Reflector
│   └── connectors.test.js     ← Telegram, WhatsApp, Alexa
│
└── stress/
    ├── concurrent.test.js     ← 50 simultaneous requests
    ├── memory-scale.test.js   ← 10,000 memory entries
    └── payment-load.test.js   ← Payment rate limiting
```

### Benchmarks to Hit Before Launch

| Metric | Target | Measured |
|---|---|---|
| Brain response time (simple) | < 2 seconds | — |
| Brain response time (complex) | < 8 seconds | — |
| Voice loop latency (wake → response) | < 4 seconds | — |
| Hallucination rate | < 1% | — |
| Memory recall accuracy | > 95% | — |
| Payment flow completion | > 99% | — |
| Uptime (24h continuous) | > 99.9% | — |
| Context window (exchanges before compression) | 20 | — |

---

## Phase 14 — Deployment & Distribution

### Overview
JARVIS runs on your local machine permanently. This phase sets up production-grade process management, public access via Cloudflare, and the phone app distribution.

### Key Tasks

#### Task 14.1 — PM2 Production Setup

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name:         'jarvis-brain',
      script:       './brain/index.js',
      instances:    1,
      autorestart:  true,
      watch:        false,
      max_memory_restart: '1G',
      env: { NODE_ENV: 'production' }
    },
    {
      name:         'jarvis-voice',
      script:       './voice/interceptor.py',
      interpreter:  'python',
      autorestart:  true,
    },
    {
      name:         'jarvis-laptop',
      script:       './connectors/laptop/server.py',
      interpreter:  'python',
      autorestart:  true,
    },
    {
      name:         'jarvis-telegram',
      script:       './connectors/messaging/telegram.js',
      autorestart:  true,
    }
  ]
};
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # Generates command to auto-start on system boot
```

#### Task 14.2 — Cloudflare Tunnel (Free Public HTTPS)

```bash
# Install cloudflared
npm install -g cloudflared

# Start persistent tunnel
cloudflared tunnel --url http://localhost:3000

# For permanent setup (survives reboots):
cloudflared service install
# Add tunnel token to service config

# Result: https://random-words.trycloudflare.com
# Use this URL in:
# - Alexa skill configuration
# - Phone app settings
# - Telegram webhook (if using webhooks)
```

#### Task 14.3 — Phone App Distribution

```bash
# Development testing (Expo Go app on your phone)
cd phone
npx expo start
# Scan QR code with Expo Go app

# Production build for sideloading (Android APK)
npx expo build:android --type apk

# Or use EAS Build (Expo's build service)
npx expo install expo-dev-client
eas build --platform android --profile preview
```

#### Task 14.4 — startup.sh (One-Command Launch)

```bash
#!/bin/bash
# startup.sh — Start all JARVIS processes

echo "╔══════════════════════════════════════╗"
echo "║     Starting J.A.R.V.I.S.           ║"
echo "╚══════════════════════════════════════╝"

# Start services
redis-server --daemonize yes
chroma run --path ./memory/vector/chroma_store &

# Start brain via PM2
pm2 start ecosystem.config.js

# Start Cloudflare tunnel
cloudflared tunnel --url http://localhost:3000 &

# Wait and verify
sleep 5
HEALTH=$(curl -s http://localhost:3000/health | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])" 2>/dev/null)

if [ "$HEALTH" = "online" ]; then
  echo "✅ JARVIS is online."
else
  echo "❌ Brain health check failed. Check logs: pm2 logs jarvis-brain"
fi
```

### Distribution Checklist

```
Local Machine:
  ✅ PM2 configured and auto-starts on boot
  ✅ Redis auto-starts as system service
  ✅ ChromaDB auto-starts
  ✅ Cloudflare tunnel active with public URL
  ✅ All services monitored: pm2 status

Phone App:
  ✅ APK built and installed on Android
  ✅ Server URL configured (tunnel URL saved)
  ✅ Push notifications working
  ✅ OTP reader permissions granted
  ✅ Payment confirmation tested

External Access:
  ✅ Alexa skill deployed to AWS Lambda
  ✅ Telegram bot active and responding
  ✅ Cloudflare URL in all external service configs
```

---

## 20. Master Skill Registry

Complete list of all installed skills from skills.sh:

| # | Skill Name | Source | Installs | Tier | Purpose |
|---|---|---|---|---|---|
| 1 | proactive-agent | halthelobster | 11.6K | 1 | Transforms JARVIS from reactive to proactive |
| 2 | self-improving-agent | charon-fan | 19.8K | 1 | Learns and improves from every interaction |
| 3 | brainstorming | obra/superpowers | 79.9K | 1 | Thinks through complex tasks before acting |
| 4 | using-superpowers | obra/superpowers | 41.2K | 1 | Ensures all skills are invoked correctly |
| 5 | systematic-debugging | obra/superpowers | 44.2K | 1 | Methodical problem diagnosis |
| 6 | verification-before-completion | obra/superpowers | 28.7K | 1 | Checks all work before declaring done |
| 7 | writing-plans | obra/superpowers | 43.1K | 2 | Breaks goals into concrete sub-tasks |
| 8 | executing-plans | obra/superpowers | 35.1K | 2 | Follows plans through to completion |
| 9 | dispatching-parallel-agents | obra/superpowers | 26.6K | 2 | Concurrent sub-task execution |
| 10 | subagent-driven-development | obra/superpowers | 30.6K | 2 | Delegates to specialised agents |
| 11 | planning-with-files | othmanadi | 11.7K | 2 | Persistent cross-session plans |
| 12 | skill-vetter | useai-pro | 12.4K | 2 | Validates new skills before loading |
| 13 | agent-browser | vercel-labs | 140.4K | 3 | Full browser automation |
| 14 | browser-use | browser-use | 58.4K | 3 | Autonomous browser driving |
| 15 | web-search | inferen-sh | 16.7K | 3 | Real-time web search |
| 16 | firecrawl | firecrawl | 21.0K | 3 | Full-site scraping |
| 17 | search | tavily-ai | 11.9K | 3 | AI-optimised search |
| 18 | elevenlabs-tts | inferen-sh | 52.0K | 4 | Premium JARVIS voice |
| 19 | chat-ui | inferen-sh | 14.0K | 5 | Chat interface components |
| 20 | agent-ui | inferen-sh | 13.9K | 5 | Agent UI patterns |
| 21 | frontend-design | anthropics | 218.5K | 5 | Production interface design |
| 22 | python-executor | inferen-sh | 14.5K | 6 | Runtime Python execution |
| 23 | workflow-automation | supercent-io | 12.6K | 6 | Automated task chains |
| 24 | data-analysis | supercent-io | 13.8K | 6 | Data analysis capability |
| 25 | database-schema-design | supercent-io | 12.1K | 6 | Memory schema design |
| 26 | nodejs-backend-patterns | wshobson | 13.1K | 6 | Backend architecture |
| 27 | security-best-practices | supercent-io | 14.1K | 7 | Security enforcement |
| 28 | test-driven-development | obra/superpowers | 37.1K | 7 | TDD methodology |
| 29 | code-review | supercent-io | 12.5K | 7 | Self-review before deploy |
| 30 | find-skills | vercel-labs | 774.9K | Meta | Discovers new relevant skills |

> **ClawhHub note:** Marketplace is empty as of April 2026. Scraper is built and will auto-detect skills when published.

---

## 21. Glossary

| Term | Definition |
|---|---|
| BYOAK | Bring Your Own API Key — the pattern where users supply their own LLM provider credentials |
| CoT | Chain-of-Thought — prompting technique that forces step-by-step reasoning before answering |
| Grounding | The process of verifying factual claims against real sources before stating them |
| AGENTS.md | Configuration file that tells JARVIS which skills to load and when |
| IPC | Inter-Process Communication — how Node.js and Python processes talk to each other |
| Paise | Indian currency subunit (100 paise = ₹1). Razorpay uses paise for amounts |
| Vector Memory | Memory stored as mathematical embeddings, enabling semantic search |
| Anticipator | The component that predicts what the user will need next and acts proactively |
| Reflector | The component that reviews JARVIS's own output and flags quality issues |
| PM2 | Process Manager 2 — production process manager for Node.js |
| Cloudflare Tunnel | A free service that gives your local machine a permanent public HTTPS URL |
| Porcupine | Wake word detection library by Picovoice — used to detect "Hey JARVIS" |
| Whisper | OpenAI's open-source speech-to-text model, runs fully locally |
| Piper | Offline text-to-speech library with high-quality British male voice |
| SmsRetriever | Android API that reads SMS without requiring READ_SMS permission |

---

*Last updated: April 2026*
*Document version: 1.0*
*Author: JARVIS Development Team*

> *"Just A Rather Very Intelligent System"*
