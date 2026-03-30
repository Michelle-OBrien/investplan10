import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/components/Toaster";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvestPlan10 — AI-Powered 10-Year Investment Planner",
  description:
    "Plan your 10-year investment strategy across stocks, crypto, and forex with AI-powered recommendations. Built with Next.js and Gemini.",
  keywords: [
    "investment planner",
    "10 year plan",
    "stocks",
    "crypto",
    "forex",
    "AI finance",
    "portfolio allocation",
    "compound interest",
  ],
  authors: [{ name: "Michelle O'Brien" }],
  openGraph: {
    title: "InvestPlan10 — AI-Powered 10-Year Investment Planner",
    description:
      "Generate a personalized 10-year investment plan with specific asset recommendations using Gemini AI.",
    type: "website",
    locale: "en_US",
    siteName: "InvestPlan10",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestPlan10 — AI-Powered 10-Year Investment Planner",
    description:
      "Generate a personalized 10-year investment plan with specific asset recommendations using Gemini AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "InvestPlan10",
  },
  icons: {
    icon: "/icons/icon-512.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d4aa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",t)})()`,
          }}
        />
        <ServiceWorkerRegister />
        <I18nProvider>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
