"use client";

import { SavedPlan } from "@/lib/history";

interface Props {
  plans: SavedPlan[];
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M€`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K€`;
  return `${value.toFixed(0)}€`;
}

export default function DashboardStats({ plans }: Props) {
  if (plans.length === 0) return null;

  const returns = plans.map((p) => p.plan.totalReturn);
  const avgReturn = Math.round(returns.reduce((a, b) => a + b, 0) / returns.length);
  const bestReturn = Math.max(...returns);
  const worstReturn = Math.min(...returns);

  const bestPlan = plans.find((p) => p.plan.totalReturn === bestReturn)!;
  const worstPlan = plans.find((p) => p.plan.totalReturn === worstReturn)!;

  const totalInvestedAvg = Math.round(
    plans.reduce((a, p) => a + p.plan.totalInvested, 0) / plans.length
  );
  const projectedValueAvg = Math.round(
    plans.reduce((a, p) => a + p.plan.projectedValue, 0) / plans.length
  );

  const cards = [
    {
      label: "Plans Generated",
      value: plans.length.toString(),
      sub: "saved locally",
      color: "text-accent-blue",
    },
    {
      label: "Avg. Return",
      value: `+${avgReturn}%`,
      sub: "across all plans",
      color: "text-accent-green",
    },
    {
      label: "Best Return",
      value: `+${bestReturn}%`,
      sub: bestPlan.input.riskTolerance,
      color: "text-accent-purple",
    },
    {
      label: "Worst Return",
      value: `+${worstReturn}%`,
      sub: worstPlan.input.riskTolerance,
      color: "text-accent-orange",
    },
    {
      label: "Avg. Amount Invested",
      value: formatCurrency(totalInvestedAvg),
      sub: "over 10 years",
      color: "text-accent-blue",
    },
    {
      label: "Avg. Projected Value",
      value: formatCurrency(projectedValueAvg),
      sub: "at year 10",
      color: "text-accent-green",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-card border border-card-border rounded-2xl p-4 sm:p-5"
          >
            <p className="text-xs text-muted mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-muted mt-1 capitalize">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
