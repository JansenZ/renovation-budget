export const priceScore = (totalCost, anchor = 4500000) =>
  Math.round(((anchor - totalCost) / 100000) * 10) / 10;

export const scoreCandidate = candidate =>
  Math.round(Object.values(candidate.scores).reduce((sum, score) => sum + score, 0) * 10) / 10;

export const sortCandidatesByScore = candidates => candidates
  .map((candidate, sourceIndex) => ({ candidate, sourceIndex }))
  .sort((left, right) => {
    const scoreDifference = scoreCandidate(right.candidate) - scoreCandidate(left.candidate);
    return scoreDifference || left.sourceIndex - right.sourceIndex;
  })
  .map(entry => entry.candidate);
