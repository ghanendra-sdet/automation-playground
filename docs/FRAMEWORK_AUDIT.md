# Framework Audit — automation-playground

**Date:** 2026-10-12
**Scope:** Full repository inspection, baseline measurement, and evidence-based optimization.

## 0. Scope correction — read this first

The audit brief this document responds to assumes the framework already covers business
modules: **Login/Auth, Dashboard, Merchants, Payout, Connected Banking, Collection, Logs,
Reports, Team Management, Support, Settings, Logout.**

None of those exist in this repository. Verified directly (not assumed):

- `README.md` describes this repo as "a free, open-source sandbox for practicing UI test
  automation" — 52 self-contained challenge sections (forms, tables, modals, iframes, shadow
  DOM, drag & drop, flaky elements, etc.), built to be pointed at with Playwright, Selenium,
  Cypress, or Robot Framework.
- There is no backend, no database, no real authentication, and (confirmed via
  `grep -n "fetch(\|XMLHttpRequest" src/main.ts`, zero matches) no real network/API calls
  anywhere in the application.
- `package.json`'s `name` is `automation-practice`; the only test file is
  `tests/practice.spec.ts`, 107 lines, 6 tests before this audit.

The specific product names in the brief's module list — `payout`, `connectedBanking`,
`collection`, `bbps`, `reseller`, `yobo` — don't appear anywhere in this repo, but they exactly
match *other* repositories in this account: `fintech-payout-engine`,
`fintech-connected-banking-platform`, `bbps-bill-payment-platform`,
`reseller-management-platform`, `yobo`, and `ai-dispute-resolution-engine`. If the business-module
coverage audit was intended for one of those, say which one and it can be run there.

Everything below audits **what this repository actually is**: a single-page Vite + TypeScript
UI practice sandbox with a Playwright suite. Phases of the brief that assume a business
application (4: auth/session architecture beyond a toy login widget, 5: API testing/mocking,
6: environment/secrets management, large parts of 9: module coverage) are marked **Not
Applicable** below with the evidence, rather than inventing findings to fill them.

## 1. Architecture and dependency overview

| Aspect | Actual value | Evidence |
|---|---|---|
| Module system | ESM (`"type": "module"`) | `package.json:5` |
| Language | TypeScript, `target: es2023` | `tsconfig.json` |
| Build tool | Vite 8.1.5 (installed; `^8.1.1` pinned) | `npm ls`, `package.json:17` |
| Test runner | `@playwright/test` 1.62.0 (installed; `^1.50.1` pinned) | `npm ls`, `package.json:15` |
| Node.js | v24.8.0 present locally; CI pins Node 20 | `.github/workflows/tests.yml:16` |
| App structure | Single page (`index.html`, 1,734 lines) + two popup pages (`iframe-content.html`, `new-window.html`); all logic in `src/main.ts` (3,127 lines) as sequential `// Challenge NN:` blocks; all styles in `src/style.css` (2,356 lines) | `.claude/STATE.md`, confirmed by direct read |
| Deploy target | GitHub Pages, base path `/automation-playground/` | `vite.config.js:5` |
| Dev server | Pinned to port 5180 (not Vite's default 5173) to avoid colliding with an unrelated project's dev server on this machine | `vite.config.js:6-12`, `.claude/STATE.md` |
| Test projects | chromium, firefox, webkit | `playwright.config.ts:18-30` |
| CI | GitHub Actions: `tests.yml` (run on push/PR to `main`), `deploy-pages.yml` (deploy on push to `main`) | `.github/workflows/` |

The single-file-per-concern architecture (one `main.ts`, one `index.html`, one `style.css`) is a
**previously made, explicitly documented decision** (`.claude/STATE.md`), appropriate for a
single-page, 52-section teaching sandbox with no multi-page navigation. It is not treated as a
defect in this audit, and no page-object-model layer is introduced over it (see §4).

## 2. Existing strengths worth preserving

- **Zero fixed sleeps.** `grep -n "waitForTimeout" src/main.ts tests/*.spec.ts` returns nothing.
  All synchronization in the existing test suite relies on Playwright's auto-waiting and locator
  assertions — exactly the pattern the brief asks for, already in place.
- **Stable selectors.** Every interactive element audited carries a `data-testid` (plus `id` and
  `aria-label`), and the existing tests consistently use `getByTestId(...)` rather than brittle
  CSS/XPath. No selector changes were needed or made.
- **No secrets anywhere.** Grepped for API keys, tokens, passwords, `Bearer` headers — the only
  matches are dummy practice strings (`SECRET_SHADOW_KEY` as sample input text for the Shadow DOM
  challenge, `admin`/`admin123` as documented demo credentials for the Authentication Simulation
  widget). Nothing sensitive is or was ever at risk of being committed.
- **Intentional, documented flakiness.** Section 25 ("Random Fail (Flaky) Elements") fails ~50% of
  the time by design, to give learners a real target for retry/resilience testing. The test suite
  and `playwright.config.ts`'s `retries` setting correctly treat this as the point of the
  exercise, not a bug to eliminate.
- **Clean build.** `npm run build` (tsc + vite build) is warning-free.

## 3. Findings

No **Critical** findings — there is no security vulnerability, data-loss risk, or broken core
functionality in this repository.

### High priority

**H1 — `workers: 1` silently defeated `fullyParallel: true`, 3.7x slower than necessary for no
evidenced reason.**
`playwright.config.ts` (before) set `workers: 1` with no comment explaining why, while also
setting `fullyParallel: true` one line above — the two settings contradicted each other, since a
single worker has nothing to parallelize across. Measured directly:
- `workers: 1` (original): **66 seconds**, 18 tests (6 × 3 browsers).
- `workers: 4`: **18 seconds**, identical pass/fail/flaky results.

Nothing in the app shares server-side mutable state (confirmed: no backend, no API calls), and
every test gets its own isolated browser context, so there is no evidenced cross-test contention
to guard against. **Fixed** — see §5.

**H2 — Unconditional verbose logging buried real signal in noise on every test, pass or fail.**
`tests/practice.spec.ts`'s `beforeEach` (before) attached `page.on('console', ...)`,
`page.on('request', ...)`, and `page.on('response', ...)` listeners that printed *every* browser
console message and *every* network request/response to stdout, for every one of the 18 (now 24)
test runs — including passing ones. This is exactly the "debug statements and abandoned code"
pattern Phase 10 asks to find, and it directly worked against Phase 8's goal of being able to find
"failure reason and useful assertion context" — the actually-useful `pageerror` (uncaught
exception) signal was drowned in hundreds of lines of Vite HMR chatter and font-loading requests
per test. **Fixed** — see §5.

**H3 — Zero test coverage for the one feature that models session/auth state.**
Section 21 ("Authentication Simulation", `src/main.ts:1320-1368`, markup at `index.html:747-782`)
implements a complete login → session → logout flow: hardcoded demo credentials
(`admin`/`admin123`), a mock token persisted to `localStorage` under `mock-auth-token`, a
protected dashboard view, and a logout that clears it. None of this had test coverage — the
existing suite only covered Challenges 01, 02, 07, 11, 12, and 25. This is the single most
natural place in the entire app for the positive/negative-auth-test pattern the brief's Phase 4
and Phase 9 ask for, and it was untested. **Fixed** — see §5.

### Medium priority

**M1 — No machine-readable test output for CI.**
`playwright.config.ts` (before) configured only `reporter: 'html'`. The GitHub Actions workflow
uploaded the HTML report as a build artifact (useful for a human to download and open), but
nothing in JUnit/XML or JSON form that a CI dashboard, PR annotation bot, or test-trend tool could
parse. **Fixed** — see §5.

**M2 — CI downloaded and installed Playwright's three browser engines from scratch on every run.**
`.github/workflows/tests.yml` (before) ran `npx playwright install --with-deps` unconditionally on
every push/PR with no caching, which is a real, recurring CI time cost. **Fixed** — see §5.

### Low priority

**L1 — No lint/format tooling.** `main.ts` is a hand-maintained 3,127-line file; ESLint would catch
unused locals/dead code mechanically (TypeScript's own `noUnusedLocals`/`noUnusedParameters` in
`tsconfig.json:18-19` already catch some of this at build time). **Recommended, not implemented**
— per the brief's own Phase 10 instruction to add tooling "only when their benefit justifies the
dependency and configuration overhead," and because adding a new devDependency is a call worth
leaving to you rather than making unilaterally.

**L2 — No smoke/sanity/regression tagging.** With 8 tests (after this audit) covering 7 of 52
sections, introducing a formal tag/category system now would be classification overhead with
nothing yet to classify. **Recommended, deferred** — revisit once coverage grows past roughly
15-20 tests.

**L3 — Single-file architecture.** Noted in §1 for completeness; **not a defect**. It's a prior,
documented, intentional decision appropriate to this app's shape, and splitting it into
modules/page-objects now would add indirection without reducing any actual duplication.

## 4. Why Phases 2 (Page Object Model), 4, 5, and 6 are mostly Not Applicable

- **Page Object Model (Phase 2):** this is one page with 52 self-contained sections, not a
  multi-page app with navigable routes. The existing tests already use the brief's own
  recommended pattern directly — stable `data-testid` locators, no page-method indirection needed
  because there's no multi-step navigation to encapsulate. Introducing a POM layer for 8 tests
  against one page would be the premature abstraction the brief itself warns against ("avoid
  bloated base classes," "avoid exposing every internal locator when a meaningful page method is
  sufficient" — there already isn't one to expose). The one helper class the suite does have
  (none, currently) isn't missing anything a POM would add at this scale.
- **Authentication and session optimization (Phase 4):** Section 21 is a self-contained client-side
  toy — hardcoded credentials, a static mock token, no server, no expiry, no roles. Storage-state
  reuse, session-expiration testing, and role isolation are all real concerns for an app with a
  real backend session; they don't apply to a stateless demo widget. The two tests added (§5)
  cover exactly what *is* real here: positive login, negative login, and logout.
- **API testing and mocking (Phase 5):** confirmed via `grep -n "fetch(\|XMLHttpRequest" src/main.ts`
  — zero matches. "Character API Call Simulation" (Section 42, `src/main.ts:2150-2180`) renders a
  fake `GET /api/search?q=... (Status: 200 OK)` log line directly into the DOM on every keystroke;
  it is not a real or mockable network call. There is no API layer anywhere in this application.
- **Test data and environment management (Phase 6):** no environment variables are consumed by the
  app or the pre-existing tests, and there are no secrets to protect (§2). The one new flag
  introduced by this audit (`DEBUG_NETWORK`, §5) is documented inline and in
  `docs/FRAMEWORK_GUIDE.md` rather than needing a `.env.example` scaffold for a single boolean.

## 5. What was implemented (see `docs/OPTIMIZATION_CHANGELOG.md` for full detail)

1. Removed the `workers: 1` cap (H1).
2. Gated verbose console/network logging behind `DEBUG_NETWORK=1`; kept `pageerror` unconditional (H2).
3. Added two new tests covering Section 21's login/session/logout and invalid-credentials paths (H3).
4. Added a JUnit reporter alongside the existing HTML reporter (M1).
5. Added Playwright browser caching to the CI workflow (M2).

## 6. Baseline test results

| | Before | After |
|---|---|---|
| Total tests | 18 (6 × 3 browsers) | 24 (8 × 3 browsers) |
| Passed (clean) | 16 | 23 |
| Flaky (failed then passed on retry) | 2 — always Section 25, by design | 1 — always Section 25, by design |
| Failed | 0 | 0 |
| Skipped | 0 | 0 |
| Workers | 1 (hardcoded) | auto (CPU-scaled) |
| Wall-clock time | **66s** | **19-25s** (varies slightly run to run with Section 25's RNG and retry count) |
| Build (`tsc` + `vite build`) | clean, ~180ms | clean, ~110ms |
| JUnit output | none | `test-results/junit.xml`, verified non-empty, `failures="0"` |

Commands run and their actual results are in `docs/OPTIMIZATION_CHANGELOG.md`.

## 7. Phased implementation plan

- **Phase 1 (this document):** done.
- **Phase 2 (architecture):** no POM introduced — not justified at this scale (§4). No unnecessary
  rewrite performed.
- **Phase 3 (reliability/flakiness):** audited — zero fixed sleeps found; Section 25's flakiness
  confirmed intentional and left as-is; logging noise (H2) was the only real reliability-adjacent
  defect (it affected diagnosability, not pass/fail correctness) and is fixed.
- **Phase 4 (auth):** Not Applicable beyond the two tests added (§4, §5).
- **Phase 5 (API):** Not Applicable — no API layer exists (§4).
- **Phase 6 (test data/env):** Not Applicable — nothing to centralize (§4).
- **Phase 7 (performance):** workers cap removed and measured (H1); browser selection via
  `--project=chromium|firefox|webkit` already works and is now documented in the guide.
- **Phase 8 (reporting):** JUnit added (M1); noise reduced (H2); HTML report and trace-on-retry
  preserved as-is.
- **Phase 9 (organization/coverage):** business-module list is Not Applicable (§0); real missing
  coverage (Section 21) added (H3); formal tagging deferred as premature (L2).
- **Phase 10 (code quality/security):** no hardcoded secrets, no insecure TLS settings, no disabled
  lint/assertion/security checks found or introduced. Lint tooling recommended, not added (L1).
- **Phase 11 (documentation):** `docs/FRAMEWORK_GUIDE.md` added (no prior equivalent existed).
- **Phase 12/13:** see `docs/OPTIMIZATION_CHANGELOG.md` and the final report delivered in-conversation.
