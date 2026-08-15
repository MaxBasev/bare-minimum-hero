# CLAUDE.md

Guidance for Claude Code (and any other AI agent) working in this repository. Written so that if the local checkout is deleted and restored from GitHub, an agent can get fully oriented from this file alone.

## Project overview

**Bare Minimum Hero** is a Manifest V3 Chrome extension (no build step, no bundler, no package.json). It's a small, ironic self-validation tool: once a day the user clicks a button confirming they did "the bare minimum," and the extension responds with a randomly picked sarcastic/wholesome quote, tracks a points counter and a daily streak, occasionally grants a "mystery bonus," and lets the user export the result as a shareable PNG image.

There is no backend. Everything is client-side, persisted via `chrome.storage.local`.

## Architecture

- **`manifest.json`** — MV3 manifest. Popup action, background service worker, permissions: `storage`, `alarms`, `notifications`.
- **`popup.html`** + **`popup.js`** — the extension's UI and all interaction logic (~970 lines): renders the daily question, handles the main/emergency buttons, streak display, mystery bonuses, language switcher, and shareable-image generation. This is the largest and most central file.
- **`background.js`** — MV3 service worker. Sets up two `chrome.alarms`: a daily reminder notification (7:00 PM local) if the user hasn't clicked yet, and a midnight streak-check that marks the streak broken if a day was missed. No persistent state of its own beyond `chrome.storage.local`.
- **`style.css`** — all styling for the popup (single stylesheet, no CSS framework).
- **Content/data modules** (plain ES modules imported by `popup.js`), each holding EN + RU text arrays:
  - `quotes.js` — core daily validation quotes.
  - `tips.js` — "barely useful tips."
  - `streak-quotes.js` — streak-milestone messages/achievements (3, 7, 14, 30, 69 days) and streak-recovery messages.
  - `emergency-quotes.js` — longer "emergency validation" texts + achievement titles for the emergency button.
  - `mystery-bonus.js` — random cosmetic bonus rewards.
  - `translations.js` — UI string translations (EN/RU) plus date-formatting helpers (`formatDate`, `formatNextAvailableDate`).
- **`html2canvas.min.js`** — vendored third-party library used to render the popup's "shareable moment" section into a downloadable PNG. Do not hand-edit; replace wholesale if it needs updating.
- **`images/`** — extension icons (16/32/48/64/128) and promo/logo assets.
- **`GEMINI.md`** — local-only instruction file for the Gemini CLI tool; it is git-ignored (see `.gitignore`) and intentionally not tracked. Its coding-style rules (English-only code comments, minimal comments, modern JS, no emoji in README, senior-level code quality) are good defaults to also follow here, but the "always answer in Russian" instruction in it is Gemini-specific chat behavior, not a repo-wide rule.

## Data model (`chrome.storage.local`)

Keys used across `popup.js` / `background.js` (non-exhaustive, check `popup.js` for the authoritative list): `lastClickDate`, `heroPoints`, `lastQuote`, `lastEmergencyDate`, `lastTipIndex`, `currentStreak`, `streakBroken`, `userLanguage`. Dates are stored as local `YYYY-MM-DD` strings via the `getLocalDateString()` helper (duplicated in both `popup.js` and `background.js` — keep both in sync if the logic changes).

## Internationalization

The extension supports English and Russian. Every content module exports a `russian*`-prefixed sibling array/object alongside the English default, and `translations.js` holds the UI chrome strings. When adding new user-facing text, add both the EN and RU variants and wire the RU one into the matching `russian*` export.

## Conventions

- No build tooling — files are loaded directly as ES modules / classic scripts per `manifest.json` and `popup.html`. Don't introduce a bundler without discussing it first.
- Keep code comments minimal and in English, even though UI copy ships in English and Russian.
- Prefer modern, idiomatic JS (ES modules, async/await, destructuring) — this codebase already does.
- No emoji in `README.md`.
- Load-unpacked workflow for manual testing: `chrome://extensions` → enable Developer mode → "Load unpacked" → select the repo root.

## Worklog (required)

At the end of every working session, add an entry to `WORKLOG.md` (newest entries on top; format described in that file's header): what was done, which files/areas were touched, what decisions were made and why, and what's left for next time. Be specific — not "made some fixes," but exactly what changed. Call out releases/version bumps explicitly. Do this without being reminded — it's a standing rule, not a one-off request.
