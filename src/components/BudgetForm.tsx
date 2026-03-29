"use client";

import { useState } from "react";
import { UserInput } from "@/lib/types";

interface Props {
  onSubmit: (input: UserInput) => void;
  loading: boolean;
}

export default function BudgetForm({ onSubmit, loading }: Props) {
  const [budget, setBudget] = useState(5000);
  const [monthly, setMonthly] = useState(300);
  const [risk, setRisk] = useState<UserInput["riskTolerance"]>("moderate");
  const [stocks, setStocks] = useState(50);
  const [crypto, setCrypto] = useState(30);
  const [forex, setForex] = useState(20);

  const total = stocks + crypto + forex;
  const isValid = total === 100 && budget > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      budget,
      monthlyContribution: monthly,
      riskTolerance: risk,
      allocationStocks: stocks,
      allocationCrypto: crypto,
      allocationForex: forex,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Initial Budget (€)
        </label>
        <input
          type="number"
          min={100}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-xl font-bold text-accent-green focus:outline-none focus:border-accent-green transition"
        />
      </div>

      {/* Monthly contribution */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Monthly Contribution (€)
        </label>
        <input
          type="number"
          min={0}
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-lg font-semibold text-foreground focus:outline-none focus:border-accent-blue transition"
        />
      </div>

      {/* Risk tolerance */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Risk Tolerance
        </label>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {(["conservative", "moderate", "aggressive"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRisk(r)}
              className={`py-2 px-1.5 sm:px-3 rounded-lg border text-xs sm:text-sm font-medium capitalize transition ${
                risk === r
                  ? r === "conservative"
                    ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                    : r === "moderate"
                    ? "border-accent-purple bg-accent-purple/10 text-accent-purple"
                    : "border-accent-orange bg-accent-orange/10 text-accent-orange"
                  : "border-card-border text-muted hover:border-foreground/30"
              }`}
            >
              {r === "conservative" ? "Conservative" : r === "moderate" ? "Moderate" : "Aggressive"}
            </button>
          ))}
        </div>
      </div>

      {/* Allocation sliders */}
      <div>
        <label className="block text-sm font-medium text-muted mb-3">
          Asset Allocation{" "}
          <span className={total === 100 ? "text-accent-green" : "text-accent-red"}>
            ({total}%)
          </span>
        </label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-accent-blue">Stocks</span>
              <span className="font-bold">{stocks}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={stocks}
              onChange={(e) => setStocks(Number(e.target.value))}
              className="w-full accent-accent-blue"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-accent-purple">Crypto</span>
              <span className="font-bold">{crypto}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={crypto}
              onChange={(e) => setCrypto(Number(e.target.value))}
              className="w-full accent-accent-purple"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-accent-orange">Forex</span>
              <span className="font-bold">{forex}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={forex}
              onChange={(e) => setForex(Number(e.target.value))}
              className="w-full accent-accent-orange"
            />
          </div>
        </div>
        {total !== 100 && (
          <p className="text-accent-red text-xs mt-2">
            Allocations must sum to 100% (currently {total}%)
          </p>
        )}
      </div>

      {/* Allocation visual bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-card-border">
        <div className="bg-accent-blue transition-all" style={{ width: `${stocks}%` }} />
        <div className="bg-accent-purple transition-all" style={{ width: `${crypto}%` }} />
        <div className="bg-accent-orange transition-all" style={{ width: `${forex}%` }} />
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className={`w-full py-4 rounded-xl text-lg font-bold transition ${
          isValid && !loading
            ? "bg-accent-green text-background hover:brightness-110 glow-green cursor-pointer"
            : "bg-card-border text-muted cursor-not-allowed"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating Plan with AI...
          </span>
        ) : (
          "Generate My 10-Year Plan"
        )}
      </button>
    </form>
  );
}
