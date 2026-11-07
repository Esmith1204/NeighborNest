import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Check, ChevronDown, Lightbulb } from "lucide-react";
import { AskPanel } from "../components/AskPanel";
import { AssumptionsPanel } from "../components/AssumptionsPanel";
import { FeasibilityCard } from "../components/FeasibilityCard";
import { MetricCards } from "../components/MetricCards";
import { PayoffChart } from "../components/PayoffChart";
import { Sliders } from "../components/Sliders";
import { StoryStrip } from "../components/StoryStrip";
import { TermSheet } from "../components/TermSheet";
import { SyntheticChip } from "../components/ds/Badge";
import { Container, SectionLabel } from "../components/ds/Layout";
import parcelData from "../data/parcels.json";
import { calculateFeasibility, type Parcel } from "../lib/feasibility";
import { computeScenario } from "../lib/finance";
import { PRESETS, type Preset } from "../lib/presets";
import { rentBandFor } from "../lib/rent";
import type { ScenarioRequest } from "../lib/types";

const parcels = parcelData as Parcel[];

export default function Dashboard() {
  const [params] = useSearchParams();
  const [inputs, setInputs] = useState<ScenarioRequest>(() => {
    const id = params.get("example") ?? params.get("preset");
    return (PRESETS.find((p) => p.id === id) ?? PRESETS[0]).inputs;
  });

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
    <div className="pb-16 print:pb-0">
      <Container className="py-10 md:py-14 print:hidden">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Dashboard</SectionLabel>
            <h1 className="mt-4 text-headline font-medium">Co-financing dashboard</h1>
            <p className="mt-3 max-w-2xl text-[17px] text-mute">
              Pick a parcel, set the deal, and see whether it works for the homeowner, the renter and the partner.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SyntheticChip />
            <SituationExample active={activePreset} onPick={(p) => setInputs(p.inputs)} />
          </div>
        </div>
      </Container>

      <Container className="space-y-6">
        <section aria-label="Parcel and deal" className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] print:hidden">
          <div className="space-y-6">
            <FeasibilityCard
              parcels={parcels}
              parcel={parcel}
              feasibility={feasibility}
              band={band}
              onParcelChange={changeParcel}
            />
            <div id="sources" className="scroll-mt-24">
              <AssumptionsPanel />
            </div>
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
      </Container>
    </div>
  );
}

/** One small button that loads a fictional example. Personas stay out of the page header. */
function SituationExample({ active, onPick }: { active?: Preset; onPick: (p: Preset) => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstItem.current?.focus();
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="situation-menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 bg-white px-5 text-[15px] font-medium transition-colors hover:border-ink"
      >
        <Lightbulb className="h-4 w-4" aria-hidden />
        Situation example{active ? `: ${active.label}` : ""}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div
          id="situation-menu"
          role="menu"
          aria-label="Situation examples"
          className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-ink/10 bg-white p-2 shadow-lg"
        >
          {PRESETS.map((p, i) => {
            const on = active?.id === p.id;
            return (
              <button
                key={p.id}
                ref={i === 0 ? firstItem : undefined}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                onClick={() => {
                  onPick(p);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-sand ${on ? "bg-sand" : ""}`}
              >
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                  {on && <Check className="h-4 w-4" />}
                </span>
                <span>
                  <span className="block font-medium">{p.label}</span>
                  <span className="block text-[14px] text-mute">{p.summary}</span>
                </span>
              </button>
            );
          })}
          <p className="px-3 pt-2 pb-1 text-[13px] text-mute">Fictional composites. Change any slider to make it your own.</p>
        </div>
      )}
    </div>
  );
}
