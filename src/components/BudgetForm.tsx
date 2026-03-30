"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { UserInput } from "@/lib/types";
import GoalSelector, { Goal } from "./GoalSelector";

const RiskQuiz = dynamic(() => import("./RiskQuiz"), { ssr: false });

interface Props {
  onSubmit: (input: UserInput) => void;
  loading: boolean;
}

const PRESETS = [
  { label: "Safe", stocks: 70, crypto: 10, forex: 20 },
  { label: "Balanced", stocks: 50, crypto: 30, forex: 20 },
  { label: "Growth", stocks: 30, crypto: 50, forex: 20 },
  { label: "Crypto-heavy", stocks: 20, crypto: 60, forex: 20 },
];

export default function BudgetForm({ onSubmit, loading }: Props) {
  const [budget, setBudget] = useState(5000);
  const [monthly, setMonthly] = useState(300);
  const [risk, setRisk] = useState<UserInput["riskTolerance"]>("moderate");
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | undefined>();
  const [alloc, setAlloc] = useState({ stocks: 50, crypto: 30, forex: 20 });

  const updateAlloc = (
    changed: keyof typeof alloc,
    value: number
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const remaining = 100 - clamped;
    const others = (["stocks", "crypto", "forex"] as const).filter((k) => k !== changed);
    const otherSum = alloc[others[0]] + alloc[others[1]];

    let newAlloc: typeof alloc;
    if (otherSum === 0) {
      // Split remaining equally between the other two
      newAlloc = {
        ...alloc,
        [changed]: clamped,
        [others[0]]: Math.round(remaining / 2),
        [others[1]]: remaining - Math.round(remaining / 2),
      };
    } else {
      // Distribute remaining proportionally
      const ratio0 = alloc[others[0]] / otherSum;
      const val0 = Math.round(remaining * ratio0);
      const val1 = remaining - val0;
      newAlloc = {
        ...alloc,
        [changed]: clamped,
        [others[0]]: val0,
        [others[1]]: val1,
      };
    }
    setAlloc(newAlloc);
  };

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setAlloc({ stocks: p.stocks, crypto: p.crypto, forex: p.forex });
  };

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal.id);
    setMonthly(goal.suggestedMonthly);
    setRisk(goal.suggestedRisk);
  };

  const { stocks, crypto, forex } = alloc;
  const total = stocks + crypto + forex; // Always 100
  const isValid = budget > 0;

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
      {/* Goal selector */}
      <GoalSelector onSelect={handleGoalSelect} selectedId={selectedGoal} />

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-muted mb-2">
          Initial Budget (€)
        </label>
        <input
          id="budget"
          type="number"
          min={100}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          aria-describedby="budget-desc"
          className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-xl font-bold text-accent-green focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/30 transition"
        />
        <span id="budget-desc" className="sr-only">Minimum 100 euros</span>
      </div>

      {/* Monthly contribution */}
      <div>
        <label htmlFor="monthly" className="block text-sm font-medium text-muted mb-2">
          Monthly Contribution (€)
        </label>
        <input
          id="monthly"
          type="number"
          min={0}
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-lg font-semibold text-foreground focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30 transition"
        />
      </div>

      {/* Risk Quiz modal */}
      {showQuiz && (
        <RiskQuiz
          onResult={(r) => { setRisk(r); setShowQuiz(false); }}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Risk tolerance */}
      <fieldset>
        <div className="flex items-center justify-between mb-2">
          <legend className="text-sm font-medium text-muted">
            Risk Tolerance
          </legend>
          <button
            type="button"
            onClick={() => setShowQuiz(true)}
            className="text-xs text-accent-green hover:underline cursor-pointer"
          >
            Not sure?
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2" role="group" aria-label="Risk tolerance selector">
          {(["conservative", "moderate", "aggressive"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRisk(r)}
              aria-pressed={risk === r}
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
      </fieldset>

      {/* Allocation sliders */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Asset Allocation{" "}
          <span className={total === 100 ? "text-accent-green" : "text-accent-red"}>
            ({total}%)
          </span>
        </label>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className={`text-xs px-2.5 py-1 rounded-md border transition ${
                stocks === p.stocks && crypto === p.crypto && forex === p.forex
                  ? "border-accent-green bg-accent-green/10 text-accent-green"
                  : "border-card-border text-muted hover:border-foreground/30"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="slider-stocks" className="text-accent-blue">Stocks</label>
              <span className="font-bold">{stocks}%</span>
            </div>
            <input
              id="slider-stocks"
              type="range"
              min={0}
              max={100}
              value={stocks}
              onChange={(e) => updateAlloc("stocks", Number(e.target.value))}
              aria-valuenow={stocks}
              aria-label={`Stocks allocation: ${stocks}%`}
              className="w-full accent-accent-blue"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="slider-crypto" className="text-accent-purple">Crypto</label>
              <span className="font-bold">{crypto}%</span>
            </div>
            <input
              id="slider-crypto"
              type="range"
              min={0}
              max={100}
              value={crypto}
              onChange={(e) => updateAlloc("crypto", Number(e.target.value))}
              aria-valuenow={crypto}
              aria-label={`Crypto allocation: ${crypto}%`}
              className="w-full accent-accent-purple"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="slider-forex" className="text-accent-orange">Forex</label>
              <span className="font-bold">{forex}%</span>
            </div>
            <input
              id="slider-forex"
              type="range"
              min={0}
              max={100}
              value={forex}
              onChange={(e) => updateAlloc("forex", Number(e.target.value))}
              aria-valuenow={forex}
              aria-label={`Forex allocation: ${forex}%`}
              className="w-full accent-accent-orange"
            />
          </div>
        </div>
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
