"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { YearProjection } from "@/lib/types";

interface Props {
  projections: YearProjection[];
}

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M€`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K€`;
  return `${value}€`;
}

export default function ContributionsChart({ projections }: Props) {
  const initial = projections[0]?.totalValue || 0;

  // Build data: initial capital, contributions (monthly added), gains (profit on top)
  const data = projections
    .filter((p) => p.year > 0)
    .map((p) => {
      const gains = Math.max(0, p.totalValue - initial - p.contributions);
      return {
        year: `Y${p.year}`,
        Initial: initial,
        Contributions: p.contributions,
        Gains: gains,
        total: p.totalValue,
      };
    });

  // Final year stats for the summary line
  const last = data[data.length - 1];
  const gainsPct = last
    ? Math.round((last.Gains / (last.Initial + last.Contributions)) * 100)
    : 0;

  return (
    <div>
      {/* Summary pill */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-500 inline-block" />
          <span className="text-muted">Initial capital</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-accent-blue inline-block" />
          <span className="text-muted">Monthly contributions</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-accent-green inline-block" />
          <span className="text-muted">Investment gains</span>
        </span>
        {gainsPct > 0 && (
          <span className="ml-auto text-accent-green font-semibold">
            +{gainsPct}% return on invested capital
          </span>
        )}
      </div>

      <div className="w-full h-[260px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis dataKey="year" stroke="#888" fontSize={11} />
            <YAxis
              stroke="#888"
              tickFormatter={formatCurrency}
              fontSize={11}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#141414",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value, name) => [formatCurrency(Number(value)), name]}
              labelFormatter={(l) => `Year ${l.replace("Y", "")}`}
            />
            <Bar
              dataKey="Initial"
              stackId="a"
              fill="#6b7280"
              fillOpacity={0.85}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="Contributions"
              stackId="a"
              fill="#3b82f6"
              fillOpacity={0.85}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="Gains"
              stackId="a"
              fill="#00d4aa"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
