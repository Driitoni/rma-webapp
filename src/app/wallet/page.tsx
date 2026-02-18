"use client";

import AppShell from "@/components/AppShell";

export default function WalletPage() {
  return (
    <AppShell title="Wallet" tierLabel="Free">
      <div className="panel" style={{ padding: 18 }}>
        <h1 className="h1">Wallet</h1>
        <p className="p">Later: deposits, payments, and membership status.</p>
      </div>
    </AppShell>
  );
}
