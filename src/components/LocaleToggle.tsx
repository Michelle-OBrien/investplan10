"use client";

import { useI18n } from "@/lib/i18n/context";

export default function LocaleToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "fr" : "en")}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-card-border text-xs font-bold text-muted hover:text-foreground hover:border-foreground/30 transition cursor-pointer"
      title={locale === "en" ? "Passer en français" : "Switch to English"}
    >
      {locale === "en" ? "FR" : "EN"}
    </button>
  );
}
