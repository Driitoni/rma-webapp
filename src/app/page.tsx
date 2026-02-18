"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/AppShell";

export default function HomePage() {
  const r = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [tierLabel, setTierLabel] = useState<"Free" | "Private">("Free");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setLoggedIn(!!user);

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
    <AppShell title="Welcome" tierLabel={tierLabel}>
      <div className="panel" style={{ padding: 18 }}>
        <h1 className="h1">Rich Mode Academy</h1>
        <p className="p">
          Zero → Hero in 30 days: Money Systems • Trading (XAUUSD) • Mindset • Discipline
        </p>

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
          {loggedIn ? (
            <>
              <button className="btn btnPrimary" onClick={() => r.push("/dashboard")}>Continue</button>
              <button className="btn" onClick={() => r.push("/levels")}>Levels</button>
              <button className="btn" onClick={() => r.push("/wallet")}>Wallet</button>
              <button className="btn" onClick={() => r.push("/profile")}>Profile</button>
            </>
          ) : (
            <>
              <button className="btn btnPrimary" onClick={() => r.push("/register")}>Start Free</button>
              <button className="btn" onClick={() => r.push("/login")}>Login</button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
