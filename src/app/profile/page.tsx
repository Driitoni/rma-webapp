"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const r = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [goal, setGoal] = useState("");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return r.replace("/login");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name,country,goal")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setFullName(data.full_name ?? "");
        setCountry(data.country ?? "");
        setGoal(data.goal ?? "");
      }

      setLoading(false);
    })();
  }, [r]);

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) {
      setSaving(false);
      return r.replace("/login");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, country, goal })
      .eq("id", user.id);

    setSaving(false);

    if (error) return setMsg("❌ " + error.message);
    setMsg("✅ Saved!");
  }

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={saveProfile} style={{ width: "100%", maxWidth: 520, border: "1px solid #ddd", padding: 20, borderRadius: 14 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>Your RMA Profile</h1>
        <p style={{ opacity: 0.7, marginTop: 6 }}>This helps personalize your program.</p>

        <label style={{ display: "block", marginTop: 16 }}>Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" }} />

        <label style={{ display: "block", marginTop: 12 }}>Country</label>
        <input value={country} onChange={(e) => setCountry(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" }} />

        <label style={{ display: "block", marginTop: 12 }}>Your goal (30 days)</label>
        <textarea value={goal} onChange={(e) => setGoal(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" }} />

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

        <button disabled={saving} style={{ width: "100%", marginTop: 14, padding: 12, borderRadius: 10, border: "1px solid #111", fontWeight: 800 }}>
          {saving ? "Saving..." : "Save Profile"}
        </button>

        <button type="button" onClick={() => r.push("/dashboard")}
          style={{ width: "100%", marginTop: 10, background: "transparent", border: "none", textDecoration: "underline", opacity: 0.8, cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </form>
    </main>
  );
}
