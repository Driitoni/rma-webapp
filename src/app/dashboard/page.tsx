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

  const [email, setEmail] = useState<string>("");
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

      // read my profile (role/tier)
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

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 950 }}>RMA Dashboard</h1>
            <p style={{ opacity: 0.7, marginTop: 6 }}>
              Logged in as: {email} • tier: <b>{tier}</b> • role: <b>{role}</b>
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => r.push("/profile")} style={btn()}>Profile</button>
            {role === "admin" && <button onClick={() => r.push("/admin")} style={btn()}>Admin</button>}
            <button onClick={loadDrops} style={btn()}>Refresh</button>
            <button onClick={() => r.push("/private")} style={btn()}>Private</button>

            <button onClick={logout} style={btnDanger()}>Logout</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginTop: 18 }}>
          <DropColumn title="🕘 Morning Drop" items={morning} />
          <DropColumn title="🕛 Midday Drop" items={midday} />
          <DropColumn title="🌙 Evening Drop" items={evening} />
        </div>

        <div style={{ marginTop: 18, opacity: 0.7 }}>
          <small>
            Private drops are automatically hidden from free members (database security).
          </small>
        </div>
      </div>
    </main>
  );
}

function DropColumn({ title, items }: { title: string; items: Post[] }) {
  return (
    <section style={card()}>
      <h2 style={{ fontSize: 18, fontWeight: 950 }}>{title}</h2>
      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {items.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No drops yet.</div>
        ) : (
          items.slice(0, 6).map((p) => (
            <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 900 }}>{p.title}</div>
              <div style={{ opacity: 0.7, marginTop: 2, fontSize: 12 }}>
                {p.pillar} • tier: {p.tier_required} • {new Date(p.created_at).toLocaleString()}
              </div>
              <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{p.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function card(): React.CSSProperties {
  return { border: "1px solid #ddd", borderRadius: 14, padding: 14 };
}
function btn(): React.CSSProperties {
  return { padding: "10px 14px", borderRadius: 10, border: "1px solid #111", cursor: "pointer", background: "#fff" };
}
function btnDanger(): React.CSSProperties {
  return { padding: "10px 14px", borderRadius: 10, border: "1px solid #ff3b5c", cursor: "pointer", background: "#fff" };
}
