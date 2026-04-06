import { KeyboardEvent, useEffect, useMemo, useState } from 'react';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  displayFormatter?: (value: number) => string;
  onChange: (value: number) => void;
}

const numberFormatter = new Intl.NumberFormat('en-GB');

function snapToStep(value: number, min: number, step: number) {
  return min + Math.round((value - min) / step) * step;
}

function formatValue(
  value: number,
  prefix?: string,
  suffix?: string,
  formatter?: (value: number) => string,
) {
  if (formatter) return formatter(value);

  return `${prefix ?? ''}${numberFormatter.format(value)}${suffix ?? ''}`;
}

export default function InputSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  prefix,
  description,
  displayFormatter,
  onChange,
}: InputSliderProps) {
  const [draftValue, setDraftValue] = useState(String(value));

  useEffect(() => {
    setDraftValue(String(value));
  }, [value]);

  const filledPercentage = useMemo(() => {
    if (max === min) return 100;

    return ((value - min) / (max - min)) * 100;
  }, [max, min, value]);

  function commitDraft(nextDraft: string) {
    if (!nextDraft.trim()) {
      setDraftValue(String(value));
      return;
    }

    const parsedValue = Number(nextDraft);

    if (!Number.isFinite(parsedValue)) {
      setDraftValue(String(value));
      return;
    }

    const boundedValue = Math.min(max, Math.max(min, parsedValue));
    const nextValue = snapToStep(boundedValue, min, step);

    onChange(nextValue);
    setDraftValue(String(nextValue));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }

    if (event.key === 'Escape') {
      setDraftValue(String(value));
      event.currentTarget.blur();
    }
  }

  return (
    <div className="roi-input-row">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-900">{label}</p>
          {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
        </div>
        <div className="flex min-w-[7.5rem] items-center justify-end gap-2 rounded-[0.95rem] border border-[rgba(26,56,43,0.1)] bg-white px-3 py-1.5 shadow-[0_10px_20px_rgba(18,34,27,0.04)]">
          {prefix ? <span className="text-sm font-semibold text-primary">{prefix}</span> : null}
          <input
            aria-label={label}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full border-0 bg-transparent p-0 text-right text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            value={draftValue}
            onBlur={() => commitDraft(draftValue)}
            onChange={(event) => {
              const sanitizedValue = event.target.value.replace(/[^\d]/g, '');
              setDraftValue(sanitizedValue);
            }}
            onKeyDown={handleKeyDown}
          />
          {suffix ? <span className="text-sm font-semibold text-primary">{suffix}</span> : null}
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between gap-4 text-[11px] font-medium text-slate-500">
          <span>{formatValue(min, prefix, suffix, displayFormatter)}</span>
          <span className="text-sm font-semibold text-primary">{formatValue(value, prefix, suffix, displayFormatter)}</span>
          <span>{formatValue(max, prefix, suffix, displayFormatter)}</span>
        </div>
        <input
          type="range"
          className="roi-range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ backgroundSize: `${filledPercentage}% 100%` }}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
