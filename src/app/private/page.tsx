"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PrivatePage() {
  const r = useRouter();
  const [loading, setLoading] = useState(true);

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
      const tier = prof?.tier ?? "free";

      if (!(role === "admin" || tier === "private")) {
        return r.replace("/upgrade");
      }

      setLoading(false);
    })();
  }, [r]);

  if (loading) return <main style={{ padding: 24 }}>Checking access...</main>;

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", border: "1px solid #ddd", borderRadius: 14, padding: 18 }}>
        <h1 style={{ fontSize: 28, fontWeight: 950 }}>🔒 Private Members Area</h1>
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Only private members can see this. (Admins also.)
        </p>

        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>📈 Private Trading Drops</div>
            <p style={{ opacity: 0.75, marginTop: 6 }}>
              Here you will put private setups, levels, and rules.
            </p>
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>🏆 Private Challenges</div>
            <p style={{ opacity: 0.75, marginTop: 6 }}>
              Locked missions & accountability system.
            </p>
          </div>
        </div>

        <button
          onClick={() => r.push("/dashboard")}
          style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, border: "1px solid #111", cursor: "pointer" }}
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}
