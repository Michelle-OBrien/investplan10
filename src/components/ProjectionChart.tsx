"use client";

import { useState } from "react";
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
import { YearProjection } from "@/lib/types";
import { adjustForInflation, DEFAULT_INFLATION } from "@/lib/inflation";

interface Props {
  projections: YearProjection[];
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M€`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K€`;
  return `${value}€`;
}

export default function ProjectionChart({ projections }: Props) {
  const [inflationAdj, setInflationAdj] = useState(false);

  const data = inflationAdj
    ? adjustForInflation(projections)
    : projections;

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-end gap-2 mb-3">
        <span className="text-xs text-muted">
          Inflation-adjusted ({(DEFAULT_INFLATION * 100).toFixed(0)}% p.a.)
        </span>
        <button
          onClick={() => setInflationAdj(!inflationAdj)}
          className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
            inflationAdj ? "bg-accent-green" : "bg-card-border"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              inflationAdj ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    <div className="w-full h-[280px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradStocks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCrypto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradForex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="year"
            stroke="#888"
            tickFormatter={(y) => `Y${y}`}
            fontSize={11}
          />
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
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              String(name).charAt(0).toUpperCase() + String(name).slice(1),
            ]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          />
          <Area
            type="monotone"
            dataKey="stocks"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#gradStocks)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="crypto"
            stackId="1"
            stroke="#a855f7"
            fill="url(#gradCrypto)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="forex"
            stackId="1"
            stroke="#f97316"
            fill="url(#gradForex)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}
