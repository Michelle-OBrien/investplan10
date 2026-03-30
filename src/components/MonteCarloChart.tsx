"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import { UserInput } from "@/lib/types";

interface Props {
  input: UserInput;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function runSimulation(input: UserInput, seed: number): number[] {
  const rand = seededRandom(seed);
  const avgReturn =
    input.riskTolerance === "conservative"
      ? 0.05
      : input.riskTolerance === "moderate"
      ? 0.08
      : 0.12;
  const volatility =
    input.riskTolerance === "conservative"
      ? 0.08
      : input.riskTolerance === "moderate"
      ? 0.15
      : 0.25;

  const values: number[] = [input.budget];
  let current = input.budget;

  for (let y = 1; y <= 10; y++) {
    // Box-Muller transform for normal distribution
    const u1 = rand();
    const u2 = rand();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const annualReturn = avgReturn + volatility * z;

    current = current * (1 + annualReturn) + input.monthlyContribution * 12;
    values.push(Math.max(0, Math.round(current)));
  }

  return values;
}

const NUM_SIMULATIONS = 200;

export default function MonteCarloChart({ input }: Props) {
  const { percentiles, simPaths } = useMemo(() => {
    const allSims: number[][] = [];
    for (let i = 0; i < NUM_SIMULATIONS; i++) {
      allSims.push(runSimulation(input, 1000 + i * 7));
    }

    // Calculate percentiles at each year
    const percentiles = [];
    for (let y = 0; y <= 10; y++) {
      const yearValues = allSims.map((s) => s[y]).sort((a, b) => a - b);
      percentiles.push({
        year: `Y${y}`,
        p5: yearValues[Math.floor(NUM_SIMULATIONS * 0.05)],
        p25: yearValues[Math.floor(NUM_SIMULATIONS * 0.25)],
        p50: yearValues[Math.floor(NUM_SIMULATIONS * 0.5)],
        p75: yearValues[Math.floor(NUM_SIMULATIONS * 0.75)],
        p95: yearValues[Math.floor(NUM_SIMULATIONS * 0.95)],
      });
    }

    // Sample 20 paths for spaghetti lines
    const step = Math.floor(NUM_SIMULATIONS / 20);
    const simPaths = Array.from({ length: 20 }, (_, i) => allSims[i * step]);

    return { percentiles, simPaths };
  }, [input]);

  const formatValue = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M€`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K€`;
    return `${v}€`;
  };

  const finalP50 = percentiles[percentiles.length - 1].p50;
  const finalP5 = percentiles[percentiles.length - 1].p5;
  const finalP95 = percentiles[percentiles.length - 1].p95;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;
    const d = percentiles.find((p) => p.year === label);
    if (!d) return null;
    return (
      <div className="bg-card border border-card-border rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="font-bold text-foreground mb-1">{label}</p>
        <p className="text-accent-green">Optimistic (95th): {formatValue(d.p95)}</p>
        <p className="text-accent-blue">Likely (75th): {formatValue(d.p75)}</p>
        <p className="text-foreground font-semibold">Median: {formatValue(d.p50)}</p>
        <p className="text-accent-orange">Cautious (25th): {formatValue(d.p25)}</p>
        <p className="text-accent-red">Worst case (5th): {formatValue(d.p5)}</p>
      </div>
    );
  };

  return (
    <div>
      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-muted">Worst 5%: </span>
          <span className="font-bold text-accent-red">{formatValue(finalP5)}</span>
        </div>
        <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-muted">Median: </span>
          <span className="font-bold text-accent-green">{formatValue(finalP50)}</span>
        </div>
        <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-muted">Best 5%: </span>
          <span className="font-bold text-accent-blue">{formatValue(finalP95)}</span>
        </div>
        <div className="bg-card border border-card-border rounded-lg px-3 py-1.5 text-xs">
          <span className="text-muted">{NUM_SIMULATIONS} simulations</span>
        </div>
      </div>

      <div className="w-full h-[280px] sm:h-[350px]" role="img" aria-label="Monte Carlo simulation showing range of possible outcomes">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={percentiles} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="mcBand90" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00d4aa" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="mcBand50" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={formatValue}
              tick={{ fill: "#888", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* 90% band (p5 to p95) */}
            <Area type="monotone" dataKey="p95" stroke="none" fill="url(#mcBand90)" />
            <Area type="monotone" dataKey="p5" stroke="none" fill="#0a0a0a" />

            {/* 50% band (p25 to p75) */}
            <Area type="monotone" dataKey="p75" stroke="none" fill="url(#mcBand50)" />
            <Area type="monotone" dataKey="p25" stroke="none" fill="#0a0a0a" />

            {/* Median line */}
            <Area
              type="monotone"
              dataKey="p50"
              stroke="#00d4aa"
              strokeWidth={2.5}
              fill="none"
              dot={{ r: 3, fill: "#00d4aa" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
