"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  full_name: string | null;
  country: string | null;
  goal: string | null;
  tier: "free" | "private";
  role: "member" | "admin";
  created_at: string;
};

type Post = {
  id: number;
  created_at: string;
  drop_type: "morning" | "midday" | "evening";
  pillar: "money" | "trading" | "mindset" | "discipline" | "onboarding" | "wins" | "questions";
  title: string;
  content: string;
  tier_required: "free" | "private";
};

export default function AdminPage() {
  const r = useRouter();

  const [meOk, setMeOk] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Create post form
  const [dropType, setDropType] = useState<Post["drop_type"]>("morning");
  const [pillar, setPillar] = useState<Post["pillar"]>("mindset");
  const [tierRequired, setTierRequired] = useState<Post["tier_required"]>("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [msg, setMsg] = useState<string>("");

  // Users + Posts lists
  const [users, setUsers] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Upgrade user
  const [upgradeEmail, setUpgradeEmail] = useState("");
  const [upgradeMsg, setUpgradeMsg] = useState("");

  const canSubmit = useMemo(() => {
    return title.trim().length >= 3 && content.trim().length >= 10;
  }, [title, content]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      // must be logged in
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return r.replace("/login");

      // check role admin
      const { data: prof, error: pErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (pErr || !prof || prof.role !== "admin") {
        return r.replace("/dashboard");
      }

      setMeOk(true);

      // load lists (RLS will allow admin)
      await Promise.all([loadUsers(), loadPosts()]);

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,country,goal,tier,role,created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) setUsers(data as Profile[]);
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("id,created_at,drop_type,pillar,title,content,tier_required")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) setPosts(data as Post[]);
  }

  async function createPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    if (!canSubmit) {
      setMsg("❌ Title/content too short.");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        drop_type: dropType,
        pillar,
        title: title.trim(),
        content: content.trim(),
        tier_required: tierRequired,
      },
    ]);

    if (error) {
      setMsg("❌ " + error.message);
      return;
    }

    setMsg("✅ Post created!");
    setTitle("");
    setContent("");
    await loadPosts();
  }

  async function deletePost(postId: number) {
    if (!confirm("Delete this post?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      alert("❌ " + error.message);
      return;
    }
    await loadPosts();
  }

  async function upgradeToPrivate() {
    setUpgradeMsg("");

    const email = upgradeEmail.trim().toLowerCase();
    if (!email.includes("@")) {
      setUpgradeMsg("❌ Enter a valid email.");
      return;
    }

    // Supabase RLS doesn't let us query auth.users from client.
    // So we do a simple way: admin selects the user from the list and copies their ID.
    // BUT: to keep it easy, we’ll upgrade by asking you to paste the USER ID.
    // We’ll switch to ID-based upgrade below.
    setUpgradeMsg("❗ For security: upgrade by USER ID (see instructions below).");
  }

  // ID-based upgrade (works with profiles table)
  const [upgradeUserId, setUpgradeUserId] = useState("");

  async function upgradeById() {
    setUpgradeMsg("");

    const id = upgradeUserId.trim();
    if (id.length < 10) {
      setUpgradeMsg("❌ Paste a valid user id.");
      return;
    }

    const { error } = await supabase.from("profiles").update({ tier: "private" }).eq("id", id);

    if (error) {
      setUpgradeMsg("❌ " + error.message);
      return;
    }

    setUpgradeMsg("✅ Upgraded to private!");
    setUpgradeUserId("");
    await loadUsers();
  }

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;
  if (!meOk) return <main style={{ padding: 24 }}>Not allowed.</main>;

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: 28, fontWeight: 950 }}>Admin Panel</h1>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => r.push("/dashboard")} style={btn()}>
              Dashboard
            </button>
            <button onClick={() => r.push("/profile")} style={btn()}>
              Profile
            </button>
          </div>
        </div>

        {/* Create Post */}
        <section style={card()}>
          <h2 style={{ fontSize: 18, fontWeight: 900 }}>Create Daily Drop</h2>
          <p style={{ opacity: 0.7, marginTop: 6 }}>
            Members will see these inside dashboard. Private drops require private tier.
          </p>

          <form onSubmit={createPost} style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <div>
                <label style={label()}>Drop Type</label>
                <select value={dropType} onChange={(e) => setDropType(e.target.value as Post["drop_type"])} style={input()}>
                  <option value="morning">morning</option>
                  <option value="midday">midday</option>
                  <option value="evening">evening</option>
                </select>
              </div>

              <div>
                <label style={label()}>Pillar</label>
                <select value={pillar} onChange={(e) => setPillar(e.target.value as Post["pillar"])} style={input()}>
                  <option value="onboarding">onboarding</option>
                  <option value="money">money</option>
                  <option value="trading">trading</option>
                  <option value="mindset">mindset</option>
                  <option value="discipline">discipline</option>
                  <option value="wins">wins</option>
                  <option value="questions">questions</option>
                </select>
              </div>

              <div>
                <label style={label()}>Tier Required</label>
                <select value={tierRequired} onChange={(e) => setTierRequired(e.target.value as Post["tier_required"])} style={input()}>
                  <option value="free">free</option>
                  <option value="private">private</option>
                </select>
              </div>
            </div>

            <div>
              <label style={label()}>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={input()} placeholder="e.g. Day 1: Win the morning" />
            </div>

            <div>
              <label style={label()}>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                style={input()}
                placeholder="Write the mission, lesson, rule, setup..."
              />
            </div>

            {msg && <p style={{ marginTop: 4 }}>{msg}</p>}

            <button disabled={!canSubmit} style={btnPrimary(!canSubmit)}>
              {canSubmit ? "Publish Drop" : "Write title + content"}
            </button>
          </form>
        </section>

        {/* Upgrade users */}
        <section style={card()}>
          <h2 style={{ fontSize: 18, fontWeight: 900 }}>Upgrade to Private (manual)</h2>
          <p style={{ opacity: 0.7, marginTop: 6 }}>
            Copy a user <b>ID</b> from the list below and paste it here to upgrade tier to <b>private</b>.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginTop: 12 }}>
            <input
              value={upgradeUserId}
              onChange={(e) => setUpgradeUserId(e.target.value)}
              placeholder="Paste user ID (uuid)..."
              style={input()}
            />
            <button onClick={upgradeById} style={btn()}>
              Upgrade
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            <small style={{ opacity: 0.7 }}>
              Note: upgrading by email from client is not safe. Later we’ll add a secure server function for it.
            </small>
          </div>

          {upgradeMsg && <p style={{ marginTop: 10 }}>{upgradeMsg}</p>}
        </section>

        {/* Users list */}
        <section style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900 }}>Latest Users (profiles)</h2>
            <button onClick={loadUsers} style={btn()}>
              Refresh
            </button>
          </div>

          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={th()}>Created</th>
                  <th style={th()}>ID</th>
                  <th style={th()}>Name</th>
                  <th style={th()}>Country</th>
                  <th style={th()}>Tier</th>
                  <th style={th()}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={td()}>{new Date(u.created_at).toLocaleString()}</td>
                    <td style={tdMono()}>
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <span>{u.id}</span>
    <button onClick={() => copy(u.id)} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #111", cursor: "pointer" }}>
      Copy
    </button>
  </div>
</td>

                    <td style={td()}>{u.full_name ?? "-"}</td>
                    <td style={td()}>{u.country ?? "-"}</td>
                    <td style={td()}>{u.tier}</td>
                    <td style={td()}>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Posts list */}
        <section style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900 }}>Latest Drops</h2>
            <button onClick={loadPosts} style={btn()}>
              Refresh
            </button>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {posts.map((p) => (
              <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{p.title}</div>
                    <div style={{ opacity: 0.7, marginTop: 2 }}>
                      {p.drop_type} • {p.pillar} • tier: {p.tier_required} • {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>

                  <button onClick={() => deletePost(p.id)} style={btnDanger()}>
                    Delete
                  </button>
                </div>

                <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{p.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
  async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert("✅ Copied!");
  } catch {
    alert("❌ Copy failed. Select and copy manually.");
  }
}

}

function card(): React.CSSProperties {
  return {
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
  };
}
function label(): React.CSSProperties {
  return { display: "block", fontWeight: 800, marginBottom: 6 };
}
function input(): React.CSSProperties {
  return {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  };
}
function btn(): React.CSSProperties {
  return { padding: "10px 14px", borderRadius: 10, border: "1px solid #111", cursor: "pointer", background: "#fff" };
}
function btnPrimary(disabled: boolean): React.CSSProperties {
  return {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #111",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#f3f3f3" : "#111",
    color: disabled ? "#111" : "#fff",
    fontWeight: 900,
  };
}
function btnDanger(): React.CSSProperties {
  return { padding: "10px 14px", borderRadius: 10, border: "1px solid #ff3b5c", cursor: "pointer", background: "#fff" };
}
function th(): React.CSSProperties {
  return { textAlign: "left", borderBottom: "1px solid #eee", padding: 10, fontSize: 13, opacity: 0.7 };
}
function td(): React.CSSProperties {
  return { borderBottom: "1px solid #f2f2f2", padding: 10, fontSize: 14 };
}
function tdMono(): React.CSSProperties {
  return { ...td(), fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 12 };
}
