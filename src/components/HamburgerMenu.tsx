"use client";

import { useState } from "react";
import Link from "next/link";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/compare", label: "Compare Plans", icon: "⚖️" },
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "#history", label: "Plan History", icon: "📜", onClick: () => {
      // Scroll to history section
      const historyElement = document.getElementById("plan-history");
      if (historyElement) {
        historyElement.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }},
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 text-muted hover:text-foreground border border-card-border rounded-lg transition hover:border-foreground/30"
        aria-label="Menu"
      >
        <span className="text-lg">☰</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-48 max-w-[calc(100vw-1rem)] bg-card border border-card-border rounded-lg shadow-lg z-50 py-2 animate-fade-in-down" style={{ minWidth: "180px" }}>
            {menuItems.map((item) => (
              <div key={item.href}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}