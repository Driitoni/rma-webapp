"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type BottomItem = { label: string; path: string; icon: string };

export default function AppShell({
  title,
  tierLabel,
  children,
}: {
  title: string;
  tierLabel: string; // "Free" | "Private"
  children: React.ReactNode;
}) {
  const r = useRouter();
  const path = usePathname();

  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const bottom: BottomItem[] = [
    { label: "Home", path: "/", icon: "🏠" },
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Levels", path: "/levels", icon: "📈" },
    { label: "Profile", path: "/profile", icon: "👤" }, // taps open profile page; menu button is separate
  ];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    r.replace("/login");
  }

  const isActive = (p: string) => path === p;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Topbar: Logo + Tier + Profile menu */}
      <header
        className="panel"
        style={{
          borderRadius: 0,
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo area (we'll swap to your real logo later) */}
        <button
          onClick={() => r.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Go home"
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: "1px solid rgba(246,195,91,.35)",
              background: "rgba(246,195,91,.10)",
              display: "grid",
              placeItems: "center",
              fontWeight: 950,
            }}
          >
            R
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 950, fontSize: 14 }}>RMA</div>
            <div className="small" style={{ marginTop: 2 }}>
              {title}
            </div>
          </div>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Tier badge with "verified" icon */}
          <span className={`badge ${tierLabel.toLowerCase() === "private" ? "badgeGold" : ""}`}>
            ✅ Tier: <b style={{ marginLeft: 6 }}>{tierLabel}</b>
          </span>

          {/* Profile menu */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className="btn"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Profile menu"
              style={{ padding: "10px 12px" }}
            >
              ⚙️
            </button>

            {profileOpen && (
              <div
                className="panel"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 10px)",
                  width: 220,
                  padding: 10,
                }}
              >
                <button className="btn" style={menuBtn()} onClick={() => r.push("/settings")}>
                  ⚙️ Settings
                </button>
                <button className="btn" style={menuBtn()} onClick={() => r.push("/wallet")}>
                  👛 Wallet
                </button>
                <button className="btn btnDanger" style={menuBtn()} onClick={logout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="container" style={{ paddingBottom: 86 }}>
        {children}
      </main>

      {/* Mobile bottom navbar */}
      <nav
        className="panel"
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          padding: 10,
          borderRadius: 18,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          zIndex: 30,
        }}
      >
        {bottom.map((it) => (
          <button
            key={it.path}
            onClick={() => r.push(it.path)}
            className="btn"
            style={{
              padding: 10,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: isActive(it.path) ? "rgba(76,155,255,.14)" : "rgba(255,255,255,.03)",
              borderColor: isActive(it.path) ? "rgba(76,155,255,.35)" : "var(--border)",
            }}
            aria-label={it.label}
          >
            <div style={{ fontSize: 18 }}>{it.icon}</div>
            <div className="small" style={{ marginTop: 4 }}>
              {it.label}
            </div>
          </button>
        ))}
      </nav>

      {/* Hide bottom nav on desktop */}
      <style>{`
        @media (min-width: 900px){
          nav{left: auto !important; right: auto !important;}
        }
        @media (min-width: 900px){
          nav.panel{display:none !important;}
          main.container{padding-bottom:24px !important;}
        }
      `}</style>
    </div>
  );
}

function menuBtn(): React.CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  };
}
