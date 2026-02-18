"use client";

import AppShell from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings" tierLabel="Free">
      <div className="panel" style={{ padding: 18 }}>
        <h1 className="h1">Settings</h1>
        <p className="p">Profile settings, notifications, and preferences go here.</p>
      </div>
    </AppShell>
  );
}
