import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { AskPanel } from "../components/AskPanel";
import { AssumptionsPanel } from "../components/AssumptionsPanel";
import { FeasibilityCard } from "../components/FeasibilityCard";
import { MetricCards } from "../components/MetricCards";
import { PayoffChart } from "../components/PayoffChart";
import { Sliders } from "../components/Sliders";
import { StoryStrip } from "../components/StoryStrip";
import { TermSheet } from "../components/TermSheet";
import parcelData from "../data/parcels.json";
import { calculateFeasibility, type Parcel } from "../lib/feasibility";
import { computeScenario } from "../lib/finance";
import { PRESETS } from "../lib/presets";
import { rentBandFor } from "../lib/rent";
import type { ScenarioRequest } from "../lib/types";

const parcels = parcelData as Parcel[];

export default function Legacy() {
  const [params] = useSearchParams();
  const [inputs, setInputs] = useState<ScenarioRequest>(
    () => (PRESETS.find((p) => p.id === params.get("preset")) ?? PRESETS[0]).inputs,
  );

  const parcel = parcels.find((p) => p.id === inputs.parcelId) ?? parcels[0];
  const band = rentBandFor(parcel.city);
  const feasibility = useMemo(() => calculateFeasibility(parcel), [parcel]);
  const scenario = useMemo(() => computeScenario({ parcel, ...inputs }), [parcel, inputs]);
  const activePreset = PRESETS.find((p) => JSON.stringify(p.inputs) === JSON.stringify(inputs));

  const update = (patch: Partial<ScenarioRequest>) => setInputs((prev) => ({ ...prev, ...patch }));

  function changeParcel(id: number) {
    const next = parcels.find((p) => p.id === id);
    if (!next) return;
    const nb = rentBandFor(next.city);
    // Keep the rent inside the new area's band.
    update({ parcelId: id, monthlyRent: Math.min(nb.max, Math.max(nb.min, inputs.monthlyRent)) });
  }

  return (
    <div className="bg-slate-50 text-slate-900 print:bg-white">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-medium">Co-financing calculator (legacy view)</h1>
            <p className="text-sm text-slate-600">The original single-page calculator, kept while the new flow is built.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setInputs(p.inputs)}
                aria-pressed={activePreset?.id === p.id}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  activePreset?.id === p.id
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 print:hidden">
          <strong className="text-slate-800">Linda</strong> (fictional) has a big backyard and tuition bills, but a bank
          turned down her ADU loan. <strong className="text-slate-800">Karl</strong> (fictional) needs a stable home and an
          address. A <strong className="text-slate-800">community partner</strong> puts in upfront cash and a rent
          subsidy; Linda rents below market in return.
        </p>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] print:hidden">
          <div className="space-y-6">
            <FeasibilityCard
              parcels={parcels}
              parcel={parcel}
              feasibility={feasibility}
              band={band}
              onParcelChange={changeParcel}
            />
            <AssumptionsPanel />
          </div>
          <div className="space-y-6">
            <Sliders inputs={inputs} band={band} onChange={update} />
            <MetricCards s={scenario} />
            <PayoffChart series={scenario.balanceSeries} yearsShaved={scenario.yearsShaved} />
          </div>
        </section>

        <div className="print:hidden">
          <StoryStrip request={inputs} />
        </div>
        <TermSheet request={inputs} />
        <div className="print:hidden">
          <AskPanel request={inputs} score={feasibility.score} />
        </div>
      </main>

    </div>
  );
}
