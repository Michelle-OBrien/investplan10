"use client";

import { exportToPdf } from "@/lib/exportPdf";

export default function ExportButton() {
  const handleExport = async () => {
    try {
      await exportToPdf("plan-results");
      window.alert("PDF downloaded!");
    } catch (err) {
      console.error("Export to PDF failed", err);
      window.alert("PDF export failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="no-print text-sm text-muted hover:text-foreground border border-card-border rounded-lg px-4 py-2 transition cursor-pointer hover:border-foreground/30 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export PDF
    </button>
  );
}
