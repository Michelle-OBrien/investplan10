import Link from "next/link";
import PlanCompare from "@/components/PlanCompare";

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              <Link href="/">
                <span className="text-accent-green">Invest</span>Plan10
              </Link>
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">Compare plans</p>
          </div>
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground border border-card-border rounded-lg px-4 py-2 transition hover:border-foreground/30"
          >
            ← Back
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <PlanCompare />
      </div>
    </main>
  );
}
