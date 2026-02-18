"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [tier, setTier] = useState<"free" | "private">("free");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [posts, setPosts] = useState<Post[]>([]);

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

      setRole((prof?.role ?? "member") as any);
      setTier((prof?.tier ?? "free") as any);

      const { data, error } = await supabase
        .from("posts")
        .select("id,created_at,drop_type,pillar,title,content,tier_required")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) setPosts(data as Post[]);
      setLoading(false);
    })();
  }, [r]);

  const tierLabel = tier === "private" ? "Private" : "Free";

  const latest = useMemo(() => {
    const m = posts.find(p => p.drop_type === "morning");
    const d = posts.find(p => p.drop_type === "midday");
    const e = posts.find(p => p.drop_type === "evening");
    return { m, d, e };
  }, [posts]);

  if (loading) {
    return (
      <AppShell title="Dashboard" tierLabel={tierLabel}>
        <div className="panel" style={{ padding: 18 }}>Loading...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard" tierLabel={tierLabel}>
      <div className="panel" style={{ padding: 18 }}>
        <div className="row">
          <div>
            <h1 className="h1">Overview</h1>
            <p className="p">
              Tier: <b>{tier}</b> • Role: <b>{role}</b>
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => r.push("/levels")}>Levels</button>
            <button className="btn" onClick={() => r.push("/wallet")}>Wallet</button>
            <button className="btn" onClick={() => r.push("/private")}>Private</button>
            {role === "admin" && <button className="btn" onClick={() => r.push("/admin")}>Admin</button>}
          </div>
        </div>

        <div className="grid grid3" style={{ marginTop: 16 }}>
          <DropCard title="🕘 Morning" post={latest.m} />
          <DropCard title="🕛 Midday" post={latest.d} />
          <DropCard title="🌙 Evening" post={latest.e} />
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <div className="h2">Recent Drops</div>
          <div className="grid" style={{ marginTop: 10 }}>
            {posts.slice(0, 6).map(p => (
              <div key={p.id} className="card" style={{ background: "rgba(0,0,0,.14)" }}>
                <div style={{ fontWeight: 950 }}>{p.title}</div>
                <div className="small" style={{ marginTop: 4 }}>
                  {p.drop_type} • {p.pillar} • {new Date(p.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DropCard({ title, post }: { title: string; post?: Post }) {
  return (
    <div className="card">
      <div className="h2">{title}</div>
      {post ? (
        <>
          <div className="small" style={{ marginTop: 6 }}>
            {post.pillar} • {new Date(post.created_at).toLocaleString()}
          </div>
          <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{post.content}</p>
        </>
      ) : (
        <p className="p" style={{ marginTop: 8 }}>No post yet.</p>
      )}
    </div>
  );
}
