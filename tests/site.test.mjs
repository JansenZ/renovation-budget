import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('page exposes required semantic regions and metadata', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of ['<main', 'data-summary', 'data-allocation', 'data-analysis', 'data-expense-groups', 'assets/app.js']) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
  assert.ok(html.includes('width=device-width'));
  assert.ok(html.includes('嘉宝花园装修清单'));
});

test('shareable property context identifies the home and floor plan', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of [
    '嘉宝花园装修清单',
    '165㎡',
    '四室两厅两卫',
    '约 52㎡',
    'assets/jiabao-floor-plan.png',
    'data-reference-metrics'
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
  assert.ok(html.includes('property="og:image"'));
});

test('community context records purchase, building, elevator and school facts', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of [
    '购入总价',
    '260 万元',
    '约 20 年',
    '总高 15 层',
    '2 梯 2 户',
    '2026 年新换日立电梯',
    '容积率 1.5',
    '吴中宝带实验小学',
    '吴中迎春中学',
    '以教育部门当年公布为准',
    'data-purchase-unit-price'
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
  assert.ok(!html.includes('当前记录为吴中宝带实验小学'));
});

test('home and renovation records are separated into shareable hash tabs', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of [
    'role="tablist"',
    'href="#home"',
    'href="#budget"',
    'id="home-panel"',
    'id="budget-panel"',
    'data-overall-budget',
    '中介费（1%）',
    '契税（2%）',
    '已知全周期总预算'
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
  assert.ok(!html.includes('开放厨房'));
  assert.ok(!html.includes('空间特点'));
  assert.ok(!html.includes('厨房形式'));
});

test('tabs put purchase decision first while renovation is the third and default tab', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const decisionIndex = html.indexOf('id="decision-tab"');
  const homeIndex = html.indexOf('id="home-tab"');
  const budgetIndex = html.indexOf('id="budget-tab"');
  assert.ok(decisionIndex < homeIndex && homeIndex < budgetIndex);
  assert.ok(html.includes('id="budget-tab" class="record-tab" href="#budget" role="tab" aria-controls="budget-panel" aria-selected="true"'));
});

test('public project files do not expose the selected building number', async () => {
  const urls = [
    '../index.html',
    '../assets/data.js',
    '../README.md',
    '../docs/research/school-districts.md'
  ];
  for (const url of urls) {
    const contents = await readFile(new URL(url, import.meta.url), 'utf8');
    assert.ok(!/嘉宝花园\s*\d{3}\s*(?:号楼|幢)|jiabao-\d{3}-|产权地址确认/.test(contents), `private building detail remains in ${url}`);
  }
});

test('empty and invalid hashes resolve to the renovation ledger', async () => {
  const navigation = await import('../assets/navigation.js').catch(() => ({}));
  assert.equal(typeof navigation.resolveTabName, 'function');
  const tabs = new Set(['decision', 'home', 'budget']);
  assert.equal(navigation.resolveTabName('', tabs), 'budget');
  assert.equal(navigation.resolveTabName('unknown', tabs), 'budget');
  assert.equal(navigation.resolveTabName('decision', tabs), 'decision');
});

test('home record includes financing, parking and the 2026 elevator update', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of [
    'data-mortgage',
    '公积金贷款',
    '年利率 2.6%',
    '26 年',
    '等额本息',
    '地库车位',
    '13 万元',
    '280 元/月',
    '2026 年新换日立电梯'
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
});

test('purchase decision is a third shareable tab with a three-stage funnel and finalist comparison', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of [
    'href="#decision"',
    'id="decision-panel"',
    '购房选择',
    'data-home-candidates',
    '三轮筛选后的候选',
    '终极对比',
    '最终购买',
    '价格未谈拢'
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
});

test('decision page explains the three-round funnel and reusable scoring method', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const token of [
    'data-screening-stages',
    'data-preference-dimensions',
    'data-historical-score-rules',
    '三轮筛选后的候选',
    '个人偏好权重',
    '未选择原因'
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
});

test('decision page lists every candidate from both records and qualifies the school claim', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const data = await readFile(new URL('../assets/data.js', import.meta.url), 'utf8');
  for (const token of [
    '和茂苑一期24楼',
    '瀚河苑21楼',
    '颐和湾花园9楼',
    '阳光水榭三期1楼',
    '阳光水榭五期3楼',
    '嘉宝花园9楼',
    '嘉宝花园11楼'
  ]) {
    assert.ok(data.includes(token), `missing ${token}`);
  }
  assert.ok(html.includes('2026年吴中区小学、初中施教区'));
});

test('page uses a compact ledger structure without the old presentation controls', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(!html.includes('data-view-button'));
  assert.ok(!html.includes('hero-stamp'));
  assert.ok(!html.includes('section-index'));
});

test('page loads its visual system and has accessible navigation hooks', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../assets/styles.css', import.meta.url), 'utf8');
  assert.ok(html.includes('assets/styles.css'));
  assert.ok(html.includes('href="#main-content"'));
  assert.ok(html.includes('id="main-content"'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes('@media (max-width: 640px)'));
});

test('Pages custom domain is exact', async () => {
  const cname = await readFile(new URL('../CNAME', import.meta.url), 'utf8');
  assert.equal(cname.trim(), 'home.zhenglin.vip');
});
