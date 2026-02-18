"use client";

import AppShell from "@/components/AppShell";

export default function LevelsPage() {
  return (
    <AppShell title="Levels" tierLabel="Free">
      <div className="panel" style={{ padding: 18 }}>
        <h1 className="h1">Levels</h1>
        <p className="p">This is where your levels of your dedication are going to be.</p>
      </div>
    </AppShell>
  );
}
