# Renovation Budget Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a responsive Chinese renovation-budget dashboard at `home.zhenglin.vip` from the supplied 113-item expense list.

**Architecture:** A dependency-free GitHub Pages site keeps raw expense records in one ES module and all aggregation logic in a separate pure module. The browser renderer consumes only computed view models, so a future API can replace the local data source without changing category definitions or page structure.

**Tech Stack:** Semantic HTML5, CSS Grid/Flexbox, native SVG/CSS charts, browser ES modules, Node.js built-in test runner, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-19-renovation-budget-design.md`

## Global Constraints

- The first release is static: no login, database, online editing, upload, ECS, OSS, paid certificate, CDN, or runtime API.
- All amounts are integer RMB yuan; explicit installation and accessory fees are included in item totals and remain visible as components.
- All groups except `later` are treated as current committed budget; the ¥2,000 unknown-item reserve is labeled as a reserve rather than spent money.
- Preserve all 113 supplied items exactly once across seven source groups.
- Use no external chart, font, or analytics dependency.
- Support 360px mobile and 1440px desktop without horizontal overflow.
- The deployment target is a public repository named `jansenz/renovation-budget` with custom domain `home.zhenglin.vip`.

## File Map

- `index.html` — semantic document shell, metadata, summary/chart/detail mount points, methodology copy.
- `package.json` — declares browser/Node ES module semantics and the dependency-free test command.
- `assets/data.js` — canonical 113-item dataset and source-group metadata only.
- `assets/budget.js` — pure validation, fee calculation, aggregation, percentage, and analysis functions.
- `assets/app.js` — DOM rendering, accordion behavior, and compact SVG/CSS allocation visuals.
- `assets/styles.css` — warm editorial design system and responsive/accessibility rules.
- `tests/budget.test.mjs` — arithmetic, uniqueness, group totals, and cross-dimension conservation tests.
- `tests/site.test.mjs` — static document/module/metadata deployment contract checks.
- `CNAME` — GitHub Pages custom domain.
- `README.md` — local preview, tests, deployment, DNS, and future API notes.

---

### Task 1: Canonical expense data and arithmetic contract

**Files:**
- Create: `package.json`
- Create: `assets/data.js`
- Create: `assets/budget.js`
- Create: `tests/budget.test.mjs`

**Interfaces:**
- Produces: `expenseGroups: ExpenseGroup[]`, where each item is `{ id, name, base, extras, note, scope, status }`.
- Produces: `itemTotal(item): number`, `flattenItems(groups): ExpenseItem[]`, and `groupTotals(groups): Record<string, number>`.
- Expected source totals: doors ¥96,260; basic ¥201,525; finishes ¥15,715; smart ¥6,249; appliances ¥44,788; furniture ¥38,611; later source group ¥18,400.

- [ ] **Step 1: Write the failing arithmetic and dataset tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { expenseGroups } from '../assets/data.js';
import { flattenItems, groupTotals, itemTotal } from '../assets/budget.js';

test('explicit extras are included in the item total', () => {
  assert.equal(itemTotal({ base: 6900, extras: [{ amount: 800 }, { amount: 280 }] }), 7980);
});

test('the canonical list has 113 unique items', () => {
  const items = flattenItems(expenseGroups);
  assert.equal(items.length, 113);
  assert.equal(new Set(items.map(item => item.id)).size, 113);
});

test('source groups reproduce the supplied subtotals', () => {
  assert.deepEqual(groupTotals(expenseGroups), {
    doors: 96260,
    basic: 201525,
    finishes: 15715,
    smart: 6249,
    appliances: 44788,
    furniture: 38611,
    later: 18400
  });
});
```

- [ ] **Step 2: Run the tests and verify the missing modules fail**

Run: `node --test tests/budget.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `assets/data.js` or `assets/budget.js`.

- [ ] **Step 3: Implement the dataset and minimal arithmetic functions**

Create `package.json` with `{ "type": "module", "scripts": { "test": "node --test tests/*.test.mjs" } }` so the same ES modules load in Node and the browser.

Create seven ordered groups with 4, 13, 19, 19, 14, 29, and 15 items respectively. Represent each visible surcharge separately; for example:

```js
{
  id: 'appliance-living-duct-ac',
  name: '客厅米家风管机 4 匹',
  base: 6900,
  extras: [
    { label: '加长铜管', amount: 800 },
    { label: '延长面板', amount: 280 }
  ],
  note: '主机 5000 + 安装 1900',
  scope: 'owner',
  status: 'committed'
}
```

Implement pure arithmetic:

```js
export const itemTotal = item =>
  item.base + (item.extras ?? []).reduce((sum, extra) => sum + extra.amount, 0);

export const flattenItems = groups => groups.flatMap(group =>
  group.items.map(item => ({ ...item, groupId: group.id, groupName: group.name }))
);

export const groupTotals = groups => Object.fromEntries(
  groups.map(group => [group.id, group.items.reduce((sum, item) => sum + itemTotal(item), 0)])
);
```

- [ ] **Step 4: Run the arithmetic tests**

Run: `node --test tests/budget.test.mjs`

Expected: 3 tests PASS.

- [ ] **Step 5: Commit the canonical data contract**

```bash
git add package.json assets/data.js assets/budget.js tests/budget.test.mjs
git commit -m "feat: add canonical renovation expense data"
```

### Task 2: Classification and analysis view model

**Files:**
- Modify: `assets/budget.js`
- Modify: `tests/budget.test.mjs`

**Interfaces:**
- Consumes: `expenseGroups`, `itemTotal`, `flattenItems` from Task 1.
- Produces: `buildBudgetSummary(groups): BudgetSummary` with `grandTotal`, `currentTotal`, `laterTotal`, `reserveTotal`, `sourceGroups`, `spaceBuckets`, `responsibilityBuckets`, `largestItems`.
- Produces: `formatCurrency(value): string` and `formatPercent(value, total): string`.

- [ ] **Step 1: Add failing conservation and headline tests**

```js
import { buildBudgetSummary } from '../assets/budget.js';

test('headline totals separate current and later budgets', () => {
  const summary = buildBudgetSummary(expenseGroups);
  assert.equal(summary.grandTotal, 421548);
  assert.equal(summary.currentTotal, 393648);
  assert.equal(summary.laterTotal, 27900);
  assert.equal(summary.laterCount, 21);
  assert.equal(summary.reserveTotal, 2000);
});

test('space buckets conserve the complete budget', () => {
  const summary = buildBudgetSummary(expenseGroups);
  assert.deepEqual(summary.spaceBuckets.map(({ id, total }) => [id, total]), [
    ['hard', 313500],
    ['soft', 38611],
    ['tech', 51037],
    ['later', 18400]
  ]);
  assert.equal(summary.spaceBuckets.reduce((sum, bucket) => sum + bucket.total, 0), 421548);
});

test('responsibility buckets conserve the complete budget', () => {
  const summary = buildBudgetSummary(expenseGroups);
  assert.deepEqual(summary.responsibilityBuckets.map(({ id, total }) => [id, total]), [
    ['contract', 190000],
    ['contract-outside', 123500],
    ['owner', 108048]
  ]);
});
```

- [ ] **Step 2: Run the new tests and verify failure**

Run: `node --test tests/budget.test.mjs`

Expected: FAIL because `buildBudgetSummary` is not exported.

- [ ] **Step 3: Implement classification and summary builders**

Aggregate strictly from item fields; never hard-code headline totals into production code. Use stable ordered bucket definitions and return percentage values as `(bucket.total / grandTotal) * 100`. Sort `largestItems` by computed total descending and return the first five.

- [ ] **Step 4: Run all budget tests**

Run: `node --test tests/budget.test.mjs`

Expected: all tests PASS and totals match ¥421,548.

- [ ] **Step 5: Commit the view model**

```bash
git add assets/budget.js tests/budget.test.mjs
git commit -m "feat: calculate renovation budget analysis"
```

### Task 3: Semantic page and browser renderer

**Files:**
- Create: `index.html`
- Create: `assets/app.js`
- Create: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `expenseGroups` and `buildBudgetSummary(groups)`.
- Produces: rendered `[data-summary]`, `[data-allocation]`, `[data-insights]`, and `[data-expense-groups]` regions.
- Produces: native `<details>` disclosure elements for every source group.

- [ ] **Step 1: Write failing static contract tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('page exposes required semantic regions and metadata', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of ['<main', 'data-summary', 'data-allocation', 'data-expense-groups', 'assets/app.js']) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
  assert.ok(html.includes('width=device-width'));
  assert.ok(html.includes('家的装修账本'));
});
```

- [ ] **Step 2: Run static tests and verify failure**

Run: `node --test tests/site.test.mjs`

Expected: FAIL with `ENOENT` for `index.html`.

- [ ] **Step 3: Build the semantic HTML shell**

Include one `h1`, a concise privacy-neutral description, four labeled sections, a methodology footer, stylesheet link, and `<script type="module" src="assets/app.js"></script>`. Include useful Open Graph title/description fields without an external preview image.

- [ ] **Step 4: Implement safe rendering and disclosure interaction**

Use DOM creation and `textContent` for expense content. Render the allocation as labeled CSS segments whose widths come from summary percentages. For each group, render a `<details>` with a `<summary>` showing group subtotal and item count; render base price, extra rows, item total, and notes. Open `basic` and `finishes` by default.

- [ ] **Step 5: Run static and JavaScript syntax tests**

Run: `node --test tests/*.test.mjs && node --check assets/app.js`

Expected: all tests PASS and syntax check exits 0.

- [ ] **Step 6: Commit the rendered dashboard**

```bash
git add index.html assets/app.js tests/site.test.mjs
git commit -m "feat: render renovation budget dashboard"
```

### Task 4: Responsive visual system and accessibility

**Files:**
- Create: `assets/styles.css`
- Modify: `index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: semantic classes and data attributes from Task 3.
- Produces: layout at 360px, 736px, 1024px, and 1440px; visible focus styles; reduced-motion behavior.

- [ ] **Step 1: Extend static tests for style and accessibility hooks**

```js
test('page loads its visual system and has an accessible skip link', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('assets/styles.css'));
  assert.ok(html.includes('href="#main-content"'));
  assert.ok(html.includes('id="main-content"'));
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/site.test.mjs`

Expected: FAIL because the stylesheet or skip link is missing.

- [ ] **Step 3: Implement the warm editorial design system**

Define local system-font stacks, an off-white canvas, dark ink text, terracotta and sage accents, tabular numerals, restrained 1px rules, a 72rem content maximum, responsive summary grids, compact breakdown rows, and print styles. Add `:focus-visible`, `prefers-reduced-motion`, and `prefers-contrast` rules. Do not load remote fonts.

- [ ] **Step 4: Verify at target widths in a real browser**

Run a local server with `python3 -m http.server 4173`, open `http://127.0.0.1:4173`, and inspect at 360×800 and 1440×1000. Expected: no horizontal scrollbar, hero totals do not clip, allocation labels remain readable, disclosures are keyboard-operable, and all 113 items appear.

- [ ] **Step 5: Run automated checks and commit**

```bash
node --test tests/*.test.mjs
git add index.html assets/styles.css tests/site.test.mjs
git commit -m "style: add responsive household budget design"
```

### Task 5: Pages configuration and operational documentation

**Files:**
- Create: `CNAME`
- Create: `README.md`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: a Pages-ready repository whose custom domain is exactly `home.zhenglin.vip`.

- [ ] **Step 1: Add failing deployment contract test**

```js
test('Pages custom domain is exact', async () => {
  const cname = await readFile(new URL('../CNAME', import.meta.url), 'utf8');
  assert.equal(cname.trim(), 'home.zhenglin.vip');
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/site.test.mjs`

Expected: FAIL with `ENOENT` for `CNAME`.

- [ ] **Step 3: Add deployment files**

Write `home.zhenglin.vip` as the only line in `CNAME`. Document these exact DNS values in `README.md`: record type `CNAME`, host `home`, value `jansenz.github.io`, default TTL. Document `python3 -m http.server 4173`, `node --test tests/*.test.mjs`, Pages-from-main deployment, HTTPS enforcement after certificate issuance, and the future API boundary.

- [ ] **Step 4: Run all local verification**

Run: `node --test tests/*.test.mjs && node --check assets/data.js && node --check assets/budget.js && node --check assets/app.js`

Expected: all tests PASS and all syntax checks exit 0.

- [ ] **Step 5: Commit Pages configuration**

```bash
git add CNAME README.md tests/site.test.mjs
git commit -m "docs: configure GitHub Pages deployment"
```

### Task 6: Publish and verify the live site

**Files:**
- No source changes expected unless live verification reveals a defect.

**Interfaces:**
- Consumes: GitHub and Alibaba Cloud browser sessions supplied by the user.
- Produces: public HTTPS URL `https://home.zhenglin.vip`.

- [ ] **Step 1: Create the public GitHub repository**

Create `jansenz/renovation-budget` without generated README/license files, add it as `origin`, and push `main`.

- [ ] **Step 2: Enable GitHub Pages**

Configure Pages to deploy from the `main` branch root and set the custom domain to `home.zhenglin.vip`.

- [ ] **Step 3: Configure Alibaba Cloud DNS**

Add a CNAME record with host `home` and value `jansenz.github.io`. Do not modify the apex `zhenglin.vip` records used by the knowledge base.

- [ ] **Step 4: Wait for DNS and certificate issuance**

Verify `dig +short home.zhenglin.vip CNAME` returns `jansenz.github.io.` and GitHub Pages shows a valid certificate; then enable Enforce HTTPS.

- [ ] **Step 5: Verify production**

Run: `curl -sSIL https://home.zhenglin.vip`

Expected: final response is HTTP 200, server is GitHub.com, and the page title/content render in a browser at mobile and desktop widths.

- [ ] **Step 6: Record the live URL**

Add the live URL to the repository About/Homepage field and report any user action that remains due to login, CAPTCHA, or account approval.
