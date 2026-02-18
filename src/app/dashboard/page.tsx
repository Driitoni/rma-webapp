"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: number;
  created_at: string;
  drop_type: "morning" | "midday" | "evening";
  pillar: string;
  title: string;
  content: string;
  tier_required: "free" | "private";
};

export default function DashboardPage() {
  const r = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [tier, setTier] = useState<"free" | "private">("free");
  const [loading, setLoading] = useState(true);

  const [morning, setMorning] = useState<Post[]>([]);
  const [midday, setMidday] = useState<Post[]>([]);
  const [evening, setEvening] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return r.replace("/login");

      setEmail(user.email ?? "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("role,tier")
        .eq("id", user.id)
        .single();

      if (prof?.role) setRole(prof.role);
      if (prof?.tier) setTier(prof.tier);

      await loadDrops();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDrops() {
    const { data, error } = await supabase
      .from("posts")
      .select("id,created_at,drop_type,pillar,title,content,tier_required")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data) return;

    const posts = data as Post[];
    setMorning(posts.filter((p) => p.drop_type === "morning"));
    setMidday(posts.filter((p) => p.drop_type === "midday"));
    setEvening(posts.filter((p) => p.drop_type === "evening"));
  }

  async function logout() {
    await supabase.auth.signOut();
    r.replace("/login");
  }

  if (loading) return <main className="container">Loading...</main>;

  return (
    <main className="container" style={{ minHeight: "100vh" }}>
      <div className="panel" style={{ padding: 22 }}>
        <div className="row">
          <div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div className="badge">📩 {email}</div>
              <div className={`badge ${tier === "private" ? "badgeGold" : ""}`}>💳 tier: {tier}</div>
              <div className="badge">🛡️ role: {role}</div>
            </div>
            <h1 className="h1" style={{ marginTop: 10 }}>
              Dashboard
            </h1>
            <p className="p">Your drops update here. Stay consistent.</p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => r.push("/profile")}>Profile</button>
            <button className="btn" onClick={() => r.push("/private")}>Private</button>
            <button className="btn" onClick={() => r.push("/upgrade")}>Upgrade</button>
            {role === "admin" && <button className="btn" onClick={() => r.push("/admin")}>Admin</button>}
            <button className="btn" onClick={loadDrops}>Refresh</button>
            <button className="btn btnDanger" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="grid grid3" style={{ marginTop: 16 }}>
          <DropColumn title="🕘 Morning Drop" items={morning} />
          <DropColumn title="🕛 Midday Drop" items={midday} />
          <DropColumn title="🌙 Evening Drop" items={evening} />
        </div>

        <p className="small" style={{ marginTop: 14 }}>
          Private drops are hidden for free members automatically (secured in database rules).
        </p>
      </div>
    </main>
  );
}

function DropColumn({ title, items }: { title: string; items: Post[] }) {
  return (
    <section className="card">
      <div className="h2">{title}</div>
      <div className="grid" style={{ marginTop: 12 }}>
        {items.length === 0 ? (
          <div className="small">No drops yet.</div>
        ) : (
          items.slice(0, 6).map((p) => (
            <div key={p.id} className="card" style={{ background: "rgba(0,0,0,.12)" }}>
              <div style={{ fontWeight: 900 }}>{p.title}</div>
              <div className="small" style={{ marginTop: 4 }}>
                {p.pillar} • tier: {p.tier_required} • {new Date(p.created_at).toLocaleString()}
              </div>
              <p style={{ marginTop: 10, whiteSpace: "pre-wrap", color: "var(--text)" }}>{p.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
