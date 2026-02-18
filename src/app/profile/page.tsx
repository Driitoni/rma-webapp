"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/AppShell";

export default function ProfilePage() {
  const r = useRouter();
  const [tier, setTier] = useState<"free" | "private">("free");

  const [name, setName] = useState("RMA Member");
  const [bio, setBio] = useState("Building discipline. Learning money systems. Trading XAUUSD.");
  const [country, setCountry] = useState("");
  const [streak, setStreak] = useState(0);
  const [wins, setWins] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return r.replace("/login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name,country,goal,tier")
        .eq("id", user.id)
        .single();

      setTier((prof?.tier ?? "free") as any);

      if (prof?.full_name) setName(prof.full_name);
      if (prof?.country) setCountry(prof.country);
      if (prof?.goal) setBio(prof.goal);

      // demo stats (we can store these later in DB)
      setStreak(7);
      setWins(12);
    })();
  }, [r]);

  return (
    <AppShell title="Profile" tierLabel={tier === "private" ? "Private" : "Free"}>
      <div className="panel" style={{ padding: 18, maxWidth: 860, margin: "0 auto" }}>
        <div className="row">
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 22,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.04)",
                display: "grid",
                placeItems: "center",
                fontWeight: 950,
                fontSize: 22,
              }}
            >
              {name.slice(0, 1).toUpperCase()}
            </div>

            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontSize: 22, fontWeight: 950 }}>{name}</div>
                <span className={`badge ${tier === "private" ? "badgeGold" : ""}`}>
                  {tier === "private" ? "✅ Verified Private" : "Free Member"}
                </span>
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                {country ? `🌍 ${country}` : "🌍 Add country in Settings later"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => r.push("/settings")}>Settings</button>
            <button className="btn" onClick={() => r.push("/wallet")}>Wallet</button>
          </div>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <div className="h2">Bio</div>
          <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{bio}</p>
        </div>

        <div className="grid grid3" style={{ marginTop: 14 }}>
          <Stat title="🔥 Streak" value={`${streak} days`} hint="Daily participation" />
          <Stat title="🏆 Wins" value={`${wins}`} hint="Completed missions" />
          <Stat title="⚡ Status" value={tier === "private" ? "Private" : "Free"} hint="Membership tier" />
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <div className="h2">Next Actions</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <button className="btn btnPrimary" onClick={() => r.push("/dashboard")}>Go Dashboard</button>
            <button className="btn" onClick={() => r.push("/levels")}>Check Levels</button>
            <button className="btn" onClick={() => r.push("/upgrade")}>Upgrade</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="card">
      <div className="small">{title}</div>
      <div style={{ fontSize: 22, fontWeight: 950, marginTop: 6 }}>{value}</div>
      <div className="small" style={{ marginTop: 6 }}>{hint}</div>
    </div>
  );
}
