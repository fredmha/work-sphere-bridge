import type { RoiScenarioInputs } from '@/lib/roi/calculateRoi';

export const roiPresets = {
  conservative: {
    dailyDials: 24,
    connectRate: 10,
    discoveryRate: 12,
    placementRate: 10,
    averagePlacementFee: 10000,
  },
  expected: {
    dailyDials: 32,
    connectRate: 12,
    discoveryRate: 18,
    placementRate: 15,
    averagePlacementFee: 12000,
  },
  aggressive: {
    dailyDials: 38,
    connectRate: 15,
    discoveryRate: 24,
    placementRate: 18,
    averagePlacementFee: 15000,
  },
} as const satisfies Record<string, RoiScenarioInputs>;

export type RoiPresetId = keyof typeof roiPresets;

export const defaultRoiPresetId: RoiPresetId = 'expected';
