"use client";

import { InvestmentPlan } from "@/lib/types";

interface Props {
  plan: InvestmentPlan;
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function StatsCards({ plan }: Props) {
  const profit = plan.projectedValue - plan.totalInvested;

  const stats = [
    {
      label: "Total Invested",
      value: formatMoney(plan.totalInvested),
      color: "text-foreground",
      sub: "over 10 years",
    },
    {
      label: "Projected Value",
      value: formatMoney(plan.projectedValue),
      color: "text-accent-green",
      sub: "at year 10",
    },
    {
      label: "Estimated Profit",
      value: formatMoney(profit),
      color: profit >= 0 ? "text-accent-green" : "text-accent-red",
      sub: `${plan.totalReturn >= 0 ? "+" : ""}${plan.totalReturn}% return`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card border border-card-border rounded-xl p-3 sm:p-4 text-center"
        >
          <p className="text-xs text-muted uppercase tracking-wider mb-1">{s.label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-muted mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
