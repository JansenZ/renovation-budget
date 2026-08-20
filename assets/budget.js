export const itemTotal = item =>
  item.base + (item.extras ?? []).reduce((sum, extra) => sum + extra.amount, 0);

export const flattenItems = groups => groups.flatMap(group =>
  group.items.map(item => ({ ...item, groupId: group.id, groupName: group.name }))
);

export const groupTotals = groups => Object.fromEntries(
  groups.map(group => [
    group.id,
    group.items.reduce((sum, item) => sum + itemTotal(item), 0)
  ])
);

const sumItems = items => items.reduce((sum, item) => sum + itemTotal(item), 0);

const bucketDefinitions = {
  space: [
    { id: 'hard', name: '硬装', description: '固定施工、门窗、主材和卫浴灯具' },
    { id: 'soft', name: '软装家具', description: '家具、窗帘、装饰和入住用品' },
    { id: 'tech', name: '家电智能', description: '家电、网络与智能家居' },
    { id: 'later', name: '入住后待购', description: '可推迟到入住后或购物节购买' }
  ],
  responsibility: [
    { id: 'contract', name: '装修公司合同内', description: '19 万元硬装合同主体' },
    { id: 'contract-outside', name: '合同外可纳入项', description: '完整整装中可约定由装修公司承担' },
    { id: 'owner', name: '业主独立采购', description: '家电、智能设备、家具和生活用品' }
  ]
};

const buildBuckets = (items, field, definitions, grandTotal) => definitions.map(definition => {
  const bucketItems = items.filter(item => item[field] === definition.id);
  const total = sumItems(bucketItems);
  return {
    ...definition,
    total,
    count: bucketItems.length,
    percent: grandTotal === 0 ? 0 : (total / grandTotal) * 100
  };
});

export const formatCurrency = value => `¥${new Intl.NumberFormat('zh-CN').format(value)}`;

export const formatPercent = (value, total) =>
  total === 0 ? '0%' : `${((value / total) * 100).toFixed(1)}%`;

export const roundUnitCost = (value, area) =>
  area > 0 ? Math.round(value / area) : 0;

export const buildOverallBudget = ({
  purchasePrice,
  agencyRate,
  deedTaxRate,
  renovationBudget
}) => {
  const agencyFee = Math.round(purchasePrice * agencyRate);
  const deedTax = Math.round(purchasePrice * deedTaxRate);
  const acquisitionTotal = purchasePrice + agencyFee + deedTax;
  return {
    purchasePrice,
    agencyFee,
    deedTax,
    acquisitionTotal,
    renovationBudget,
    totalBudget: acquisitionTotal + renovationBudget
  };
};

export const buildMortgageSummary = ({
  principal,
  annualRate,
  years,
  baseBudget = 0
}) => {
  const months = years * 12;
  const monthlyRate = annualRate / 12;
  const growth = (1 + monthlyRate) ** months;
  const monthlyPayment = Math.round(principal * monthlyRate * growth / (growth - 1));
  const totalRepayment = Math.round(principal * monthlyRate * growth / (growth - 1) * months);
  const totalInterest = totalRepayment - principal;

  return {
    principal,
    annualRate,
    years,
    months,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    totalWithInterest: baseBudget + totalInterest
  };
};

export const buildBudgetSummary = groups => {
  const items = flattenItems(groups);
  const grandTotal = sumItems(items);
  const laterItems = items.filter(item => item.status === 'later');
  const laterTotal = sumItems(laterItems);
  const reserveTotal = sumItems(items.filter(item => item.status === 'reserve'));
  const currentTotal = grandTotal - laterTotal;

  return {
    grandTotal,
    currentTotal,
    laterTotal,
    laterCount: laterItems.length,
    reserveTotal,
    itemCount: items.length,
    sourceGroups: groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      count: group.items.length,
      total: sumItems(group.items)
    })),
    spaceBuckets: buildBuckets(items, 'space', bucketDefinitions.space, grandTotal),
    responsibilityBuckets: buildBuckets(
      items,
      'responsibility',
      bucketDefinitions.responsibility,
      grandTotal
    ),
    largestItems: [...items]
      .sort((a, b) => itemTotal(b) - itemTotal(a))
      .slice(0, 5)
      .map(item => ({ ...item, total: itemTotal(item) }))
  };
};
