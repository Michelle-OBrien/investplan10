"use client";

import { YearProjection } from "@/lib/types";

interface Props {
  projections: YearProjection[];
  monthlyContribution: number;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M€`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K€`;
  return `${Math.round(n)}€`;
}

interface Milestone {
  year: number;
  icon: string;
  title: string;
  description: string;
  value: number;
  color: string;
}

export default function MilestonesTimeline({ projections, monthlyContribution }: Props) {
  const milestones: Milestone[] = [];

  // First year
  if (projections.length > 0) {
    milestones.push({
      year: 1,
      icon: "🚀",
      title: "Journey Begins",
      description: `First year returns: ${formatCurrency(projections[0].totalValue - projections[0].contributions)}`,
      value: projections[0].totalValue,
      color: "border-accent-blue",
    });
  }

  // Find when portfolio doubles initial investment
  const initialInvestment = projections[0]?.contributions || 0;
  const doubleIdx = projections.findIndex((p) => p.totalValue >= initialInvestment * 2);
  if (doubleIdx > 0) {
    milestones.push({
      year: projections[doubleIdx].year,
      icon: "💎",
      title: "Portfolio Doubled",
      description: `Your investments crossed ${formatCurrency(initialInvestment * 2)}`,
      value: projections[doubleIdx].totalValue,
      color: "border-accent-purple",
    });
  }

  // Midpoint
  if (projections.length >= 5) {
    const mid = projections[4];
    const midGain = mid.totalValue - mid.contributions;
    milestones.push({
      year: 5,
      icon: "⚡",
      title: "Halfway Mark",
      description: `Gains so far: ${formatCurrency(midGain)} (${Math.round((midGain / mid.contributions) * 100)}% return)`,
      value: mid.totalValue,
      color: "border-accent-orange",
    });
  }

  // When passive income exceeds monthly contribution
  for (let i = 1; i < projections.length; i++) {
    const yearlyGain = projections[i].totalValue - projections[i - 1].totalValue - monthlyContribution * 12;
    const monthlyPassive = yearlyGain / 12;
    if (monthlyPassive >= monthlyContribution && monthlyContribution > 0) {
      milestones.push({
        year: projections[i].year,
        icon: "🔄",
        title: "Money Makes Money",
        description: `Monthly gains (${formatCurrency(monthlyPassive)}) exceed your contribution`,
        value: projections[i].totalValue,
        color: "border-accent-green",
      });
      break;
    }
  }

  // Final year
  const last = projections[projections.length - 1];
  if (last) {
    const totalReturn = Math.round(((last.totalValue - last.contributions) / last.contributions) * 100);
    milestones.push({
      year: 10,
      icon: "🏆",
      title: "Goal Reached",
      description: `Final portfolio: ${formatCurrency(last.totalValue)} (+${totalReturn}% total return)`,
      value: last.totalValue,
      color: "border-accent-green",
    });
  }

  // Sort and deduplicate by year
  const unique = milestones
    .sort((a, b) => a.year - b.year)
    .filter((m, i, arr) => i === 0 || m.year !== arr[i - 1].year);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-6 bottom-6 w-px bg-card-border" />

      <div className="space-y-6">
        {unique.map((m, i) => (
          <div
            key={m.year + m.title}
            className="flex gap-4 items-start animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Dot */}
            <div
              className={`relative z-10 w-10 h-10 rounded-full bg-card border-2 ${m.color} flex items-center justify-center text-lg flex-shrink-0`}
            >
              {m.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted">Year {m.year}</span>
                <span className="text-xs text-accent-green font-semibold">
                  {formatCurrency(m.value)}
                </span>
              </div>
              <p className="font-semibold text-sm">{m.title}</p>
              <p className="text-xs text-muted mt-0.5">{m.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
