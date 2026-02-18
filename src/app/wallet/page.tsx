"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/AppShell";

export default function WalletPage() {
  const r = useRouter();
  const [tier, setTier] = useState<"free" | "private">("free");

  // Demo balances (later connect real payments/crypto)
  const [usd, setUsd] = useState(0);
  const [points, setPoints] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return r.replace("/login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", data.user.id)
        .single();

      setTier((prof?.tier ?? "free") as any);

      // demo
      setUsd(125.5);
      setPoints(30);
    })();
  }, [r]);

  return (
    <AppShell title="Wallet" tierLabel={tier === "private" ? "Private" : "Free"}>
      <div className="panel" style={{ padding: 18 }}>
        <div className="row">
          <div>
            <h1 className="h1">Wallet</h1>
            <p className="p">Balances, deposits, withdrawals (exchange-style).</p>
          </div>
          <div className="badge">🔒 Secure</div>
        </div>

        <div className="grid grid3" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="small">Available Balance</div>
            <div style={{ fontSize: 28, fontWeight: 950, marginTop: 6 }}>${usd.toFixed(2)}</div>
            <div className="small" style={{ marginTop: 6 }}>USD (demo)</div>
          </div>

          <div className="card">
            <div className="small">RMA Points</div>
            <div style={{ fontSize: 28, fontWeight: 950, marginTop: 6 }}>{points}</div>
            <div className="small" style={{ marginTop: 6 }}>Rewards / streak bonuses</div>
          </div>

          <div className="card">
            <div className="small">Membership</div>
            <div style={{ fontSize: 18, fontWeight: 950, marginTop: 8 }}>
              {tier === "private" ? "✅ Private" : "Free"}
            </div>
            <div className="small" style={{ marginTop: 6 }}>
              {tier === "private" ? "Verified access enabled." : "Upgrade to unlock private drops."}
            </div>
          </div>
        </div>

        <div className="grid grid3" style={{ marginTop: 14 }}>
          <div className="card">
            <div className="h2">Deposit</div>
            <p className="p">Add funds (Card / PayPal / Crypto soon).</p>
            <button className="btn btnPrimary" onClick={() => setMsg("Deposit flow coming next (Stripe/PayPal/Crypto).")} style={{ marginTop: 10 }}>
              Deposit
            </button>
          </div>

          <div className="card">
            <div className="h2">Withdraw</div>
            <p className="p">Withdraw to your method (soon).</p>
            <button className="btn" onClick={() => setMsg("Withdraw flow coming next.")} style={{ marginTop: 10 }}>
              Withdraw
            </button>
          </div>

          <div className="card">
            <div className="h2">History</div>
            <p className="p">Deposits, withdrawals, upgrades.</p>
            <button className="btn" onClick={() => setMsg("Transaction history page coming next.")} style={{ marginTop: 10 }}>
              View History
            </button>
          </div>
        </div>

        {msg && <div className="small" style={{ marginTop: 12 }}>{msg}</div>}
      </div>
    </AppShell>
  );
}
