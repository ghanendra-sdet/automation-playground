# Optimization Changelog — automation-playground

Companion to `docs/FRAMEWORK_AUDIT.md` (read that first for findings and evidence). This document
records exactly what changed, why, and how each change was validated. Nothing in this changelog
has been committed or pushed — all changes are in the working tree, pending manual review per
your standing workflow.

---

## 1. Removed the `workers: 1` cap

**File:** `playwright.config.ts`

**Problem:** `workers: 1` was hardcoded directly alongside `fullyParallel: true` — the two
settings contradicted each other, since one worker has nothing to parallelize across. No comment
explained why it was capped.

**Change:**
```diff
- workers: 1,
- reporter: 'html',
+ // No workers cap: every challenge section is self-contained client-side DOM state with
+ // no shared backend, and each test gets its own isolated browser context, so there's no
+ // cross-test contention to guard against. Measured 1.1min (workers:1) vs 18s (workers:4)
+ // on identical results — let Playwright auto-scale to the machine/CI runner instead of
+ // hardcoding a worker count that'd be wrong on a different core count.
+ reporter: [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]],
```

**Validation:**
```
$ time npx playwright test --workers=1 --reporter=line   # (original baseline)
16 passed, 2 flaky → 18/18, 0 failed — 66.0s total

$ time npx playwright test --workers=4 --reporter=line
17 passed, 1 flaky → 18/18, 0 failed — 18.0s total
```
Identical correctness, 3.7x faster. No shared state hazard — confirmed the app has no backend
(`docs/FRAMEWORK_AUDIT.md` §4) so there was no reason for the cap to begin with.

---

## 2. Gated verbose console/network logging behind `DEBUG_NETWORK=1`

**File:** `tests/practice.spec.ts`

**Problem:** `beforeEach` unconditionally logged every browser console message and every network
request/response to stdout, for every test, pass or fail — pure noise that buried the one
genuinely useful signal (`pageerror` — uncaught exceptions).

**Change:**
```diff
  test.beforeEach(async ({ page }) => {
-   // Listen for browser console logs and uncaught exceptions
-   page.on('console', msg => {
-     console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
-   });
+   // Uncaught exceptions always matter, pass or fail — keep this unconditional.
    page.on('pageerror', err => {
      console.error(`[BROWSER UNCAUGHT ERROR] ${err.stack || err.message}`);
    });

-   // Listen for network requests and responses
-   page.on('request', req => console.log(`>> REQ: [${req.method()}] ${req.url()}`));
-   page.on('response', res => console.log(`<< RES: [${res.status()}] ${res.url()}`));
+   // Verbose console/network tracing is opt-in (DEBUG_NETWORK=1). It was previously
+   // unconditional, which printed every console message and every request/response for
+   // every passing test — pure noise that buried real signal. The HTML report's trace
+   // viewer (`trace: 'on-first-retry'`) already captures this per-test when something
+   // actually goes wrong.
+   if (process.env.DEBUG_NETWORK) {
+     page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
+     page.on('request', req => console.log(`>> REQ: [${req.method()}] ${req.url()}`));
+     page.on('response', res => console.log(`<< RES: [${res.status()}] ${res.url()}`));
+   }

    await page.goto('/');
  });
```

**Validation:** ran the suite with and without `DEBUG_NETWORK=1` set; confirmed verbose output
only appears when the flag is set, and `pageerror` reporting (tested by temporarily throwing in
the console to confirm the listener still fires) is unaffected either way.

---

## 3. Added missing test coverage for Section 21 (Authentication Simulation)

**File:** `tests/practice.spec.ts`

**Problem:** `src/main.ts:1320-1368` / `index.html:747-782` implement a complete login → session
→ logout flow (demo credentials `admin`/`admin123`, a mock token in `localStorage`, a protected
dashboard view) with zero test coverage — the only feature in the app that models auth/session
state, untested.

**Change:** added two tests, inserted in challenge-number order ahead of Challenge 25:
- `Challenge 21: Authentication Simulation — login, session, and logout` — fills valid
  credentials, asserts the status flips to "Logged In," the dashboard becomes visible, the
  session token renders the expected value, then logs out and asserts the state fully reverts.
- `Challenge 21: Authentication Simulation — invalid credentials are rejected` — fills a wrong
  password, asserts status becomes "Invalid Credentials" and the dashboard never appears.

Both read real `data-testid`s confirmed by reading the source directly (`auth-username`,
`auth-password`, `btn-login`, `btn-logout`, `auth-status`, `auth-dashboard`, `session-token`) —
nothing invented.

**Validation:** both tests pass across all 3 browser projects (6/6), confirmed in the full suite
run below.

---

## 4. Added JUnit reporter output

**File:** `playwright.config.ts` (same edit as change #1 above)

**Problem:** only an HTML reporter was configured — useful for a human, not for CI tooling that
needs machine-readable results.

**Change:** `reporter: 'html'` → `reporter: [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]]`.

**Validation:**
```
$ npx playwright test   # no --reporter override, uses the real config
...
1 flaky, 23 passed (25.1s)

$ ls -la test-results/junit.xml
-rw-r--r-- 1 paywize staff 4561 ... test-results/junit.xml

$ head -c 300 test-results/junit.xml
<testsuites id="" name="" tests="24" failures="0" skipped="0" errors="0" time="25.067414">
<testsuite name="practice.spec.ts" ... tests="8" failures="0" skipped="0" ...>
<testcase name="Automation Practice Playground › Challenge 01: Basic Form Elements" ...>
```
File confirmed non-empty and well-formed.

---

## 5. Added Playwright browser caching to CI

**File:** `.github/workflows/tests.yml`

**Problem:** every push/PR ran `npx playwright install --with-deps` from a cold cache, downloading
all three browser engines from scratch every time.

**Change:**
```diff
       - run: npm ci
+      - name: Cache Playwright browsers
+        uses: actions/cache@v4
+        id: playwright-cache
+        with:
+          path: ~/.cache/ms-playwright
+          key: ${{ runner.os }}-playwright-${{ hashFiles('package-lock.json') }}
-      - run: npx playwright install --with-deps
+      - run: npx playwright install --with-deps
+        if: steps.playwright-cache.outputs.cache-hit != 'true'
+      - run: npx playwright install-deps
+        if: steps.playwright-cache.outputs.cache-hit == 'true'
       - run: npm test
       - uses: actions/upload-artifact@v4
         if: always()
         with:
           name: playwright-report
           path: playwright-report/
           retention-days: 14
+      - uses: actions/upload-artifact@v4
+        if: always()
+        with:
+          name: junit-results
+          path: test-results/junit.xml
+          retention-days: 14
```

Standard Playwright CI caching pattern: on a cache hit, skip the (slow) browser binary download
but still run `install-deps` to ensure OS-level shared libraries are present on the runner image.

**Validation:** YAML structure reviewed for correctness (matches Playwright's documented caching
pattern); **not executed** — this only runs in GitHub Actions, not locally. Flagged as an
environmental limitation below.

---

## 6. Full before/after suite comparison

**Before (original `main`, `workers: 1`, no new tests):**
```
$ npx playwright test --reporter=line
16 passed
2 flaky:
  [chromium] Challenge 25: Flaky Operations (Automatic Retries)
  [webkit]   Challenge 25: Flaky Operations (Automatic Retries)
18 tests total — 0 failed, 0 skipped — 66.0s
```

**After (all changes applied):**
```
$ npx playwright test
23 passed
1 flaky:
  [webkit] Challenge 25: Flaky Operations (Automatic Retries)
24 tests total — 0 failed, 0 skipped — 25.1s
```

The flaky count (1-2, always Section 25) varies slightly run-to-run by design — it's a randomized
50%-fail element. Every run across this audit had **zero genuine failures** and the new
Section 21 tests passed cleanly on all 3 browser projects every time they were run.

**Build**, both before and after: `npm run build` (tsc + vite build) — clean, no warnings.

---

## 7. Recommended but not implemented

| Item | Why not done now | Reference |
|---|---|---|
| ESLint/Prettier | New devDependency + config overhead not yet justified at this file count; your call to make | `docs/FRAMEWORK_AUDIT.md` L1 |
| Smoke/sanity/regression tags | Only 8 tests exist; a classification system needs something to classify first | `docs/FRAMEWORK_AUDIT.md` L2 |
| Splitting `main.ts`/`index.html`/`style.css` into modules or a POM layer | Prior, documented, intentional decision for this app's shape; would add indirection without reducing duplication | `docs/FRAMEWORK_AUDIT.md` §4 |
| Business-module coverage (Merchants/Payout/Connected Banking/etc.) | Doesn't exist in this repo — see `docs/FRAMEWORK_AUDIT.md` §0 | — |

## 8. Environmental limitations

- The CI caching change (§5) could not be executed locally — GitHub Actions workflows only run on
  GitHub's runners. The YAML was reviewed against Playwright's own documented caching pattern but
  is unverified in a real CI run until you push it.
- No credentials, external services, or environment variables were required for anything in this
  audit — the app has none to begin with (`docs/FRAMEWORK_AUDIT.md` §4), so there is nothing left
  unverified on that front.
