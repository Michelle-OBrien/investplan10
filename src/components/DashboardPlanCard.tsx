"use client";

import Link from "next/link";
import { SavedPlan } from "@/lib/history";

interface Props {
  plan: SavedPlan;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M€`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K€`;
  return `${value.toFixed(0)}€`;
}

const RISK_COLORS: Record<string, string> = {
  conservative: "text-accent-blue border-accent-blue/30 bg-accent-blue/10",
  moderate: "text-accent-purple border-accent-purple/30 bg-accent-purple/10",
  aggressive: "text-accent-orange border-accent-orange/30 bg-accent-orange/10",
};

export default function DashboardPlanCard({ plan, onDelete }: Props) {
  const { input, plan: p, date, id } = plan;

  const shareParams = new URLSearchParams({
    b: String(input.budget),
    m: String(input.monthlyContribution),
    r: input.riskTolerance,
    s: String(input.allocationStocks),
    c: String(input.allocationCrypto),
    f: String(input.allocationForex),
  });

  return (
    <div className="bg-card border border-card-border rounded-2xl p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted">{date}</p>
          <p className="font-bold text-lg leading-tight">
            {formatCurrency(input.budget)}
            <span className="text-sm font-normal text-muted ml-1">initial</span>
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${
            RISK_COLORS[input.riskTolerance]
          }`}
        >
          {input.riskTolerance}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-muted">Monthly</p>
          <p className="text-sm font-semibold">{formatCurrency(input.monthlyContribution)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Value Y10</p>
          <p className="text-sm font-semibold text-accent-green">
            {formatCurrency(p.projectedValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Return</p>
          <p className="text-sm font-semibold text-accent-green">+{p.totalReturn}%</p>
        </div>
      </div>

      {/* Allocation bar */}
      <div className="h-2 rounded-full overflow-hidden flex bg-card-border">
        <div className="bg-accent-blue" style={{ width: `${input.allocationStocks}%` }} />
        <div className="bg-accent-purple" style={{ width: `${input.allocationCrypto}%` }} />
        <div className="bg-accent-orange" style={{ width: `${input.allocationForex}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span className="text-accent-blue">{input.allocationStocks}% stocks</span>
        <span className="text-accent-purple">{input.allocationCrypto}% crypto</span>
        <span className="text-accent-orange">{input.allocationForex}% forex</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Link
          href={`/?${shareParams.toString()}`}
          className="flex-1 text-center text-xs border border-card-border rounded-lg py-2 text-muted hover:text-foreground hover:border-foreground/30 transition"
        >
          Restore
        </Link>
        <button
          onClick={() => onDelete(id)}
          className="text-xs border border-card-border rounded-lg px-3 py-2 text-muted hover:text-accent-red hover:border-accent-red/30 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
