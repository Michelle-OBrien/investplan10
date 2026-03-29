"use client";

import { useState } from "react";
import BudgetForm from "@/components/BudgetForm";
import ProjectionChart from "@/components/ProjectionChart";
import AssetList from "@/components/AssetList";
import StatsCards from "@/components/StatsCards";
import { UserInput, InvestmentPlan } from "@/lib/types";

export default function Home() {
  const [plan, setPlan] = useState<InvestmentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    setPlan(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-card-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-accent-green">Invest</span>Plan10
            </h1>
            <p className="text-sm text-muted mt-1">
              AI-powered 10-year investment strategy
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Powered by Gemini
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-card-border rounded-2xl p-6 sticky top-8">
              <h2 className="text-lg font-bold mb-1">Your Budget</h2>
              <p className="text-xs text-muted mb-6">
                Set your parameters and let AI build your plan
              </p>
              <BudgetForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Empty state */}
            {!plan && !loading && !error && (
              <div className="bg-card border border-card-border rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h2 className="text-xl font-bold mb-2">
                  Ready to plan your future?
                </h2>
                <p className="text-muted text-sm max-w-md mx-auto">
                  Enter your budget, choose your risk level and allocation, then
                  hit generate. Our AI will create a personalized 10-year
                  investment plan with specific assets to buy.
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-accent-red/10 border border-accent-red/30 rounded-2xl p-6 text-center">
                <p className="text-accent-red font-medium">{error}</p>
                <p className="text-xs text-muted mt-2">
                  Make sure your GEMINI_API_KEY is configured in .env.local
                </p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="bg-card border border-card-border rounded-2xl p-12 text-center">
                <div className="flex justify-center mb-4">
                  <svg
                    className="animate-spin h-10 w-10 text-accent-green"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold mb-1">
                  Gemini is analyzing markets...
                </h2>
                <p className="text-sm text-muted">
                  Building your personalized investment strategy
                </p>
              </div>
            )}

            {/* Results */}
            {plan && (
              <>
                {/* Reset button */}
                <div className="flex justify-end animate-fade-in-up">
                  <button
                    onClick={() => { setPlan(null); setError(null); }}
                    className="text-sm text-muted hover:text-foreground border border-card-border rounded-lg px-4 py-2 transition cursor-pointer hover:border-foreground/30"
                  >
                    New plan
                  </button>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-2">
                      Investment Strategy
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
                      10-Year Growth Projection
                    </h2>
                    <ProjectionChart projections={plan.projections} />
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
                  <div className="bg-card border border-accent-green/30 rounded-2xl p-6 glow-green">
                    <h2 className="text-lg font-bold mb-2 text-accent-green">
                      Compound Interest Strategy
                    </h2>
                    <p className="text-sm text-muted">{plan.compoundDetails}</p>
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">
                      Recommended Assets
                    </h2>
                    <AssetList assets={plan.assets} />
                  </div>
                </div>

                <p className="text-xs text-muted/50 text-center py-4 animate-fade-in-up" style={{ animationDelay: "0.55s" }}>
                  Disclaimer: This is a simulation for educational purposes only.
                  Past performance does not guarantee future results. Always
                  consult a financial advisor before investing.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-card-border mt-16">
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
