"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/AppShell";

export default function HomePage() {
  const r = useRouter();
  const [tierLabel, setTierLabel] = useState<"Free" | "Private">("Free");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;

      // ✅ If logged in, go dashboard
      if (user) {
        r.replace("/dashboard");
        return;
      }

      setChecking(false);
    })();
  }, [r]);

  // Optional: tiny loading so it doesn't flash the home page
  if (checking) {
    return (
      <AppShell title="Home" tierLabel={tierLabel}>
        <div className="panel" style={{ padding: 18 }}>Loading...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Home" tierLabel={tierLabel}>
      <div className="panel" style={{ padding: 18 }}>
        <h1 className="h1">Rich Mode Academy</h1>
        <p className="p">Zero → Hero in 30 days.</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button className="btn btnPrimary" onClick={() => r.push("/register")}>Start Free</button>
          <button className="btn" onClick={() => r.push("/login")}>Login</button>
        </div>
      </div>
    </AppShell>
  );
}
