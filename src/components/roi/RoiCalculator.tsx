import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import InputSlider from '@/components/roi/InputSlider';
import SummaryCard from '@/components/roi/SummaryCard';
import {
  calculateRoi,
  ROI_BASE_RECRUITERS,
  ROI_BASE_WORKING_DAYS_PER_MONTH,
  ROI_MAX_DAILY_DIALS,
  ROI_MONTHLY_LEAD_CAP,
  type RoiScenarioInputs,
} from '@/lib/roi/calculateRoi';
import { defaultRoiPresetId, roiPresets, type RoiPresetId } from '@/lib/roi/presets';

interface InputFieldConfig {
  key: keyof RoiScenarioInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  displayFormatter?: (value: number) => string;
}

const countFormatter = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const moneyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});
const decimalFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const currencyPrefix = '$';
const presetLabels: Record<RoiPresetId, string> = {
  conservative: 'Conservative',
  expected: 'Expected',
  aggressive: 'Aggressive',
};

const inputFields = [
  {
    key: 'dailyDials',
    label: 'Prospects dialed per day',
    min: 20,
    max: ROI_MAX_DAILY_DIALS,
    step: 1,
  },
  {
    key: 'connectRate',
    label: 'Connect rate',
    min: 5,
    max: 30,
    step: 1,
    suffix: '%',
  },
  {
    key: 'discoveryRate',
    label: 'Connect to discovery rate',
    min: 5,
    max: 50,
    step: 1,
    suffix: '%',
  },
  {
    key: 'placementRate',
    label: 'Discovery to placement rate',
    min: 5,
    max: 40,
    step: 1,
    suffix: '%',
  },
  {
    key: 'averagePlacementFee',
    label: 'Average placement fee',
    min: 2000,
    max: 50000,
    step: 500,
    prefix: currencyPrefix,
    displayFormatter: (value: number) => moneyFormatter.format(value),
  },
] as const satisfies readonly InputFieldConfig[];

const fieldConfigByKey = Object.fromEntries(inputFields.map((field) => [field.key, field])) as Record<
  keyof RoiScenarioInputs,
  InputFieldConfig
>;

const presetOrder = ['conservative', 'expected', 'aggressive'] as const satisfies readonly RoiPresetId[];

function roundToStep(value: number, min: number, step: number) {
  return min + Math.round((value - min) / step) * step;
}

function clampFieldValue(field: InputFieldConfig, value: number) {
  const boundedValue = Math.min(field.max, Math.max(field.min, value));

  return roundToStep(boundedValue, field.min, field.step);
}

function parseFieldValue(
  params: URLSearchParams,
  field: InputFieldConfig,
  aliases: readonly string[],
  fallbackValue: number,
) {
  const rawValue = aliases.map((alias) => params.get(alias)).find((value) => value !== null);

  if (!rawValue) return fallbackValue;

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) return fallbackValue;

  return clampFieldValue(field, numericValue);
}

function parseSearchParams(search: string) {
  const params = new URLSearchParams(search);

  return {
    values: {
      dailyDials: parseFieldValue(
        params,
        fieldConfigByKey.dailyDials,
        ['dials', 'dailyDials', 'dialsPerRecruiterPerDay'],
        roiPresets[defaultRoiPresetId].dailyDials,
      ),
      connectRate: parseFieldValue(params, fieldConfigByKey.connectRate, ['connectRate'], roiPresets[defaultRoiPresetId].connectRate),
      discoveryRate: parseFieldValue(
        params,
        fieldConfigByKey.discoveryRate,
        ['discoveryRate', 'bookingRate', 'meetingRate'],
        roiPresets[defaultRoiPresetId].discoveryRate,
      ),
      placementRate: parseFieldValue(
        params,
        fieldConfigByKey.placementRate,
        ['placementRate'],
        roiPresets[defaultRoiPresetId].placementRate,
      ),
      averagePlacementFee: parseFieldValue(
        params,
        fieldConfigByKey.averagePlacementFee,
        ['fee', 'averagePlacementFee'],
        roiPresets[defaultRoiPresetId].averagePlacementFee,
      ),
    } satisfies RoiScenarioInputs,
  };
}

function getMatchingPreset(values: RoiScenarioInputs) {
  return (
    presetOrder.find((presetId) =>
      inputFields.every((field) => roiPresets[presetId][field.key] === values[field.key]),
    ) ?? null
  );
}

function formatCount(value: number) {
  return countFormatter.format(Math.round(value));
}

function formatMoney(value: number) {
  return moneyFormatter.format(Math.round(value));
}

function formatDecimal(value: number) {
  return decimalFormatter.format(value);
}

export default function RoiCalculator() {
  const location = useLocation();
  const initialState = useMemo(() => parseSearchParams(location.search), [location.search]);
  const [values, setValues] = useState<RoiScenarioInputs>(initialState.values);

  useEffect(() => {
    const parsedState = parseSearchParams(location.search);
    setValues(parsedState.values);
  }, [location.search]);

  const activePreset = useMemo(() => getMatchingPreset(values), [values]);

  const results = useMemo(() => calculateRoi(values), [values]);

  const annualFunnelItems = [
    { label: 'Dials made', value: formatCount(results.annualDials) },
    { label: `Connects (${values.connectRate}%)`, value: formatCount(results.annualConnects) },
    { label: `Discoveries (${values.discoveryRate}%)`, value: formatCount(results.annualDiscoveries) },
    { label: `Placements won (${values.placementRate}%)`, value: formatCount(results.annualPlacements) },
  ];

  const impactItems = [
    { label: 'Discoveries per month', value: formatDecimal(results.monthlyDiscoveries), tone: 'text-slate-950' },
    { label: 'Placements per month', value: formatDecimal(results.monthlyPlacements), tone: 'text-slate-950' },
    { label: 'Monthly fee revenue', value: formatMoney(results.monthlyRevenue), tone: 'text-primary' },
    { label: 'Annual fee revenue', value: formatMoney(results.annualRevenue), tone: 'text-primary' },
  ];

  return (
    <div className="mx-auto grid max-w-[70rem] gap-4 xl:grid-cols-[minmax(0,0.98fr)_minmax(18rem,0.92fr)]">
      <div className="surface-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="meta-kicker">Inputs</p>
            <h2 className="mt-2 text-[1.85rem] font-semibold tracking-tight text-slate-950">Adjust the model live</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
              One recruiter base case. Move the sliders and the pipeline updates instantly.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[1.2rem] border border-[rgba(24,55,41,0.08)] bg-[rgba(247,248,245,0.92)] px-4 py-3 text-sm leading-6 text-slate-600">
          Base case: {ROI_BASE_RECRUITERS} recruiter, {ROI_BASE_WORKING_DAYS_PER_MONTH} working days per month, up to{' '}
          {formatCount(ROI_MONTHLY_LEAD_CAP)} leads supplied each month.
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {presetOrder.map((presetId) => {
            const isActive = presetId === activePreset;

            return (
              <button
                key={presetId}
                type="button"
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  isActive
                    ? 'border-[rgba(19,59,45,0.22)] bg-[rgba(228,241,233,0.92)] text-primary shadow-[0_12px_24px_rgba(18,34,27,0.05)]'
                    : 'border-[rgba(24,55,41,0.1)] bg-white/70 text-slate-600 hover:border-[rgba(19,59,45,0.2)] hover:text-slate-950'
                }`}
                onClick={() => setValues({ ...roiPresets[presetId] })}
              >
                {presetLabels[presetId]}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3">
          {inputFields.map((field) => (
            <InputSlider
              key={field.key}
              label={field.label}
              value={values[field.key]}
              min={field.min}
              max={field.max}
              step={field.step}
              suffix={field.suffix}
              prefix={field.prefix}
              description={field.description}
              displayFormatter={field.displayFormatter}
              onChange={(nextValue) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  [field.key]: nextValue,
                }))
              }
            />
          ))}
        </div>
      </div>

      <div className="grid gap-3 xl:sticky xl:top-24 xl:self-start">
        <SummaryCard title="What this means">
          <p className="text-[15px] leading-6 text-slate-700">
            If one recruiter makes{' '}
            <span className="font-semibold text-slate-950">{formatCount(values.dailyDials)} dials a day</span>, this
            model points to around{' '}
            <span className="font-semibold text-slate-950">{formatCount(results.annualDiscoveries)} discoveries a year</span>{' '}
            and roughly{' '}
            <span className="font-semibold text-slate-950">{formatCount(results.annualPlacements)} placements</span>.
          </p>
          <div className="mt-4 rounded-[1.35rem] bg-[linear-gradient(145deg,rgba(236,244,238,0.96),rgba(247,250,247,0.98))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Potential annual fee revenue</p>
            <p className="mt-2 text-[2.2rem] font-semibold tracking-tight text-slate-950">{formatMoney(results.annualRevenue)}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Based on one recruiter sustaining the assumptions on the left.</p>
          </div>
        </SummaryCard>

        <SummaryCard title="Annual Funnel">
          <div className="grid gap-2">
            {annualFunnelItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-[1rem] border border-[rgba(24,55,41,0.08)] bg-white/70 px-4 py-2.5"
              >
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className="text-sm font-semibold text-slate-950">{item.value}</span>
              </div>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Revenue Impact">
          <div className="grid gap-2">
            {impactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-[1rem] border border-[rgba(24,55,41,0.08)] bg-white/70 px-4 py-2.5"
              >
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={`text-sm font-semibold ${item.tone}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[1.15rem] border border-[rgba(25,101,74,0.12)] bg-[rgba(230,244,235,0.9)] px-4 py-3">
            <p className="text-sm font-semibold text-primary">
              The commercial upside is easier to understand when the activity assumptions are explicit.
            </p>
          </div>
        </SummaryCard>
      </div>
    </div>
  );
}
