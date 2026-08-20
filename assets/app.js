import {
  expenseGroups,
  historicalScoreRules,
  homeCandidates,
  preferenceDimensions,
  screeningStages
} from './data.js';
import { scoreCandidate, sortCandidatesByScore } from './decision.js';
import { resolveTabName } from './navigation.js';
import {
  buildBudgetSummary,
  buildMortgageSummary,
  buildOverallBudget,
  formatCurrency,
  formatPercent,
  itemTotal,
  roundUnitCost
} from './budget.js';

const summary = buildBudgetSummary(expenseGroups);
const propertyArea = 165;
const windowArea = 52;
const purchasePrice = 2600000;
const overallBudget = buildOverallBudget({
  purchasePrice,
  agencyRate: 0.01,
  deedTaxRate: 0.02,
  renovationBudget: summary.grandTotal
});
const mortgage = buildMortgageSummary({
  principal: 2000000,
  annualRate: 0.026,
  years: 26,
  baseBudget: overallBudget.totalBudget
});

const createElement = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const getBucket = (buckets, id) => buckets.find(bucket => bucket.id === id);

const renderSummary = () => {
  const root = document.querySelector('[data-summary]');
  const hard = getBucket(summary.spaceBuckets, 'hard');
  const cards = [
    ['完整预算', formatCurrency(summary.grandTotal), `${summary.itemCount} 项`],
    ['当前已列入', formatCurrency(summary.currentTotal), `含预留 ${formatCurrency(summary.reserveTotal)}`],
    ['硬装投入', formatCurrency(hard.total), formatPercent(hard.total, summary.grandTotal)],
    ['尚未购买', formatCurrency(summary.laterTotal), `${summary.laterCount} 项`]
  ];

  cards.forEach(([label, value, note], index) => {
    const card = createElement('article', `summary-card${index === 0 ? ' summary-primary' : ''}`);
    card.append(
      createElement('p', 'summary-label', label),
      createElement('strong', 'summary-value', value),
      createElement('p', 'summary-note', note)
    );
    root.append(card);
  });
};

const renderAllocation = () => {
  const root = document.querySelector('[data-allocation]');
  summary.spaceBuckets.forEach((bucket, index) => {
    const row = createElement('article', 'allocation-row');
    const heading = createElement('div', 'allocation-heading');
    heading.append(
      createElement('strong', '', bucket.name),
      createElement('span', '', `${formatCurrency(bucket.total)} · ${formatPercent(bucket.total, summary.grandTotal)}`)
    );
    const track = createElement('div', 'allocation-track');
    track.setAttribute('role', 'img');
    track.setAttribute('aria-label', `${bucket.name}占完整预算${formatPercent(bucket.total, summary.grandTotal)}`);
    const fill = createElement('span', `allocation-fill fill-${index + 1}`);
    fill.style.setProperty('--fill-width', `${bucket.percent}%`);
    track.append(fill);
    row.append(heading, track);
    root.append(row);
  });
};

const renderReferenceMetrics = () => {
  const root = document.querySelector('[data-reference-metrics]');
  const hard = getBucket(summary.spaceBuckets, 'hard');
  const contract = getBucket(summary.responsibilityBuckets, 'contract');
  const windowBody = expenseGroups
    .flatMap(group => group.items)
    .find(entry => entry.id === 'doors-balcony-e3');
  const metrics = [
    ['完整预算', roundUnitCost(summary.grandTotal, propertyArea), '按建筑面积'],
    ['当前投入', roundUnitCost(summary.currentTotal, propertyArea), '不含尚未购买'],
    ['实际硬装', roundUnitCost(hard.total, propertyArea), '合同内＋合同外'],
    ['装修合同', roundUnitCost(contract.total, propertyArea), '19 万合同主体'],
    ['封窗主体', roundUnitCost(itemTotal(windowBody), windowArea), '按约 52㎡窗体']
  ];

  metrics.forEach(([label, value, note]) => {
    const metric = createElement('article', 'reference-metric');
    metric.append(
      createElement('span', '', label),
      createElement('strong', '', `${formatCurrency(value)}/㎡`),
      createElement('small', '', note)
    );
    root.append(metric);
  });
};

const renderPropertyContext = () => {
  const unitPrice = document.querySelector('[data-purchase-unit-price]');
  unitPrice.textContent = `约 ${formatCurrency(roundUnitCost(purchasePrice, propertyArea))}/㎡`;
};

const renderOverallBudget = () => {
  document.querySelectorAll('[data-overall-value]').forEach(node => {
    node.textContent = formatCurrency(overallBudget[node.dataset.overallValue]);
  });
};

const renderMortgage = () => {
  document.querySelectorAll('[data-mortgage-value]').forEach(node => {
    node.textContent = formatCurrency(mortgage[node.dataset.mortgageValue]);
  });
};

const renderScreeningStages = () => {
  const root = document.querySelector('[data-screening-stages]');
  screeningStages.forEach((stage, index) => {
    const card = createElement('article', 'screening-stage');
    card.append(
      createElement('span', 'screening-index', `0${index + 1}`),
      createElement('h3', '', stage.name),
      createElement('p', '', stage.description)
    );
    root.append(card);
  });
};

const renderPreferenceDimensions = () => {
  const root = document.querySelector('[data-preference-dimensions]');
  preferenceDimensions.forEach(dimension => {
    const card = createElement('article', 'preference-dimension');
    const heading = createElement('div');
    heading.append(
      createElement('h3', '', dimension.name),
      createElement('strong', '', `${dimension.weight}%`)
    );
    card.append(heading, createElement('p', '', dimension.description));
    root.append(card);
  });
};

const renderHistoricalScoreRules = () => {
  const root = document.querySelector('[data-historical-score-rules]');
  historicalScoreRules.forEach(rule => {
    const item = createElement('article', 'historical-score-rule');
    item.append(createElement('strong', '', rule.name), createElement('p', '', rule.rule));
    root.append(item);
  });
};

const scoreLabels = {
  traffic: '交通',
  layout: '户型',
  surroundings: '周边',
  community: '小区',
  education: '教育',
  age: '房龄',
  elevator: '梯户',
  parking: '车位',
  price: '价格',
  special: '修正'
};

const formatScorePart = (id, score) => {
  if (id === 'special' && score > 0) return `+${score}`;
  return String(score);
};

const renderCandidates = () => {
  const root = document.querySelector('[data-home-candidates]');
  sortCandidatesByScore(homeCandidates).forEach((candidate, index) => {
    const card = createElement('article', `candidate-card${candidate.selected ? ' candidate-selected' : ''}${candidate.finalist && !candidate.selected ? ' candidate-finalist' : ''}`);
    const heading = createElement('div', 'candidate-heading');
    const title = createElement('div');
    title.append(
      createElement('span', 'candidate-rank', `#${index + 1}`),
      createElement('h3', '', candidate.name)
    );
    if (candidate.selected) title.append(createElement('span', 'decision-status', '最终购买'));
    else if (candidate.finalist) title.append(createElement('span', 'decision-status', '进入终选'));
    heading.append(title, createElement('strong', 'candidate-score', `${scoreCandidate(candidate)} 分`));

    const facts = createElement('dl', 'candidate-facts');
    const factRows = [
      ['建筑 / 实用', `${candidate.buildingArea}㎡ / ${candidate.usableArea}㎡`],
      ['记录得房率', candidate.usableRate],
      ['当时挂牌价', `${candidate.askingPrice / 10000} 万元`]
    ];
    factRows.forEach(([label, value]) => {
      const row = createElement('div');
      row.append(createElement('dt', '', label), createElement('dd', '', value));
      facts.append(row);
    });

    const breakdown = createElement('div', 'candidate-breakdown');
    Object.entries(candidate.scores).forEach(([id, score]) => {
      const part = createElement('span', id === 'special' && score < 0 ? 'score-negative' : '');
      part.append(
        createElement('small', '', scoreLabels[id]),
        createElement('strong', '', formatScorePart(id, score))
      );
      breakdown.append(part);
    });

    const calculation = Object.values(candidate.scores)
      .map((score, scoreIndex) => {
        if (scoreIndex === 0) return String(score);
        return score < 0 ? ` − ${Math.abs(score)}` : ` + ${score}`;
      })
      .join('');

    const decision = createElement('div', `candidate-decision${candidate.selected ? ' decision-positive' : ''}`);
    decision.append(
      createElement('strong', '', candidate.selected ? '选择与验证' : '未选择原因'),
      createElement('p', '', candidate.decisionReason)
    );

    card.append(
      heading,
      facts,
      createElement('p', 'breakdown-title', '当时评分分项'),
      breakdown,
      createElement('p', 'score-calculation', `${calculation} = ${scoreCandidate(candidate)}`),
      createElement('p', 'candidate-school', candidate.school),
      createElement('p', 'candidate-note', candidate.note),
      decision
    );
    root.append(card);
  });
};

const setupTabs = () => {
  const tabs = [...document.querySelectorAll('[role="tab"][data-tab]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  const availableTabs = new Set(tabs.map(tab => tab.dataset.tab));

  const activate = name => {
    const activeName = resolveTabName(name, availableTabs);
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === activeName;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.id !== `${activeName}-panel`;
    });
  };

  const tabFromHash = () => window.location.hash.slice(1);
  const initialTab = resolveTabName(tabFromHash(), availableTabs);
  if (initialTab !== tabFromHash()) {
    window.history.replaceState(null, '', `#${initialTab}`);
  }
  activate(initialTab);

  window.addEventListener('hashchange', () => activate(tabFromHash()));
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const offset = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = tabs[(index + offset + tabs.length) % tabs.length];
      window.location.hash = nextTab.dataset.tab;
      nextTab.focus();
    });
  });
};

const renderAnalysis = () => {
  const root = document.querySelector('[data-analysis]');
  const hard = getBucket(summary.spaceBuckets, 'hard');
  const contract = getBucket(summary.responsibilityBuckets, 'contract');
  const outside = getBucket(summary.responsibilityBuckets, 'contract-outside');
  const doors = summary.sourceGroups.find(group => group.id === 'doors');
  const smart = summary.sourceGroups.find(group => group.id === 'smart');
  const appliances = summary.sourceGroups.find(group => group.id === 'appliances');
  const contractCoverage = formatPercent(contract.total, hard.total);

  const observations = [
    {
      title: '真实硬装不能只看 19 万合同价',
      text: `硬装实际为 ${formatCurrency(hard.total)}。合同主体只覆盖其中 ${contractCoverage}，门窗、卫浴、灯具和基础增补形成了 ${formatCurrency(outside.total)} 的合同外投入。`
    },
    {
      title: '门窗是合同之外最重的一笔',
      text: `门窗共 ${formatCurrency(doors.total)}，占完整预算 ${formatPercent(doors.total, summary.grandTotal)}；其中约 52㎡封窗主体折合 ${formatCurrency(roundUnitCost(90000, windowArea))}/㎡。多层玻璃配置更重视隔音、保温和长期居住体验。`
    },
    {
      title: '家具克制，家电智能投入适中',
      text: `家电与智能合计 ${formatCurrency(appliances.total + smart.total)}，软装家具 ${formatCurrency(getBucket(summary.spaceBuckets, 'soft').total)}。整体更像“先把房子本身做好”，没有让可替换设备挤占硬装预算。`
    },
    {
      title: '待购项目维持延后更合适',
      text: `${summary.laterCount} 项合计 ${formatCurrency(summary.laterTotal)}，其中 ${formatCurrency(9500)} 仍保留在家具软装分类。冰箱和小家电可以等促销，定制项适合入住后确认习惯和尺寸再下单。`
    }
  ];

  observations.forEach((observation, index) => {
    const item = createElement('article', 'analysis-item');
    item.append(
      createElement('span', 'analysis-number', String(index + 1).padStart(2, '0')),
      createElement('h3', '', observation.title),
      createElement('p', '', observation.text)
    );
    root.append(item);
  });
};

const statusLabel = entry => {
  if (entry.status === 'later') return '待购';
  if (entry.status === 'reserve') return '预留';
  if (entry.responsibility === 'contract') return '合同内';
  if (entry.responsibility === 'contract-outside') return '合同外';
  return '';
};

const renderExpenseItem = entry => {
  const row = createElement('li', 'expense-item');
  const copy = createElement('div', 'expense-copy');
  const title = createElement('div', 'expense-title');
  title.append(createElement('h4', '', entry.name));
  const label = statusLabel(entry);
  if (label) title.append(createElement('span', `status status-${entry.status}`, label));
  copy.append(title);

  if (entry.extras.length) {
    const components = [`基础 ${formatCurrency(entry.base)}`]
      .concat(entry.extras.map(extra => `${extra.label} ${formatCurrency(extra.amount)}`));
    copy.append(createElement('p', 'expense-components', components.join(' ＋ ')));
  }
  if (entry.note) copy.append(createElement('p', 'expense-note', entry.note));

  row.append(copy, createElement('strong', 'expense-total', formatCurrency(itemTotal(entry))));
  return row;
};

const renderGroups = () => {
  const root = document.querySelector('[data-expense-groups]');
  const totals = new Map(summary.sourceGroups.map(group => [group.id, group]));

  expenseGroups.forEach(group => {
    const computed = totals.get(group.id);
    const details = createElement('details', 'expense-group');
    const summaryRow = createElement('summary', 'expense-group-summary');
    const heading = createElement('span', 'group-heading');
    heading.append(
      createElement('strong', '', group.name),
      createElement('small', '', `${computed.count} 项 · ${group.description}`)
    );
    const total = createElement('span', 'group-total');
    total.append(
      createElement('strong', '', formatCurrency(computed.total)),
      createElement('small', '', formatPercent(computed.total, summary.grandTotal))
    );
    const toggle = createElement('span', 'group-toggle');
    toggle.setAttribute('aria-hidden', 'true');
    summaryRow.append(heading, total, toggle);

    const list = createElement('ol', 'expense-list');
    group.items.forEach(entry => list.append(renderExpenseItem(entry)));
    details.append(summaryRow, list);
    root.append(details);
  });
};

renderSummary();
renderPropertyContext();
renderOverallBudget();
renderMortgage();
renderReferenceMetrics();
renderAllocation();
renderAnalysis();
renderGroups();
renderScreeningStages();
renderPreferenceDimensions();
renderHistoricalScoreRules();
renderCandidates();
setupTabs();
