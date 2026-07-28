<div align="center" markdown="1">

# 🎯 Automation Playground

### A free, open-source sandbox for practicing UI test automation

![Status](https://img.shields.io/badge/status-active-success.svg)
![Sections](https://img.shields.io/badge/sections-41-blue.svg)
![Free](https://img.shields.io/badge/education-100%25%20free-brightgreen.svg)
![Stack](https://img.shields.io/badge/stack-Vite%20%2B%20TypeScript-646cff.svg)

### 🌐 [Try it live →](https://ghanendra-sdet.github.io/automation-playground/)

</div>

---

## What This Is

41 self-contained challenge sections — real forms, tables, alerts, modals, iframes, shadow DOM,
drag & drop, flaky/randomized elements, dynamic lists, debounced search, and more — built
specifically to be pointed at with Playwright, Selenium, Cypress, or Robot Framework. Every
interactive element carries an `id`, `data-testid`, and `aria-label`, so you can practice every
locator strategy on one page instead of hunting across the internet for a site that has the one
specific UI pattern you're trying to learn.

Built with **Vite + TypeScript**, includes a dark/light theme toggle, and ships with a real
**Playwright test suite** you can read, run, and extend.

## Sections

```
01. Basic Form Elements          15. Tooltip                      29. Resizable Element
02. Button Interactions          16. File Upload                  30. Complex DOM Structure
03. Checkboxes & Radio Buttons   17. Download                     31. Autocomplete / Typeahead
04. Dropdowns                    18. Hidden Elements               32. Context Menu (Right-Click)
05. Locator Practice             19. Scroll Testing                33. Clipboard / Copy to Clipboard
06. Dynamic Content              20. Multiple Windows              34. Multi-Step Wizard / Stepper
07. Waits & Synchronisation      21. Authentication Simulation     35. Color Picker
08. Table Automation             22. Stale Element Simulation      36. Nested iFrames
09. Alerts                       23. Dynamic List                  37. Nested Tables
10. Modals                       24. Network Delay Simulation      38. Page Operations
11. iFrame                       25. Random Fail (Flaky) Elements  39. Bulk Links Scraper
12. Shadow DOM                   26. Keyboard Actions              40. Infinite Scroll
13. Drag & Drop                  27. Slider                        41. Search with Debounce
14. Hover Menu                   28. Date Picker                       + Character API Call Simulation
```

## Running Locally

```bash
npm install
npm run dev        # starts the dev server (Vite prints the local URL)
```

## Running the Tests

```bash
npx playwright test              # headless
npx playwright test --headed     # watch it happen in a real browser
npx playwright show-report       # view the HTML report after a run
```

> [!NOTE]
> The included test suite (`tests/practice.spec.ts`) currently covers a subset of the 41 sections
> as worked examples — Basic Form Elements, Button Interactions, and others. It's meant as a
> starting point to extend, not a claim that every section is pre-tested. Contributions adding
> coverage for more sections are welcome.

## Tech Stack

| Category | Tool |
|---|---|
| Build tool | Vite |
| Language | TypeScript |
| Testing | Playwright |
| Hosting | GitHub Pages |

## Contributing

Found a bug, want to add a new challenge section, or add test coverage for an existing one? Fork
it, branch, and open a PR — see the section list above for gaps.

## License

MIT — see [LICENSE](LICENSE).
