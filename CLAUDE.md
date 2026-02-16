# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Telegram bot that integrates with the Claude API. Early-stage — scaffolding only. The bot polls Telegram for updates and will forward messages to Claude for response generation.

## Tech Stack

- **Runtime:** Node.js with ES modules (`"type": "module"` — use `import`/`export`, not `require`)
- **HTTP client:** axios
- **Environment:** dotenv (`.env` at project root)
- **Dev server:** nodemon

## Commands

```bash
# Run the bot
node app.js

# Run with auto-restart on file changes
npx nodemon app.js
```

No build step. No linter. No test framework configured yet.

## Architecture

- `app.js` — Entry point (currently empty). Will wire up polling loop and message handling.
- `src/tg-api.js` — Telegram Bot API helpers. Uses axios for HTTP requests. Implements token rotation across multiple bot tokens (reads `TOKEN_ARRAY` from env) to handle 429 rate limits.

## Environment Variables

Defined in `.env` (gitignored). Key variables:
- `TOKEN_ARRAY` — Telegram bot tokens (used for rate-limit rotation)
- Claude API credentials will be needed as the integration is built out

## Conventions

- ES module syntax throughout (`import`/`export`)
- Async/await for all async operations
- Source modules live in `src/`
