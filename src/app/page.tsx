"use client";

import { useState } from "react";
import Link from "next/link";
import BudgetForm from "@/components/BudgetForm";
import ProjectionChart from "@/components/ProjectionChart";
import AssetList from "@/components/AssetList";
import StatsCards from "@/components/StatsCards";
import PlanHistory from "@/components/PlanHistory";
import UserMenu from "@/components/UserMenu";
import ThemeToggle from "@/components/ThemeToggle";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import LocaleToggle from "@/components/LocaleToggle";
import { useI18n } from "@/lib/i18n/context";
import { UserInput, InvestmentPlan } from "@/lib/types";
import { savePlan, SavedPlan } from "@/lib/history";

export default function Home() {
  const { t } = useI18n();
  const [plan, setPlan] = useState<InvestmentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [lastInput, setLastInput] = useState<UserInput | null>(null);

  const handleRestore = (saved: SavedPlan) => {
    setPlan(saved.plan);
    setError(null);
  };

  const handleSubmit = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setLastInput(input);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate plan");
      }

      const data: InvestmentPlan = await res.json();
      setPlan(data);
      savePlan(input, data);
      setHistoryKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-card-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="text-accent-green">Invest</span>Plan10
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              {t("tagline")}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-foreground border border-card-border rounded-lg px-3 py-1.5 transition hover:border-foreground/30"
            >
              Dashboard
            </Link>
            <Link
              href="/compare"
              className="hidden sm:block text-xs text-muted hover:text-foreground border border-card-border rounded-lg px-3 py-1.5 transition hover:border-foreground/30"
            >
              Compare
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              {t("poweredBy")}
            </div>
            <LocaleToggle />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-4 no-print">
            <div className="bg-card border border-card-border rounded-2xl p-6 sticky top-8">
              <h2 className="text-lg font-bold mb-1">{t("yourBudget")}</h2>
              <p className="text-xs text-muted mb-6">
                {t("formSubtitle")}
              </p>
              <BudgetForm onSubmit={handleSubmit} loading={loading} />
            </div>
            <PlanHistory key={historyKey} onRestore={handleRestore} />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Empty state */}
            {!plan && !loading && !error && (
              <div className="bg-card border border-card-border rounded-2xl p-8 sm:p-12 text-center">
                <div className="text-5xl sm:text-6xl mb-4">💰</div>
                <h2 className="text-xl font-bold mb-2">
                  {t("readyTitle")}
                </h2>
                <p className="text-muted text-sm max-w-md mx-auto">
                  {t("readyDesc")}
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-accent-red/10 border border-accent-red/30 rounded-2xl p-6 sm:p-8 text-center animate-fade-in-up">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-accent-red font-semibold mb-1">{error}</p>
                <p className="text-xs text-muted mb-5">
                  {error.toLowerCase().includes("api key")
                    ? "Make sure your GEMINI_API_KEY is set in .env.local"
                    : error.toLowerCase().includes("network") || error.toLowerCase().includes("fetch")
                    ? "Check your internet connection and try again"
                    : "Gemini may be temporarily unavailable — try again in a moment"}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {lastInput && (
                    <button
                      onClick={() => handleSubmit(lastInput)}
                      disabled={loading}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold bg-accent-green text-background hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => setError(null)}
                    className="px-5 py-2.5 rounded-xl text-sm border border-card-border text-muted hover:text-foreground hover:border-foreground/30 transition cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && <LoadingSkeleton />}

            {/* Results */}
            {plan && (
              <>
                {/* Action buttons */}
                <div className="flex justify-end gap-2 animate-fade-in-up no-print">
                  <button
                    onClick={() => window.print()}
                    className="text-sm text-muted hover:text-accent-blue border border-card-border rounded-lg px-4 py-2 transition cursor-pointer hover:border-accent-blue/30"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => { setPlan(null); setError(null); }}
                    className="text-sm text-muted hover:text-foreground border border-card-border rounded-lg px-4 py-2 transition cursor-pointer hover:border-foreground/30"
                  >
                    {t("newPlan")}
                  </button>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-2">
                      {t("investmentStrategy")}
                    </h2>
                    <p className="text-sm text-muted">{plan.summary}</p>
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
                  <StatsCards plan={plan} />
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">
                      {t("growthProjection")}
                    </h2>
                    <ProjectionChart projections={plan.projections} />
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
                  <div className="bg-card border border-accent-green/30 rounded-2xl p-6 glow-green">
                    <h2 className="text-lg font-bold mb-2 text-accent-green">
                      {t("compoundStrategy")}
                    </h2>
                    <p className="text-sm text-muted">{plan.compoundDetails}</p>
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">
                      {t("recommendedAssets")}
                    </h2>
                    <AssetList assets={plan.assets} />
                  </div>
                </div>

                <p className="text-xs text-muted/50 text-center py-4 animate-fade-in-up" style={{ animationDelay: "0.55s" }}>
                  {t("disclaimer")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-card-border mt-16 no-print">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted">
            <span className="font-bold text-foreground">
              <span className="text-accent-green">Invest</span>Plan10
            </span>
            {" "}&mdash; Master IMT&E, Universit&eacute; Panth&eacute;on-Sorbonne
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <a
              href="https://github.com/Michelle-OBrien/investplan10"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition"
            >
              GitHub
            </a>
            <span>Next.js + Tailwind + Gemini</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
