"use client";
// deploy test
// deploy test
import { useRouter } from "next/navigation";

export default function HomePage() {
  const r = useRouter();

  return (
    <main style={{ minHeight: "100vh", padding: 24, display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 900, border: "1px solid #ddd", borderRadius: 16, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 34, fontWeight: 950, lineHeight: 1.1 }}>
              Rich Mode Academy
            </h1>
            <p style={{ opacity: 0.7, marginTop: 10 }}>
              Zero → Hero in 30 days: Money Systems • Trading (XAUUSD) • Mindset • Discipline
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => r.push("/login")} style={btnPrimary()}>
              Login
            </button>
            <button onClick={() => r.push("/register")} style={btn()}>
              Register
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 18 }}>
          <Card title="🕘 Morning Drop" text="Mindset lesson + mission + rule reminder." />
          <Card title="🕛 Midday Drop" text="Money method + small task + skill to build." />
          <Card title="🌙 Evening Drop" text="Trading bias + levels + setup explanation." />
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => r.push("/dashboard")} style={btn()}>
            Go to Dashboard
          </button>
          <button onClick={() => r.push("/private")} style={btn()}>
            Private Area
          </button>
        </div>

        <p style={{ marginTop: 14, opacity: 0.65, fontSize: 13 }}>
          Tip: If you’re not logged in, Dashboard/Private will redirect you to login or upgrade.
        </p>
      </div>
    </main>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <p style={{ opacity: 0.8, marginTop: 6 }}>{text}</p>
    </div>
  );
}

function btn(): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111",
    cursor: "pointer",
    background: "#fff",
    fontWeight: 800,
  };
}
function btnPrimary(): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111",
    cursor: "pointer",
    background: "#111",
    color: "#fff",
    fontWeight: 900,
  };
}
