"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AssetRecommendation } from "@/lib/types";

interface Props {
  assets: AssetRecommendation[];
  stocksPct: number;
  cryptoPct: number;
  forexPct: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  stock: "#3b82f6",
  crypto: "#a855f7",
  forex: "#f97316",
};

const CATEGORY_LABELS: Record<string, string> = {
  stock: "Stocks",
  crypto: "Crypto",
  forex: "Forex",
};

export default function AllocationPieChart({ assets, stocksPct, cryptoPct, forexPct }: Props) {
  // Outer ring: category-level allocation
  const categoryData = [
    { name: "Stocks", value: stocksPct, color: CATEGORY_COLORS.stock },
    { name: "Crypto", value: cryptoPct, color: CATEGORY_COLORS.crypto },
    { name: "Forex", value: forexPct, color: CATEGORY_COLORS.forex },
  ].filter((d) => d.value > 0);

  // Inner ring: individual asset allocation (weighted by category %)
  const assetData = assets.map((a) => {
    const catPct =
      a.category === "stock" ? stocksPct : a.category === "crypto" ? cryptoPct : forexPct;
    return {
      name: a.ticker,
      fullName: a.name,
      value: Math.round((a.allocation / 100) * catPct * 10) / 10,
      color: CATEGORY_COLORS[a.category],
      category: CATEGORY_LABELS[a.category],
    };
  });

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; fullName?: string; value: number; category?: string } }> }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-card-border rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="font-bold text-foreground">{d.fullName || d.name}</p>
        {d.category && <p className="text-muted">{d.category}</p>}
        <p className="text-accent-green font-semibold">{d.value}%</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Inner ring: categories */}
            <Pie
              data={categoryData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="58%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {categoryData.map((d, i) => (
                <Cell key={i} fill={d.color} opacity={0.9} />
              ))}
            </Pie>
            {/* Outer ring: individual assets */}
            <Pie
              data={assetData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="85%"
              paddingAngle={1}
              strokeWidth={0}
            >
              {assetData.map((d, i) => (
                <Cell key={i} fill={d.color} opacity={0.5 + (i % 3) * 0.15} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-3 min-w-0">
        {categoryData.map((cat) => {
          const catAssets = assetData.filter(
            (a) => a.category === cat.name
          );
          return (
            <div key={cat.name}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                />
                <span className="text-sm font-semibold">{cat.name}</span>
                <span className="text-xs text-muted ml-auto">{cat.value}%</span>
              </div>
              <div className="ml-5 space-y-0.5">
                {catAssets.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-xs text-muted">
                    <span className="truncate">
                      <span className="font-medium text-foreground/80">{a.name}</span>
                      {a.fullName && <span className="ml-1 hidden sm:inline">{a.fullName}</span>}
                    </span>
                    <span className="ml-2 flex-shrink-0">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
