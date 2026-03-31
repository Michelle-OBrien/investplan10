"use client";

import { AssetRecommendation } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  assets: AssetRecommendation[];
}

const categoryStyles = {
  stock: { color: "text-accent-blue", bg: "bg-accent-blue/10", border: "border-accent-blue/30", label: "Stocks" },
  crypto: { color: "text-accent-purple", bg: "bg-accent-purple/10", border: "border-accent-purple/30", label: "Crypto" },
  forex: { color: "text-accent-orange", bg: "bg-accent-orange/10", border: "border-accent-orange/30", label: "Forex" },
};

export default function AssetList({ assets }: Props) {
  const { t } = useI18n();
  const grouped = {
    stock: assets.filter((a) => a.category === "stock"),
    crypto: assets.filter((a) => a.category === "crypto"),
    forex: assets.filter((a) => a.category === "forex"),
  };

  return (
    <div className="space-y-6">
      {(["stock", "crypto", "forex"] as const).map((cat) => {
        const style = categoryStyles[cat];
        const items = grouped[cat];
        if (items.length === 0) return null;

        return (
          <div key={cat}>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${style.color}`}>
              {style.label}
            </h3>
            <div className="space-y-2">
              {items.map((asset, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border ${style.border} ${style.bg} transition hover:brightness-110`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${style.color}`}>
                        {asset.ticker}
                      </span>
                      <span className="text-xs text-muted truncate">
                        {asset.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted/70 mt-1 line-clamp-1">
                      {asset.reason}
                    </p>
                    {asset.riskScore != null && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] uppercase tracking-wider font-semibold rounded-full px-2 py-1 border border-opacity-50"
                        style={{
                          color: asset.riskScore >= 70 ? "#b91c1c" : asset.riskScore >= 40 ? "#b45309" : "#16a34a",
                          borderColor: asset.riskScore >= 70 ? "#fca5a5" : asset.riskScore >= 40 ? "#fcd34d" : "#86efac",
                          backgroundColor: asset.riskScore >= 70 ? "#fee2e2" : asset.riskScore >= 40 ? "#fef3c7" : "#dcfce7",
                        }}
                      >
                        {t("textRisk")} : {asset.riskScore}%
                      </span>
                    )}
                  </div>
                  <div className={`text-right ml-3 font-bold text-sm ${style.color}`}>
                    {asset.allocation}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
