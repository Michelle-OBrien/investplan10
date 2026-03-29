export type Locale = "en" | "fr";

export const translations = {
  en: {
    // Header
    tagline: "AI-powered 10-year investment strategy",
    poweredBy: "Powered by Gemini",
    // Form
    yourBudget: "Your Budget",
    formSubtitle: "Set your parameters and let AI build your plan",
    initialBudget: "Initial Budget (€)",
    monthlyContribution: "Monthly Contribution (€)",
    riskTolerance: "Risk Tolerance",
    conservative: "Conservative",
    moderate: "Moderate",
    aggressive: "Aggressive",
    assetAllocation: "Asset Allocation",
    generateBtn: "Generate My 10-Year Plan",
    generating: "Generating Plan with AI...",
    // Empty state
    readyTitle: "Ready to plan your future?",
    readyDesc:
      "Enter your budget, choose your risk level and allocation, then hit generate. Our AI will create a personalized 10-year investment plan with specific assets to buy.",
    // Loading
    analyzing: "Gemini is analyzing markets...",
    buildingStrategy: "Building your personalized investment strategy",
    // Results
    investmentStrategy: "Investment Strategy",
    growthProjection: "10-Year Growth Projection",
    compoundStrategy: "Compound Interest Strategy",
    recommendedAssets: "Recommended Assets",
    newPlan: "New plan",
    disclaimer:
      "Disclaimer: This is a simulation for educational purposes only. Past performance does not guarantee future results. Always consult a financial advisor before investing.",
    // Stats
    totalInvested: "Total Invested",
    projectedValue: "Projected Value",
    estimatedProfit: "Estimated Profit",
    over10Years: "over 10 years",
    atYear10: "at year 10",
    // Error
    retry: "Retry",
    dismiss: "Dismiss",
    // Footer
    footerCredit: "Master IMT&E, Université Panthéon-Sorbonne",
  },
  fr: {
    // Header
    tagline: "Stratégie d'investissement sur 10 ans par IA",
    poweredBy: "Propulsé par Gemini",
    // Form
    yourBudget: "Votre Budget",
    formSubtitle: "Définissez vos paramètres et laissez l'IA construire votre plan",
    initialBudget: "Budget initial (€)",
    monthlyContribution: "Contribution mensuelle (€)",
    riskTolerance: "Tolérance au risque",
    conservative: "Conservateur",
    moderate: "Modéré",
    aggressive: "Agressif",
    assetAllocation: "Répartition des actifs",
    generateBtn: "Générer mon plan sur 10 ans",
    generating: "Génération du plan en cours...",
    // Empty state
    readyTitle: "Prêt à planifier votre avenir ?",
    readyDesc:
      "Entrez votre budget, choisissez votre niveau de risque et votre allocation, puis cliquez sur générer. Notre IA créera un plan d'investissement personnalisé sur 10 ans avec des actifs spécifiques à acheter.",
    // Loading
    analyzing: "Gemini analyse les marchés...",
    buildingStrategy: "Construction de votre stratégie d'investissement personnalisée",
    // Results
    investmentStrategy: "Stratégie d'investissement",
    growthProjection: "Projection de croissance sur 10 ans",
    compoundStrategy: "Stratégie d'intérêts composés",
    recommendedAssets: "Actifs recommandés",
    newPlan: "Nouveau plan",
    disclaimer:
      "Avertissement : Ceci est une simulation à des fins éducatives uniquement. Les performances passées ne garantissent pas les résultats futurs. Consultez toujours un conseiller financier avant d'investir.",
    // Stats
    totalInvested: "Total investi",
    projectedValue: "Valeur projetée",
    estimatedProfit: "Profit estimé",
    over10Years: "sur 10 ans",
    atYear10: "à l'année 10",
    // Error
    retry: "Réessayer",
    dismiss: "Fermer",
    // Footer
    footerCredit: "Master IMT&E, Université Panthéon-Sorbonne",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
