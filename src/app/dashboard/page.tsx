"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, deletePlan, SavedPlan } from "@/lib/history";
import DashboardStats from "@/components/DashboardStats";
import DashboardPlanCard from "@/components/DashboardPlanCard";

export default function DashboardPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlans(getHistory());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    deletePlan(id);
    setPlans(getHistory());
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-card-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="text-accent-green">Invest</span>Plan10
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">Dashboard — My Plans</p>
          </div>
          <Link
            href="/"
            className="text-sm border border-card-border rounded-lg px-4 py-2 text-muted hover:text-foreground hover:border-foreground/30 transition"
          >
            ← New plan
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 space-y-8">
        {plans.length === 0 ? (
          <div className="bg-card border border-card-border rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-bold mb-2">No plans yet</h2>
            <p className="text-muted text-sm mb-6 max-w-md mx-auto">
              Generate your first investment plan and it will appear here for review and comparison.
            </p>
            <Link
              href="/"
              className="inline-block bg-accent-green text-background font-bold px-6 py-3 rounded-xl hover:brightness-110 transition"
            >
              Generate a plan
            </Link>
          </div>
        ) : (
          <>
            <DashboardStats plans={plans} />

            <div>
              <h2 className="text-lg font-bold mb-4">All Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((p) => (
                  <DashboardPlanCard key={p.id} plan={p} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="border-t border-card-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-muted text-center">
          InvestPlan10 — Master IMT&amp;E, Universit&eacute; Panth&eacute;on-Sorbonne
        </div>
      </footer>
    </main>
  );
}
