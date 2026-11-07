import { Calculator } from "lucide-react";
import { AFFORDABLE_RENT_SHARE, type BurdenBand, type Scenario } from "../lib/finance";
import { pct, usd } from "../lib/format";

const BAND_STYLES: Record<BurdenBand, string> = {
  green: "border-emerald-300 bg-emerald-50 text-emerald-800",
  yellow: "border-amber-300 bg-amber-50 text-amber-800",
  red: "border-rose-300 bg-rose-50 text-rose-800",
};

export function MetricCards({ s }: { s: Scenario }) {
  const burdenPct = s.karlRentBurden * 100;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric label="Gap closed by partner" value={pct(s.gapClosedPct)} sub={`ADU loan ${usd(s.aduLoan)}`} />
        <Metric label="Years shaved off mortgage" value={`${s.yearsShaved}`} sub={`${usd(s.extraPaydown)}/mo extra`} />
        <Metric
          label="Homeowner's net monthly income"
          value={usd(s.lindaNetMonthly)}
          sub={`after ${usd(s.aduLoanPayment)}/mo ADU loan`}
          negative={s.lindaNetMonthly < 0}
        />
        <Metric label="Left for the homeowner" value={`${usd(s.leftForBudget)}/mo`} sub="after loan and extra paydown" />
        <div className={`col-span-2 rounded-xl border p-3 ${BAND_STYLES[s.karlBurdenBand]}`}>
          <p className="text-xs font-medium opacity-80">Renter's rent</p>
          <p className="text-2xl font-bold tabular-nums">
            {usd(s.karlRent)}
            <span className="text-base font-semibold">/mo</span>
          </p>
          <p className="text-xs">
            {pct(burdenPct)} of their {usd(s.karlMonthlyIncome)} income · target {pct(AFFORDABLE_RENT_SHARE * 100)} or less
          </p>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <Calculator className="h-3.5 w-3.5" aria-hidden />
        Numbers come from the calculator, not the AI.
      </p>
    </div>
  );
}

function Metric({ label, value, sub, negative }: { label: string; value: string; sub?: string; negative?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${negative ? "text-rose-700" : "text-slate-900"}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
