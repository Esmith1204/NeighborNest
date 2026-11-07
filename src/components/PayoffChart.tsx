import { TrendingDown } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BalancePoint } from "../lib/finance";
import { usd, usdK } from "../lib/format";
import { Card, SectionTitle } from "./ui";

export function PayoffChart({ series, yearsShaved }: { series: BalancePoint[]; yearsShaved: number }) {
  // One point per year keeps the chart light; the calculator still runs monthly.
  const data = series
    .filter((p) => p.month % 12 === 0)
    .map((p) => ({ year: p.month / 12, baseline: p.baseline, accelerated: p.accelerated }));

  return (
    <Card>
      <SectionTitle
        icon={<TrendingDown className="h-4 w-4 text-slate-500" aria-hidden />}
        aside={<span className="text-xs text-slate-500">{yearsShaved} years sooner</span>}
      >
        Mortgage payoff
      </SectionTitle>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#e2d4c3" vertical={false} />
            <XAxis
              dataKey="year"
              ticks={[0, 5, 10, 15, 20, 25]}
              tick={{ fontSize: 12, fill: "#6b5a4d" }}
              tickLine={false}
              label={{ value: "Years from today", position: "insideBottom", offset: -2, fontSize: 11, fill: "#6b5a4d" }}
              height={36}
            />
            <YAxis tickFormatter={usdK} tick={{ fontSize: 12, fill: "#6b5a4d" }} tickLine={false} axisLine={false} width={52} />
            <Tooltip
              formatter={(v) => usd(Number(v))}
              labelFormatter={(y) => `Year ${y}`}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="baseline" name="Without ADU" stroke="#a8978a" strokeWidth={2} dot={false} />
            <Line
              type="monotone"
              dataKey="accelerated"
              name="With ADU rent paydown"
              stroke="#7a5236"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
