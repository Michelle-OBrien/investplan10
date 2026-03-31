"use client";

import { useState } from "react";
import Link from "next/link";
import { SavedPlan, getHistory, clearHistory } from "@/lib/history";

interface Props {
  onRestore: (saved: SavedPlan) => void;
}

const riskColors = {
  conservative: "text-accent-blue",
  moderate: "text-accent-purple",
  aggressive: "text-accent-orange",
};

function formatMoney(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PlanHistory({ onRestore }: Props) {
  const [history, setHistory] = useState<SavedPlan[]>(getHistory());

  const refresh = () => setHistory(getHistory());

  const handleClear = () => {
    clearHistory();
    refresh();
  };

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold">
          Plan History {history.length > 0 ? `(${history.length})` : ""}
        </h2>
        {history.length > 0 ? (
          <button
            onClick={handleClear}
            className="text-xs text-muted hover:text-accent-red transition cursor-pointer"
            title="Clear all history"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-muted mb-4">No investment plan created yet.</p>
          <Link
            href="/tool"
            className="bg-accent-green text-background px-5 py-2 rounded-lg text-sm font-semibold hover:bg-accent-green/90 transition"
          >
            Start planning now
          </Link>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {history.map((saved) => (
            <div key={saved.id} className="relative flex-shrink-0 group">
              <button
                onClick={() => onRestore(saved)}
                className="flex items-center gap-2 px-3 py-2 bg-card-border rounded-lg hover:bg-foreground/5 transition cursor-pointer text-sm min-w-max"
                title={`Restore plan: ${formatMoney(saved.input.budget)} budget, ${saved.input.riskTolerance} risk, +${saved.plan.totalReturn}% return`}
              >
                <span className="font-bold">{formatMoney(saved.input.budget)}</span>
                <span className={`text-xs capitalize ${riskColors[saved.input.riskTolerance]}`}>
                  {saved.input.riskTolerance}
                </span>
              </button>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <div className="font-semibold">{saved.date}</div>
                <div>Budget: {formatMoney(saved.input.budget)}</div>
                <div>Monthly: {formatMoney(saved.input.monthlyContribution)}</div>
                <div>Return: +{saved.plan.totalReturn}%</div>
                <div>Risk: {saved.input.riskTolerance}</div>
                {saved.plan.averageRiskScore && (
                  <div>Avg Risk Score: {saved.plan.averageRiskScore}%</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
