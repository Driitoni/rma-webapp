"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/AppShell";

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

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"member" | "admin">("member");
  const [tier, setTier] = useState<"free" | "private">("free");

  const [morning, setMorning] = useState<Post[]>([]);
  const [midday, setMidday] = useState<Post[]>([]);
  const [evening, setEvening] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return r.replace("/login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("role,tier")
        .eq("id", user.id)
        .single();

      setRole((prof?.role ?? "member") as "member" | "admin");
      setTier((prof?.tier ?? "free") as "free" | "private");

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
      .limit(50);

    if (error || !data) return;

    const posts = data as Post[];
    setMorning(posts.filter((p) => p.drop_type === "morning"));
    setMidday(posts.filter((p) => p.drop_type === "midday"));
    setEvening(posts.filter((p) => p.drop_type === "evening"));
  }

  if (loading) {
    return (
      <AppShell title="Dashboard" tierLabel={tier === "private" ? "Private" : "Free"}>
        <div className="panel" style={{ padding: 18 }}>Loading...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard" tierLabel={tier === "private" ? "Private" : "Free"}>
      <div className="panel" style={{ padding: 18 }}>
        <div className="row">
          <div>
            <h1 className="h1">Daily Drops</h1>
            <p className="p">
              Role: <b>{role}</b> • Tier: <b>{tier}</b>
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={loadDrops}>Refresh</button>
            {role === "admin" && (
              <button className="btn" onClick={() => r.push("/admin")}>Admin</button>
            )}
          </div>
        </div>

        <div className="grid grid3" style={{ marginTop: 16 }}>
          <DropColumn title="🕘 Morning" items={morning} />
          <DropColumn title="🕛 Midday" items={midday} />
          <DropColumn title="🌙 Evening" items={evening} />
        </div>

        <p className="small" style={{ marginTop: 14 }}>
          Private drops are hidden for free members automatically (secured by database rules).
        </p>
      </div>
    </AppShell>
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
            <div key={p.id} className="card" style={{ background: "rgba(0,0,0,.14)" }}>
              <div style={{ fontWeight: 950 }}>{p.title}</div>
              <div className="small" style={{ marginTop: 4 }}>
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
