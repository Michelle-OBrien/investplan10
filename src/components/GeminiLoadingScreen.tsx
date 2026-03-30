"use client";

export default function GeminiLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-card-border rounded-2xl p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-card-border border-t-accent-green animate-spin" />
        <h2 className="text-xl font-bold mb-2">Recherche et raisonnement en cours...</h2>
        <p className="text-sm text-muted">
          Gemini élabore votre stratégie d’investissement. Cela peut prendre quelques secondes.
        </p>
      </div>
    </div>
  );
}
