import test from 'node:test';
import assert from 'node:assert/strict';
import { homeCandidates } from '../assets/data.js';

const dataModule = await import('../assets/data.js');
const decisionModule = await import('../assets/decision.js').catch(() => ({}));
const preferenceDimensions = dataModule.preferenceDimensions ?? [];
const screeningStages = dataModule.screeningStages ?? [];

test('the reusable preference model has a complete 100 percent weighting', () => {
  assert.equal(preferenceDimensions.length, 10);
  assert.equal(preferenceDimensions.reduce((sum, dimension) => sum + dimension.weight, 0), 100);
  assert.deepEqual(preferenceDimensions.map(dimension => dimension.id), [
    'traffic',
    'layout',
    'usable',
    'totalCost',
    'education',
    'amenities',
    'community',
    'maintenance',
    'elevator',
    'parking'
  ]);
});

test('the recorded score can be reproduced from every visible component', () => {
  assert.equal(typeof decisionModule.scoreCandidate, 'function');
  const actual = Object.fromEntries(homeCandidates.map(candidate => [
    candidate.id,
    decisionModule.scoreCandidate(candidate)
  ]));
  assert.deepEqual(actual, {
    'hemao-24f': 58,
    'hanhe-21f': 63,
    'yihewan-9f': 59.5,
    'shuixie-3-1f': 60,
    'shuixie-5-3f': 63,
    'jiabao-9f': 61,
    'jiabao-selected-11f': 61.5
  });
});

test('candidate cards sort by score while preserving source order for ties', () => {
  assert.equal(typeof decisionModule.sortCandidatesByScore, 'function');
  assert.deepEqual(decisionModule.sortCandidatesByScore(homeCandidates).map(candidate => candidate.id), [
    'hanhe-21f',
    'shuixie-5-3f',
    'jiabao-selected-11f',
    'jiabao-9f',
    'shuixie-3-1f',
    'yihewan-9f',
    'hemao-24f'
  ]);
});

test('price scoring uses the household budget anchor consistently', () => {
  assert.equal(typeof decisionModule.priceScore, 'function');
  assert.equal(decisionModule.priceScore(3300000), 12);
  assert.equal(decisionModule.priceScore(3200000), 13);
  assert.equal(decisionModule.priceScore(2400000), 21);
  assert.equal(decisionModule.priceScore(3380000), 11.2);
});

test('three screening rounds precede the shortlist and every candidate has a decision reason', () => {
  assert.equal(screeningStages.length, 3);
  assert.equal(homeCandidates.every(candidate => candidate.decisionReason?.length > 0), true);
  assert.match(homeCandidates.find(candidate => candidate.id === 'hanhe-21f').decisionReason, /75%|家属/);
  assert.match(homeCandidates.find(candidate => candidate.id === 'shuixie-5-3f').decisionReason, /价格|南北不通透|楼层/);
  assert.match(homeCandidates.find(candidate => candidate.id === 'shuixie-3-1f').decisionReason, /295|315/);
  assert.match(homeCandidates.find(candidate => candidate.id === 'jiabao-9f').decisionReason, /入户|花园/);
  assert.match(homeCandidates.find(candidate => candidate.id === 'jiabao-selected-11f').decisionReason, /12楼|系统窗|噪音/);
});
