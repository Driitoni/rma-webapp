"use client";

import React from "react";
import {  useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";




type BottomItem = { label: string; path: string; Icon: (p: { active: boolean }) => React.ReactNode };

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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isActive = (p: string) => path === p;

  const bottom: BottomItem[] = [
    { label: "Home", path: "/", Icon: HomeIcon },
    { label: "Dashboard", path: "/dashboard", Icon: GridIcon },
    { label: "Levels", path: "/levels", Icon: ChartIcon },
    { label: "Profile", path: "/profile", Icon: UserIcon },
  ];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    r.replace("/login");
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Topbar: Logo + Tier + Settings menu */}
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
        }}
      >
        {/* Logo placeholder (swap to image later) */}
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
          {/* Tier badge with verified style */}
          <span className={`badge ${tierLabel.toLowerCase() === "private" ? "badgeGold" : ""}`}>
            <span style={{ opacity: 0.95 }}>✔</span> Tier: <b style={{ marginLeft: 6 }}>{tierLabel}</b>
          </span>

          {/* Settings menu */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className="btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Profile menu"
              style={{ padding: "10px 12px" }}
            >
              <CogIcon />
            </button>

            {menuOpen && (
              <div
                className="panel"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 10px)",
                  width: 230,
                  padding: 10,
                }}
              >
                <button className="btn" style={menuBtn()} onClick={() => r.push("/settings")}>
                  <span style={{ width: 22, display: "grid", placeItems: "center" }}><CogMini /></span>
                  Settings
                </button>

                <button className="btn" style={menuBtn()} onClick={() => r.push("/wallet")}>
                  <span style={{ width: 22, display: "grid", placeItems: "center" }}><WalletIcon /></span>
                  Wallet
                </button>

                <button className="btn btnDanger" style={menuBtn()} onClick={logout}>
                  <span style={{ width: 22, display: "grid", placeItems: "center" }}><LogoutIcon /></span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container" style={{ paddingBottom: 96 }}>
        {children}
      </main>

      {/* Bottom navbar (mobile) */}
      <nav
        className="panel"
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          padding: 10,
          borderRadius: 20,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          zIndex: 30,
        }}
        aria-label="Bottom navigation"
      >
        {bottom.map((it) => {
          const active = isActive(it.path);
          return (
            <button
              key={it.path}
              onClick={() => r.push(it.path)}
              className="navBtn"
              aria-label={it.label}
              style={{
                borderRadius: 16,
                border: "1px solid " + (active ? "rgba(76,155,255,.35)" : "var(--border)"),
                background: active ? "rgba(76,155,255,.14)" : "rgba(255,255,255,.03)",
                cursor: "pointer",
                color: "var(--text)",
                padding: "10px 6px",
                display: "grid",
                placeItems: "center",
                gap: 6,
                transition: "transform .12s ease, background .18s ease, border-color .18s ease",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 14,
                  display: "grid",
                  placeItems: "center",
                  background: active ? "rgba(76,155,255,.16)" : "transparent",
                  boxShadow: active ? "0 10px 30px rgba(76,155,255,.18)" : "none",
                  transition: "all .18s ease",
                }}
              >
                <it.Icon active={active} />
              </div>

              <div
                className="small"
                style={{
                  color: active ? "rgba(234,240,255,.95)" : "var(--muted)",
                  fontWeight: active ? 900 : 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {it.label}
              </div>

              {/* Active dot */}
              <div
                style={{
                  width: active ? 18 : 0,
                  height: 3,
                  borderRadius: 999,
                  background: "rgba(76,155,255,.85)",
                  transition: "all .18s ease",
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* Hide bottom nav on desktop + avoid heavy effects on mobile */}
      <style>{`
        @media (min-width: 900px){
          nav.panel{display:none !important;}
          main.container{padding-bottom:24px !important;}
        }
        @media (max-width: 899px){
          header.panel{
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          .navBtn:active{
            transform: scale(0.98);
          }
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

/* ========= Simple inline SVG icons ========= */

function svgBase(active: boolean) {
  return {
    width: 20,
    height: 20,
    stroke: active ? "rgba(234,240,255,.98)" : "rgba(154,168,199,.95)",
    strokeWidth: 2,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function HomeIcon({ active }: { active: boolean }) {
  const p = svgBase(active);
  return (
    <svg viewBox="0 0 24 24" style={p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10.5V21h14V10.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  const p = svgBase(active);
  return (
    <svg viewBox="0 0 24 24" style={p}>
      <path d="M4 4h7v7H4z" />
      <path d="M13 4h7v7h-7z" />
      <path d="M4 13h7v7H4z" />
      <path d="M13 13h7v7h-7z" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  const p = svgBase(active);
  return (
    <svg viewBox="0 0 24 24" style={p}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M6.5 15l4-4 3 3 5-7" />
      <path d="M18.5 7.2V4.8H16.1" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  const p = svgBase(active);
  return (
    <svg viewBox="0 0 24 24" style={p}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Z" />
    </svg>
  );
}

function CogIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "rgba(234,240,255,.95)", strokeWidth: 2, fill: "none" }}>
      <path d="M12 15.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5Z" />
      <path d="M19.4 15a7.9 7.9 0 0 0 .1-6l-2.1.6a6 6 0 0 0-1.4-1.4l.6-2.1a7.9 7.9 0 0 0-6-.1l.6 2.1a6 6 0 0 0-1.4 1.4l-2.1-.6a7.9 7.9 0 0 0-.1 6l2.1-.6a6 6 0 0 0 1.4 1.4l-.6 2.1a7.9 7.9 0 0 0 6 .1l-.6-2.1a6 6 0 0 0 1.4-1.4Z" />
    </svg>
  );
}
function CogMini() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "rgba(234,240,255,.95)", strokeWidth: 2, fill: "none" }}>
      <path d="M12 15.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5Z" />
      <path d="M19.4 15a7.9 7.9 0 0 0 .1-6l-2.1.6a6 6 0 0 0-1.4-1.4l.6-2.1a7.9 7.9 0 0 0-6-.1l.6 2.1a6 6 0 0 0-1.4 1.4l-2.1-.6a7.9 7.9 0 0 0-.1 6l2.1-.6a6 6 0 0 0 1.4 1.4l-.6 2.1a7.9 7.9 0 0 0 6 .1l-.6-2.1a6 6 0 0 0 1.4-1.4Z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "rgba(234,240,255,.95)", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }}>
      <path d="M3.5 7.5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
      <path d="M17 11.5h4.5" />
      <path d="M18.2 14.5h3.3" />
      <path d="M3.5 7.5V6.5a2 2 0 0 1 2-2h12.5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "rgba(234,240,255,.95)", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }}>
      <path d="M10 17l-5-5 5-5" />
      <path d="M5 12h11" />
      <path d="M16 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
    </svg>
  );
}
