"use client";

import { useState, useEffect } from "react";
import { SavedPlan, getHistory, deletePlan, clearHistory } from "@/lib/history";

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
  const [history, setHistory] = useState<SavedPlan[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const refresh = () => setHistory(getHistory());

  const handleDelete = (id: string) => {
    deletePlan(id);
    refresh();
  };

  const handleClear = () => {
    clearHistory();
    refresh();
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 sm:p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">&#128203;</span>
          <h2 className="text-sm font-bold">
            Plan History{" "}
            <span className="text-muted font-normal">({history.length})</span>
          </h2>
        </div>
        <svg
          className={`w-4 h-4 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-4 space-y-2">
          {history.map((saved) => (
            <div
              key={saved.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-card-border hover:border-foreground/20 transition"
            >
              <button
                onClick={() => onRestore(saved)}
                className="flex-1 text-left cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold">
                    {formatMoney(saved.input.budget)}
                  </span>
                  <span className={`text-xs capitalize ${riskColors[saved.input.riskTolerance]}`}>
                    {saved.input.riskTolerance}
                  </span>
                  <span className="text-accent-green text-xs font-medium">
                    +{saved.plan.totalReturn}%
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5 truncate">
                  {saved.date} &middot; {formatMoney(saved.input.monthlyContribution)}/mo
                </p>
              </button>
              <button
                onClick={() => handleDelete(saved.id)}
                className="text-muted hover:text-accent-red transition text-xs cursor-pointer shrink-0"
                title="Delete"
              >
                &#10005;
              </button>
            </div>
          ))}

          <button
            onClick={handleClear}
            className="w-full text-xs text-muted hover:text-accent-red transition mt-2 py-2 cursor-pointer"
          >
            Clear all history
          </button>
        </div>
      )}
    </div>
  );
}
