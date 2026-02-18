"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type NavItem = { label: string; path: string; icon: string };

export default function AppShell({
  title,
  badge,
  children,
  navExtra,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  navExtra?: React.ReactNode;
}) {
  const r = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Profile", path: "/profile", icon: "👤" },
    { label: "Private", path: "/private", icon: "🔒" },
    { label: "Upgrade", path: "/upgrade", icon: "💳" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "280px 1fr" }}>
      {/* Sidebar desktop */}
      <aside
        className="panel"
        style={{
          borderRadius: 0,
          borderLeft: "none",
          borderTop: "none",
          borderBottom: "none",
          padding: 16,
          display: "none",
        }}
        id="sidebar-desktop"
      />

      {/* Real sidebar (we use CSS via inline media query trick) */}
      <style>{`
        @media (min-width: 900px){
          #sidebar-desktop{display:block;}
          #sidebar-mobileBtn{display:none;}
          #sidebar-drawer{display:none;}
          #mainArea{border-left: 1px solid var(--border);}
        }
        @media (max-width: 899px){
          #sidebar-desktop{display:none;}
        }
      `}</style>

      <aside
        id="sidebar-desktop"
        className="panel"
        style={{
          borderRadius: 0,
          borderLeft: "none",
          borderTop: "none",
          borderBottom: "none",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <div>
            <div style={{ fontWeight: 950 }}>Rich Mode Academy</div>
            <div className="small">Zero → Hero</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }} className="badge badgeGold">
          {badge ?? "⚡ Stay consistent"}
        </div>

        <nav style={{ marginTop: 14, display: "grid", gap: 8 }}>
          {nav.map((it) => (
            <button
              key={it.path}
              onClick={() => r.push(it.path)}
              className="btn"
              style={{
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: path === it.path ? "rgba(76,155,255,.12)" : "rgba(255,255,255,.03)",
                borderColor: path === it.path ? "rgba(76,155,255,.35)" : "var(--border)",
              }}
            >
              <span>{it.icon}</span>
              <span style={{ fontWeight: 900 }}>{it.label}</span>
            </button>
          ))}
          {navExtra}
        </nav>

        <div style={{ marginTop: 16 }} className="small">
          © {new Date().getFullYear()} RMA
        </div>
      </aside>

      {/* Main */}
      <div id="mainArea" style={{ minWidth: 0 }}>
        {/* Topbar */}
        <header
          className="panel"
          style={{
            borderRadius: 0,
            borderLeft: "none",
            borderRight: "none",
            borderTop: "none",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <button
              id="sidebar-mobileBtn"
              className="btn"
              onClick={() => setOpen(true)}
              style={{ padding: "10px 12px" }}
            >
              ☰
            </button>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 950, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {title}
              </div>
              <div className="small">Real system. Real progress.</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button className="btn" onClick={() => r.push("/")}>Home</button>
          </div>
        </header>

        {/* Content */}
        <main className="container">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="sidebar-drawer"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            zIndex: 50,
            display: "grid",
            gridTemplateColumns: "1fr",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="panel"
            style={{
              width: 320,
              maxWidth: "90vw",
              height: "100%",
              borderRadius: 0,
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 950 }}>RMA Menu</div>
              <button className="btn" onClick={() => setOpen(false)}>✕</button>
            </div>

            <nav style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {nav.map((it) => (
                <button
                  key={it.path}
                  onClick={() => {
                    r.push(it.path);
                    setOpen(false);
                  }}
                  className="btn"
                  style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span>{it.icon}</span>
                  <span style={{ fontWeight: 900 }}>{it.label}</span>
                </button>
              ))}
              {navExtra}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
