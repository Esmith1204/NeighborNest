import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { INPUT_RANGES, RENT_STEP } from "../lib/finance";
import { usd } from "../lib/format";
import { MARKET_RENT_REFERENCE, type RentBand } from "../lib/rent";
import type { ScenarioRequest } from "../lib/types";
import { AssumptionTag, Card, SectionTitle } from "./ui";

interface Props {
  inputs: ScenarioRequest;
  band: RentBand;
  onChange: (patch: Partial<ScenarioRequest>) => void;
}

export function Sliders({ inputs, band, onChange }: Props) {
  const r = INPUT_RANGES;
  const belowMarket = MARKET_RENT_REFERENCE.monthly - inputs.monthlyRent;

  return (
    <Card>
      <SectionTitle icon={<SlidersHorizontal className="h-4 w-4 text-slate-500" aria-hidden />}>
        Co-financing deal
      </SectionTitle>
      <div className="space-y-4">
        <Slider
          id="buildCost"
          label="ADU build cost"
          value={inputs.buildCost}
          {...r.buildCost}
          display={usd(inputs.buildCost)}
          onChange={(v) => onChange({ buildCost: v })}
          hint={<AssumptionTag />}
        />
        <Slider
          id="partnerUpfront"
          label="Partner upfront cash"
          value={inputs.partnerUpfront}
          {...r.partnerUpfront}
          display={usd(inputs.partnerUpfront)}
          onChange={(v) => onChange({ partnerUpfront: v })}
        />
        <Slider
          id="monthlyRent"
          label="Monthly program rent"
          value={inputs.monthlyRent}
          min={band.min}
          max={band.max}
          step={RENT_STEP}
          display={usd(inputs.monthlyRent)}
          onChange={(v) => onChange({ monthlyRent: v })}
          hint={
            <span className="flex flex-wrap items-center gap-1.5">
              <AssumptionTag />
              <span>
                {usd(belowMarket)} below the{" "}
                <a
                  href={MARKET_RENT_REFERENCE.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-slate-300 hover:text-slate-700"
                >
                  HUD FY2026 studio rent of {usd(MARKET_RENT_REFERENCE.monthly)}
                </a>
              </span>
            </span>
          }
        />
        <Slider
          id="rentToPaydownPct"
          label="Net rent toward mortgage"
          value={inputs.rentToPaydownPct}
          {...r.rentToPaydownPct}
          display={`${inputs.rentToPaydownPct}%`}
          onChange={(v) => onChange({ rentToPaydownPct: v })}
        />
        <Slider
          id="partnerRentSubsidy"
          label="Partner rent subsidy"
          value={inputs.partnerRentSubsidy}
          {...r.partnerRentSubsidy}
          display={`${usd(inputs.partnerRentSubsidy)}/mo`}
          onChange={(v) => onChange({ partnerRentSubsidy: v })}
        />
      </div>
    </Card>
  );
}

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  hint?: ReactNode;
  onChange: (value: number) => void;
}

function Slider({ id, label, value, min, max, step, display, hint, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-semibold text-slate-900 tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-emerald-600"
      />
      {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
