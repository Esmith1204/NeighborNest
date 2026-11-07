import { MapPin } from "lucide-react";
import { FEASIBILITY_FOOTNOTE, type Feasibility, type Parcel } from "../lib/feasibility";
import { pct, sqft, usd } from "../lib/format";
import type { RentBand } from "../lib/rent";
import { AssumptionTag, Card, SectionTitle } from "./ui";

interface Props {
  parcels: Parcel[];
  parcel: Parcel;
  feasibility: Feasibility;
  band: RentBand;
  onParcelChange: (id: number) => void;
}

function tone(score: number) {
  if (score >= 75) return { ring: "border-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 50) return { ring: "border-amber-500", text: "text-amber-700", bg: "bg-amber-50" };
  return { ring: "border-rose-500", text: "text-rose-700", bg: "bg-rose-50" };
}

export function FeasibilityCard({ parcels, parcel, feasibility, band, onParcelChange }: Props) {
  const t = tone(feasibility.score);
  const { breakdown } = feasibility;
  const rows = [
    { name: "Yard space", detail: sqft(breakdown.yardSqFt), points: breakdown.yardPoints, max: 50 },
    { name: "Zoning", detail: parcel.zoning, points: breakdown.zoningPoints, max: 30 },
    { name: "Rent coverage", detail: `${usd(band.typical)}/mo typical`, points: breakdown.rentPoints, max: 20 },
  ];

  return (
    <Card>
      <SectionTitle icon={<MapPin className="h-4 w-4 text-slate-500" aria-hidden />}>Parcel</SectionTitle>
      <label htmlFor="parcel" className="sr-only">
        Choose a sample parcel
      </label>
      <select
        id="parcel"
        value={parcel.id}
        onChange={(e) => onParcelChange(Number(e.target.value))}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
      >
        {parcels.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>

      <div className={`mt-4 flex items-center gap-4 rounded-xl ${t.bg} p-4`}>
        <div
          className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4 ${t.ring} bg-white`}
          aria-label={`Feasibility score ${feasibility.score} out of 100`}
        >
          <span className={`text-3xl font-bold ${t.text}`}>{feasibility.score}</span>
          <span className="text-[10px] text-slate-500">/ 100</span>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">Feasibility</p>
          <p className={`text-lg leading-snug font-semibold ${t.text}`}>{feasibility.label}</p>
        </div>
      </div>

      <table className="mt-4 w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-slate-100 last:border-0">
              <td className="py-1.5 text-slate-600">{r.name}</td>
              <td className="py-1.5 text-slate-500">{r.detail}</td>
              <td className="py-1.5 text-right font-medium tabular-nums">
                {r.points}/{r.max}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <Stat label="Lot" value={sqft(parcel.lotSqFt)} />
        <Stat label="Existing home" value={sqft(parcel.existingHomeSqFt)} />
        <Stat label="Mortgage balance" value={usd(parcel.currentMortgageBalance)} />
        <Stat label="Mortgage rate" value={pct(parcel.currentInterestRate, 1)} />
        <Stat label="Area" value={`${parcel.city} · ${band.tierLabel}`} />
        <Stat label="Program rent band" value={`${usd(band.min)}–${usd(band.max)}`} tag />
      </dl>

      <p className="mt-4 text-xs text-slate-500">
        {FEASIBILITY_FOOTNOTE} Sample parcel: synthetic data, not a real address.
      </p>
    </Card>
  );
}

function Stat({ label, value, tag }: { label: string; value: string; tag?: boolean }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-slate-500">
        {label} {tag && <AssumptionTag />}
      </dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
