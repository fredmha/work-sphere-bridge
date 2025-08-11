export type CompositeWeights = { ai: number; task: number; interview: number };

export function computeCompositeScore(
  scores: { ai?: number | null; task?: number | null; interview?: number | null },
  weights: CompositeWeights = { ai: 0.3, task: 0.4, interview: 0.3 }
): number {
  const ai = clamp(scores.ai ?? 0, 0, 10);
  const task = clamp(scores.task ?? 0, 0, 10);
  const interview = clamp(scores.interview ?? 0, 0, 10);

  const total = ai * weights.ai + task * weights.task + interview * weights.interview;
  return round1(total);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
