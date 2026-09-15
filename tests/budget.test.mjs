import test from 'node:test';
import assert from 'node:assert/strict';
import { expenseGroups } from '../assets/data.js';
import {
  buildBudgetSummary,
  buildOverallBudget,
  flattenItems,
  groupTotals,
  itemTotal,
  roundUnitCost
} from '../assets/budget.js';

test('explicit extras are included in the item total', () => {
  assert.equal(itemTotal({ base: 6900, extras: [{ amount: 800 }, { amount: 280 }] }), 7980);
});

test('reference unit costs round to the nearest yuan', () => {
  assert.equal(roundUnitCost(421548, 165), 2555);
  assert.equal(roundUnitCost(190000, 165), 1152);
  assert.equal(roundUnitCost(90000, 52), 1731);
  assert.equal(roundUnitCost(2600000, 165), 15758);
});

test('overall budget combines purchase, fees, deed tax and renovation', () => {
  assert.deepEqual(buildOverallBudget({
    purchasePrice: 2600000,
    agencyRate: 0.01,
    deedTaxRate: 0.02,
    renovationBudget: 421548
  }), {
    purchasePrice: 2600000,
    agencyFee: 26000,
    deedTax: 52000,
    acquisitionTotal: 2678000,
    renovationBudget: 421548,
    totalBudget: 3099548
  });
});

test('mortgage summary keeps principal separate and adds only financing interest', async () => {
  const budgetModule = await import('../assets/budget.js');
  assert.equal(typeof budgetModule.buildMortgageSummary, 'function');
  assert.deepEqual(budgetModule.buildMortgageSummary({
    principal: 2000000,
    annualRate: 0.026,
    years: 26,
    baseBudget: 3099548
  }), {
    principal: 2000000,
    annualRate: 0.026,
    years: 26,
    months: 312,
    monthlyPayment: 8826,
    totalRepayment: 2753674,
    totalInterest: 753674,
    totalWithInterest: 3853222
  });
});

test('decision history preserves all seven candidates left after three screening rounds', async () => {
  const dataModule = await import('../assets/data.js');
  assert.ok(Array.isArray(dataModule.homeCandidates));
  assert.equal(dataModule.homeCandidates.length, 7);
  assert.equal(new Set(dataModule.homeCandidates.map(candidate => candidate.id)).size, 7);
  assert.deepEqual(dataModule.homeCandidates.map(candidate => candidate.name), [
    '和茂苑一期24楼',
    '瀚河苑21楼',
    '颐和湾花园9楼',
    '阳光水榭三期1楼',
    '阳光水榭五期3楼',
    '嘉宝花园9楼',
    '嘉宝花园11楼'
  ]);
  assert.equal(dataModule.homeCandidates.filter(candidate => candidate.selected).length, 1);
  assert.equal(dataModule.homeCandidates.find(candidate => candidate.selected).purchasePrice, 2600000);
});

test('the canonical list has 116 unique items', () => {
  const items = flattenItems(expenseGroups);
  assert.equal(items.length, 116);
  assert.equal(new Set(items.map(item => item.id)).size, 116);
});

test('recent purchases use their actual prices and are no longer marked for later', () => {
  const itemsById = new Map(flattenItems(expenseGroups).map(entry => [entry.id, entry]));
  const expectedTotals = {
    'later-enamel-board': 2920,
    'later-shoe-cabinet': 330,
    'furniture-study-drawers': 500,
    'furniture-coffee-table': 400,
    'later-pegboard': 400,
    'later-door-mat': 200,
    'later-bay-cabinet': 300,
    'furniture-entry-mirror': 200,
    'furniture-bay-window-set': 300,
    'furniture-wall-clock': 100
  };

  for (const [id, total] of Object.entries(expectedTotals)) {
    const purchasedItem = itemsById.get(id);
    assert.ok(purchasedItem, `${id} should exist`);
    assert.notEqual(purchasedItem.status, 'later', `${id} should be purchased`);
    assert.equal(itemTotal(purchasedItem), total, `${id} should use the actual purchase price`);
  }

  assert.deepEqual(itemsById.get('later-enamel-board').extras, [
    { label: '安装费', amount: 120 }
  ]);
});

test('source groups reproduce the supplied subtotals', () => {
  assert.deepEqual(groupTotals(expenseGroups), {
    doors: 96260,
    basic: 201525,
    finishes: 15715,
    smart: 6249,
    appliances: 44788,
    furniture: 37611,
    later: 14950
  });
});

test('headline totals separate current and later budgets', () => {
  const summary = buildBudgetSummary(expenseGroups);
  assert.equal(summary.grandTotal, 417098);
  assert.equal(summary.currentTotal, 399298);
  assert.equal(summary.laterTotal, 17800);
  assert.equal(summary.laterCount, 14);
  assert.equal(summary.reserveTotal, 2000);
});

test('unpurchased furniture stays in soft furnishings but is marked for later', () => {
  const pendingIds = new Set([
    'furniture-child-drawers',
    'furniture-sofa-bed',
    'furniture-gaming-chairs',
    'furniture-rug'
  ]);
  const pendingFurniture = flattenItems(expenseGroups).filter(item => pendingIds.has(item.id));
  assert.equal(pendingFurniture.length, 4);
  assert.ok(pendingFurniture.every(item => item.space === 'soft'));
  assert.ok(pendingFurniture.every(item => item.status === 'later'));
  assert.equal(pendingFurniture.reduce((sum, item) => sum + itemTotal(item), 0), 7000);
});

test('space buckets conserve the complete budget', () => {
  const summary = buildBudgetSummary(expenseGroups);
  assert.deepEqual(summary.spaceBuckets.map(({ id, total }) => [id, total]), [
    ['hard', 313500],
    ['soft', 37611],
    ['tech', 51037],
    ['later', 14950]
  ]);
  assert.equal(summary.spaceBuckets.reduce((sum, bucket) => sum + bucket.total, 0), 417098);
});

test('responsibility buckets conserve the complete budget', () => {
  const summary = buildBudgetSummary(expenseGroups);
  assert.deepEqual(summary.responsibilityBuckets.map(({ id, total }) => [id, total]), [
    ['contract', 190000],
    ['contract-outside', 123500],
    ['owner', 103598]
  ]);
  assert.equal(summary.responsibilityBuckets.reduce((sum, bucket) => sum + bucket.total, 0), 417098);
});
