# automation-playground — Resume State

**Last updated:** 2026-09-09 (Claude) — Full audit + enhancement pass complete, verified, uncommitted.

## What this repo is
Single-page Vite + TypeScript UI automation practice playground (no framework). All markup lives
in `index.html`; all JS logic in `src/main.ts` as sequential `// Challenge NN:` blocks; all styles
in `src/style.css` as `/* Section NN: Name */` blocks. GitHub Pages deploy, base path
`/automation-playground/`. Dev server pinned to **port 5180** (not Vite's default 5173 — that port
is frequently squatted by an unrelated project's dev server on this machine; see "Known gotcha"
below).

## Current state (uncommitted, awaiting user review — do not push without explicit "push" instruction)
Went from 41→**52 sections**. Full audit done first (per user's explicit "don't code yet" request),
plan confirmed, then implemented:
- **10 new sections (43-52):** Tabs, Accordion, Toggle/Switch, Toast Notifications, Dependent
  Dropdowns, OTP Input, Rich Text Editor, Tree View, Responsive Nav practice widget, Popover.
- **4 deepened, not duplicated:** Section 1 (Basic Form — inline validation, password strength
  meter, confirm-password, readonly/disabled/conditional fields, submit loading state), Section 8
  (Table — bulk select w/ indeterminate, inline cell edit, numbered pagination, skeleton-loading
  reload), Section 10 (Modals — added a real confirm/cancel destructive-action dialog + Escape-key
  support), Section 28 (Date Picker — disabled past/>60-day dates, added a time input).
- Every new/enhanced section wired into the site's existing `challengeSteps` checklist-injection
  system and `resetSection()` per-card reset system — both are site-wide conventions, not something
  I invented.
- README updated (badge count, section table, enhancement note).

**Explicitly not added** (considered, judged low incremental value given how much already existed):
carousel, star rating, file-manager UI, dedicated error pages (404/403/500), sticky-UI as its own
section, nested hover-submenu.

## Verification done
- `npm run build` (tsc + vite build): clean.
- Custom 44-assertion Playwright functional pass across all new/enhanced sections: 44/44 (2 initial
  "failures" were test-script math errors on my part, not app bugs — see chat transcript).
- Pre-existing `tests/practice.spec.ts` suite (3 browsers): 17/18 passed after two fixes (see
  below); the 1 remaining failure is Section 25's intentional 50/50 flaky test on webkit — expected,
  documented behavior, not a regression.

## Known gotcha — port 5173 squatting (fixed here, worth knowing elsewhere)
An unrelated project's Vite dev server (`.../Minimal API Test/fetchly`, `--port 5173 --strictPort`)
kept claiming port 5173 during this session, and `reuseExistingServer: true` silently made
Playwright test the *wrong app* (zero relation to automation-playground) rather than erroring —
this exact same failure mode is independently documented in `api-lab/plan.md` too, so it's a
recurring environmental issue on this machine, not a one-off. Fixed **for this repo** by pinning
`vite.config.js`'s `server.port` to `5180` (`strictPort: true`) and updating
`playwright.config.ts`'s `baseURL`/`webServer.url` to match — this repo can no longer collide with
that stray server regardless of what else is running.

## Regression fixes made to the pre-existing test suite
The original `tests/practice.spec.ts` broke against the enhanced Section 1 form for two real
reasons, both fixed:
1. Phone pattern was initially too strict (`^[0-9]{10}$`) — rejected the test's own
   `+1234567890` input. Loosened to `^\+?[0-9]{10,15}$` (also just more realistic).
2. The test never filled the new required "Confirm Password" field. Updated the test to fill it.

## Next steps if resuming
- Nothing is committed or pushed — user explicitly said they'll push manually.
- If asked to continue enhancing: the "not added" list above is the natural backlog.
- If the port-5173 conflict resurfaces in *other* repos being tested locally, the fix pattern here
  (pin a dedicated port in both vite config and playwright config) is the one to reach for.
