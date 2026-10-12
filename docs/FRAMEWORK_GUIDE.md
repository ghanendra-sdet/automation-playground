# Framework Guide — automation-playground

Practical setup, usage, and extension guide for this repo's Playwright test suite. For the audit
findings behind these decisions, see `docs/FRAMEWORK_AUDIT.md` and
`docs/OPTIMIZATION_CHANGELOG.md`.

## What this is

A single-page Vite + TypeScript app (`index.html`) with 52 self-contained "challenge" sections
for practicing UI test automation, plus a Playwright suite (`tests/practice.spec.ts`) that
exercises a subset of them as worked examples. There is no backend and no real API — every
challenge is client-side DOM state.

## Folder structure

| Path | Responsibility |
|---|---|
| `index.html` | All markup, as one `<section id="section-NN">` block per challenge |
| `src/main.ts` | All interactive logic, as sequential `// Challenge NN: <name>` blocks |
| `src/style.css` | All styling, as `/* Section NN: Name */` blocks |
| `src/counter.ts` | Vite template leftover (the default counter demo), unrelated to the challenges |
| `iframe-content.html`, `new-window.html` | Standalone pages used by the iFrame and Multiple Windows challenges |
| `tests/practice.spec.ts` | Playwright suite — covers a subset of sections, not all 52 |
| `playwright.config.ts` | Test runner config (browsers, reporters, retries, webServer) |
| `vite.config.js` | Dev server (port 5180) and build config |
| `docs/` | This guide, the audit, and the optimization changelog |

Every interactive element carries a stable `id`, `data-testid`, and `aria-label` — locate
elements by `data-testid` in new tests (matches the existing suite's convention).

## Setup

```bash
npm install
npm run dev        # starts the dev server at http://localhost:5180
```

> **Port 5180, not Vite's default 5173.** This is deliberate (`vite.config.js`), not a typo — an
> unrelated project's dev server on this machine frequently squats port 5173, and with
> `reuseExistingServer: true` Playwright would silently test the *wrong app* rather than erroring.
> If you ever change the port, update both `vite.config.js`'s `server.port` and
> `playwright.config.ts`'s `baseURL`/`webServer.url` together.

## Running tests

```bash
npx playwright test                        # full suite, all 3 browsers, auto-scaled workers
npx playwright test --headed                # watch it run in a real browser
npx playwright test --debug                 # step through with the Playwright inspector
npx playwright test tests/practice.spec.ts  # this file specifically (currently the only one)

# Single browser:
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Single test by name:
npx playwright test -g "Authentication Simulation"
```

`npm test` / `npm run test:headed` / `npm run test:report` (defined in `package.json`) are
shortcuts for the equivalents above plus `playwright show-report`.

### Verbose network/console tracing

Off by default (it was unconditional before this audit and just produced noise — see
`docs/OPTIMIZATION_CHANGELOG.md` §2). Turn it on when you actually need to see every console
message and network request/response for a run:

```bash
DEBUG_NETWORK=1 npx playwright test
```

Uncaught browser exceptions (`pageerror`) always print regardless of this flag — that signal is
never worth silencing.

### Workers and retries

No worker cap — Playwright auto-scales to the machine/CI runner's CPU count. This is safe here
specifically because every challenge section is isolated client-side DOM state with no shared
backend and each test gets its own browser context; don't assume this is always safe to do in a
framework that *does* share server-side state across tests.

Retries: 1 locally, 2 on CI (`process.env.CI`). Section 25 ("Random Fail (Flaky) Elements") fails
~50% of the time by design, specifically to give retries something real to do — seeing it listed
as "flaky" (not "failed") in a run is expected, not a regression.

## Reports

- **HTML:** `npx playwright show-report` after a run, or open `playwright-report/index.html`
  directly. Includes traces (captured `on-first-retry`) for anything that needed one.
- **JUnit XML:** `test-results/junit.xml` — machine-readable, for CI dashboards or PR-annotation
  tooling. Uploaded as a separate `junit-results` artifact in the GitHub Actions workflow.

## CI

`.github/workflows/tests.yml` runs the full suite on every push/PR to `main`, with Playwright
browsers cached by `package-lock.json` hash (falls back to a full `playwright install --with-deps`
on a cache miss, or just `install-deps` for OS libraries on a hit). Both the HTML report and the
JUnit XML are uploaded as build artifacts regardless of outcome (`if: always()`).

`.github/workflows/deploy-pages.yml` builds and deploys the app itself to GitHub Pages on every
push to `main` — unrelated to the test workflow, runs in parallel.

## Adding a new challenge section + test

1. Add the markup to `index.html` as a new `<section id="section-NN" data-testid="section-NN">`,
   following an existing section's structure for consistency (card header, description, the
   interactive widget, a status panel).
2. Add the logic to `src/main.ts` as a new `// Challenge NN: <name>` block, placed in numeric
   order among the existing blocks.
3. Give every interactive element a `data-testid`.
4. Add a test to `tests/practice.spec.ts`, inside the existing `test.describe` block, placed in
   challenge-number order (matching the file's existing convention) — see the Challenge 21 tests
   added by this audit for the current pattern: fill/click, assert the resulting state, and (if
   the widget has one) assert the reverse/reset path too.
5. Run `npx playwright test -g "Challenge NN"` to verify just the new test before running the
   full suite.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Tests hang or test the wrong page entirely | Another project's dev server is already running on port 5180 (or, if you changed the pinned port, on whatever port you chose) | Stop the other server, or confirm `vite.config.js` and `playwright.config.ts` agree on the port |
| `Challenge 25` test shows as failed (not flaky) | Exhausted all retries against a 50%-chance element — rare but possible | Re-run; if it fails 3+ runs in a row, that's worth investigating as a real regression, not expected behavior |
| Build fails with unused-variable errors | `tsconfig.json` has `noUnusedLocals`/`noUnusedParameters` enabled | Remove the unused code rather than suppressing the check |
