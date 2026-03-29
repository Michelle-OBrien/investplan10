"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getHistory, SavedPlan } from "@/lib/history";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M€`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K€`;
  return `${value}€`;
}

const riskColors: Record<string, string> = {
  conservative: "text-accent-blue",
  moderate: "text-accent-purple",
  aggressive: "text-accent-orange",
};

interface StatRowProps {
  label: string;
  a: string;
  b: string;
  aGood?: boolean;
  bGood?: boolean;
}

function StatRow({ label, a, b, aGood, bGood }: StatRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-card-border last:border-0 text-sm">
      <span className="text-muted text-xs">{label}</span>
      <span className={`text-center font-medium ${aGood ? "text-accent-green" : ""}`}>{a}</span>
      <span className={`text-center font-medium ${bGood ? "text-accent-green" : ""}`}>{b}</span>
    </div>
  );
}

export default function PlanCompare() {
  const [history, setHistory] = useState<SavedPlan[]>([]);
  const [idA, setIdA] = useState<string>("");
  const [idB, setIdB] = useState<string>("");

  useEffect(() => {
    const h = getHistory();
    setHistory(h);
    if (h.length >= 2) {
      setIdA(h[0].id);
      setIdB(h[1].id);
    }
  }, []);

  const planA = history.find((p) => p.id === idA);
  const planB = history.find((p) => p.id === idB);

  // Merge projections for combined chart
  const chartData =
    planA && planB
      ? planA.plan.projections.map((row, i) => ({
          year: row.year,
          "Plan A": row.totalValue,
          "Plan B": planB.plan.projections[i]?.totalValue ?? 0,
        }))
      : [];

  if (history.length < 2) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="font-semibold mb-1">Not enough plans to compare</p>
        <p className="text-sm text-muted">
          Generate at least 2 plans to use the comparison view.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4">
        {([["Plan A", idA, setIdA, "#3b82f6"], ["Plan B", idB, setIdB, "#00d4aa"]] as const).map(
          ([label, value, setter, color]) => (
            <div key={label}>
              <p className="text-xs font-semibold mb-1.5" style={{ color }}>
                {label}
              </p>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent-green cursor-pointer"
              >
                {history.map((p) => (
                  <option key={p.id} value={p.id}>
                    {fmt(p.input.budget)} · {p.input.riskTolerance} · +{p.plan.totalReturn}% · {p.date}
                  </option>
                ))}
              </select>
            </div>
          )
        )}
      </div>

      {planA && planB && (
        <>
          {/* Combined chart */}
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <h3 className="text-sm font-bold mb-4">10-Year Projection</h3>
            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cmpA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cmpB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="year" stroke="#888" tickFormatter={(y) => `Y${y}`} fontSize={11} />
                  <YAxis stroke="#888" tickFormatter={formatCurrency} fontSize={11} width={55} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#141414", border: "1px solid #2a2a2a", borderRadius: "8px", fontSize: "13px" }}
                    formatter={(v) => [formatCurrency(Number(v))]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Area type="monotone" dataKey="Plan A" stroke="#3b82f6" fill="url(#cmpA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Plan B" stroke="#00d4aa" fill="url(#cmpB)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats comparison */}
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <span />
              <span className="text-center text-xs font-bold text-accent-blue">Plan A</span>
              <span className="text-center text-xs font-bold text-accent-green">Plan B</span>
            </div>
            <StatRow
              label="Initial Budget"
              a={fmt(planA.input.budget)}
              b={fmt(planB.input.budget)}
            />
            <StatRow
              label="Monthly"
              a={fmt(planA.input.monthlyContribution)}
              b={fmt(planB.input.monthlyContribution)}
            />
            <StatRow
              label="Risk"
              a={planA.input.riskTolerance}
              b={planB.input.riskTolerance}
            />
            <StatRow
              label="Total Invested"
              a={fmt(planA.plan.totalInvested)}
              b={fmt(planB.plan.totalInvested)}
            />
            <StatRow
              label="Projected Value"
              a={fmt(planA.plan.projectedValue)}
              b={fmt(planB.plan.projectedValue)}
              aGood={planA.plan.projectedValue >= planB.plan.projectedValue}
              bGood={planB.plan.projectedValue > planA.plan.projectedValue}
            />
            <StatRow
              label="Return"
              a={`+${planA.plan.totalReturn}%`}
              b={`+${planB.plan.totalReturn}%`}
              aGood={planA.plan.totalReturn >= planB.plan.totalReturn}
              bGood={planB.plan.totalReturn > planA.plan.totalReturn}
            />
            <StatRow
              label="Stocks / Crypto / Forex"
              a={`${planA.input.allocationStocks}/${planA.input.allocationCrypto}/${planA.input.allocationForex}`}
              b={`${planB.input.allocationStocks}/${planB.input.allocationCrypto}/${planB.input.allocationForex}`}
            />
          </div>
        </>
      )}
    </div>
  );
}
