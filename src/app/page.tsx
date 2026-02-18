"use client";
// deploy test
// deploy test
import { useRouter } from "next/navigation";

export default function HomePage() {
  const r = useRouter();

  return (
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="panel" style={{ width: "100%", padding: 22 }}>
        <div className="row">
          <div>
            <div className="badge badgeGold">👑 RMA • Zero → Hero</div>
            <h1 className="h1" style={{ marginTop: 10 }}>
              Rich Mode Academy
            </h1>
            <p className="p">
              30 days to build money systems, discipline, mindset, and a trading edge (XAUUSD).
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" onClick={() => r.push("/register")}>
              Start Free
            </button>
            <button className="btn" onClick={() => r.push("/login")}>
              Login
            </button>
            <button className="btn" onClick={() => r.push("/dashboard")}>
              Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid3" style={{ marginTop: 16 }}>
          <Feature
            title="🕘 Morning Drop"
            text="Mindset lesson + mission + rule reminder to win the day."
          />
          <Feature
            title="🕛 Midday Drop"
            text="Money method + small task + skill to build real income."
          />
          <Feature
            title="🌙 Evening Drop"
            text="Trading bias + key levels + setup explanation + warning."
          />
        </div>

        <div className="grid grid3" style={{ marginTop: 14 }}>
          <Feature
            title="⚔️ Discipline System"
            text="Daily accountability to kill excuses and build consistency."
          />
          <Feature
            title="📈 XAUUSD Edge"
            text="Structured approach to entries, risk, and emotional control."
          />
          <Feature
            title="🔒 Private Members"
            text="Locked area for premium drops, challenges, and priority access."
          />
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => r.push("/private")}>
            Private Area
          </button>
          <button className="btn" onClick={() => r.push("/upgrade")}>
            Upgrade
          </button>
          <button className="btn" onClick={() => r.push("/profile")}>
            Profile
          </button>
        </div>

        <p className="small" style={{ marginTop: 14 }}>
          If you’re not logged in, Dashboard/Private will redirect you to Login or Upgrade automatically.
        </p>
      </div>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="card">
      <div className="h2">{title}</div>
      <p className="p" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}
