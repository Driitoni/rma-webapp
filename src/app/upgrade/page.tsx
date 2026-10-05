"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default function UpgradePage() {
  const r = useRouter();
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<"free" | "private">("free");

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return r.replace("/login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("tier,role")
        .eq("id", user.id)
        .single();

      const role = prof?.role ?? "member";
      const t = (prof?.tier ?? "free") as "free" | "private";

      if (role === "admin" || t === "private") return r.replace("/private");

      setTier(t);
      setLoading(false);
    })();
  }, [r]);

  if (loading) return <AppShell title="Membership" tierLabel="Free">Loading...</AppShell>;

  return (
    <AppShell title="Membership" tierLabel="Free">
      <div style={{ width: "100%", maxWidth: 560, border: "1px solid #ddd", borderRadius: 14, padding: 18 }}>
        <h1 style={{ fontSize: 28, fontWeight: 950 }}>Upgrade to Private</h1>
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Your tier is: <b>{tier}</b>. Private unlocks premium drops + private area.
        </p>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>✅ What you get</div>
            <ul style={{ marginTop: 8, opacity: 0.85 }}>
              <li>Private daily trading drops</li>
              <li>Private challenges + accountability</li>
              <li>Priority answers</li>
            </ul>
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>📩 How to upgrade (for now)</div>
            <p style={{ opacity: 0.8, marginTop: 6 }}>
              Message admin and send your email. Admin will upgrade your account manually.

            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button onClick={() => r.push("/dashboard")} style={btn()}>Back to Dashboard</button>
          <button onClick={() => r.push("/plans")} style={btnPrimary()}>
            Compare memberships
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function btn(): React.CSSProperties {
  return { padding: "10px 14px", borderRadius: 10, border: "1px solid #111", cursor: "pointer", background: "#fff" };
}
function btnPrimary(): React.CSSProperties {
  return { padding: "10px 14px", borderRadius: 10, border: "1px solid #111", cursor: "pointer", background: "#111", color: "#fff", fontWeight: 900 };
}
