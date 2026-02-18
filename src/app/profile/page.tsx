"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/AppShell";

export default function ProfilePage() {
  const r = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tier, setTier] = useState<"free" | "private">("free");

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
        .select("full_name,country,goal,tier")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setFullName(data.full_name ?? "");
        setCountry(data.country ?? "");
        setGoal(data.goal ?? "");
        setTier((data.tier ?? "free") as "free" | "private");
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

  return (
    <AppShell title="Profile" tierLabel={tier === "private" ? "Private" : "Free"}>
      <div className="panel" style={{ padding: 18, maxWidth: 820, margin: "0 auto" }}>
        <h1 className="h1">Your Profile</h1>
        <p className="p">Set your details so the program can personalize your run.</p>

        {loading ? (
          <div style={{ marginTop: 14 }} className="small">
            Loading...
          </div>
        ) : (
          <form onSubmit={saveProfile} className="grid" style={{ marginTop: 14 }}>
            <div>
              <label className="small">Full name</label>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
              <label className="small">Country</label>
              <input className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            <div>
              <label className="small">Goal (30 days)</label>
              <textarea
                className="input"
                rows={5}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Example: Become consistent, build income skills, follow drops daily..."
              />
            </div>

            {msg && <div className="small">{msg}</div>}

            <button className={`btn ${saving ? "" : "btnPrimary"}`} disabled={saving} type="submit">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}

        <div style={{ marginTop: 14 }} className="small">
          Tier: <b>{tier}</b>
        </div>
      </div>
    </AppShell>
  );
}
