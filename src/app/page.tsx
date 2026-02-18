"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/AppShell";

export default function HomePage() {
  const r = useRouter();
  const [tierLabel, setTierLabel] = useState<"Free" | "Private">("Free");

  useEffect(() => {
    (async () => {
      // Home should work even if not logged in
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("tier,role")
        .eq("id", user.id)
        .single();

      const isPrivate = prof?.role === "admin" || prof?.tier === "private";
      setTierLabel(isPrivate ? "Private" : "Free");
    })();
  }, []);

  return (
    <AppShell title="Home" tierLabel={tierLabel}>
      <div className="panel" style={{ padding: 18 }}>
        <div className="row">
          <div>
            <h1 className="h1">Rich Mode Academy</h1>
            <p className="p">
              Zero → Hero in 30 days: Money Systems • Trading (XAUUSD) • Mindset • Discipline
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" onClick={() => r.push("/register")}>
              Start Free
            </button>
            <button className="btn" onClick={() => r.push("/login")}>
              Login
            </button>
          </div>
        </div>

        <div className="grid grid3" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="h2">🕘 Morning Drop</div>
            <p className="p">Mindset lesson + mission + rule reminder.</p>
          </div>
          <div className="card">
            <div className="h2">🕛 Midday Drop</div>
            <p className="p">Money method + small task + skill to build.</p>
          </div>
          <div className="card">
            <div className="h2">🌙 Evening Drop</div>
            <p className="p">Trading bias + levels + setup explanation.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <button className="btn" onClick={() => r.push("/dashboard")}>
            Go to Dashboard
          </button>
          <button className="btn" onClick={() => r.push("/levels")}>
            Levels
          </button>
          <button className="btn" onClick={() => r.push("/private")}>
            Private Area
          </button>
          <button className="btn" onClick={() => r.push("/upgrade")}>
            Upgrade
          </button>
        </div>

        <p className="small" style={{ marginTop: 14 }}>
          If you’re not logged in, Dashboard/Private will redirect you to Login or Upgrade.
        </p>
      </div>
    </AppShell>
  );
}
