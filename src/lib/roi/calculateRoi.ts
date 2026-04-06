export interface RoiScenarioInputs {
  dailyDials: number;
  connectRate: number;
  discoveryRate: number;
  placementRate: number;
  averagePlacementFee: number;
}

export interface RoiResults {
  monthlyDials: number;
  monthlyConnects: number;
  monthlyDiscoveries: number;
  monthlyPlacements: number;
  monthlyRevenue: number;
  annualDials: number;
  annualConnects: number;
  annualDiscoveries: number;
  annualPlacements: number;
  annualRevenue: number;
}

export const ROI_BASE_RECRUITERS = 1;
export const ROI_BASE_WORKING_DAYS_PER_MONTH = 20;
export const ROI_BASE_MONTHS_PER_YEAR = 12;
export const ROI_MONTHLY_LEAD_CAP = 750;
export const ROI_MAX_DAILY_DIALS = Math.ceil(ROI_MONTHLY_LEAD_CAP / ROI_BASE_WORKING_DAYS_PER_MONTH);

export function calculateRoi({
  dailyDials,
  connectRate,
  discoveryRate,
  placementRate,
  averagePlacementFee,
}: RoiScenarioInputs): RoiResults {
  const requestedMonthlyDials = ROI_BASE_RECRUITERS * dailyDials * ROI_BASE_WORKING_DAYS_PER_MONTH;
  const monthlyDials = Math.min(ROI_MONTHLY_LEAD_CAP, requestedMonthlyDials);
  const monthlyConnects = monthlyDials * (connectRate / 100);
  const monthlyDiscoveries = monthlyConnects * (discoveryRate / 100);
  const monthlyPlacements = monthlyDiscoveries * (placementRate / 100);
  const monthlyRevenue = monthlyPlacements * averagePlacementFee;

  const annualDials = monthlyDials * ROI_BASE_MONTHS_PER_YEAR;
  const annualConnects = monthlyConnects * ROI_BASE_MONTHS_PER_YEAR;
  const annualDiscoveries = monthlyDiscoveries * ROI_BASE_MONTHS_PER_YEAR;
  const annualPlacements = monthlyPlacements * ROI_BASE_MONTHS_PER_YEAR;
  const annualRevenue = monthlyRevenue * ROI_BASE_MONTHS_PER_YEAR;

  return {
    monthlyDials,
    monthlyConnects,
    monthlyDiscoveries,
    monthlyPlacements,
    monthlyRevenue,
    annualDials,
    annualConnects,
    annualDiscoveries,
    annualPlacements,
    annualRevenue,
  };
}
