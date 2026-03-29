"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted truncate max-w-[150px]">
        {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="text-xs text-muted hover:text-accent-red border border-card-border rounded-lg px-3 py-1.5 transition cursor-pointer hover:border-accent-red/30"
      >
        Logout
      </button>
    </div>
  );
}
