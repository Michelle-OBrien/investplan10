"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-card border border-accent-green/30 rounded-2xl p-8 glow-green">
            <div className="text-4xl mb-4">&#9993;</div>
            <h2 className="text-lg font-bold mb-2">Check your email</h2>
            <p className="text-sm text-muted">
              We sent a confirmation link to{" "}
              <span className="text-foreground font-medium">{email}</span>.
              Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="inline-block mt-6 text-sm text-accent-green hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            <span className="text-accent-green">Invest</span>Plan10
          </h1>
          <p className="text-sm text-muted mt-1">Create your account</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent-green transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent-green transition"
                placeholder="Min. 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent-green transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-accent-red text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold bg-accent-green text-background hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
