"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
    });

    if (error) return setMsg("❌ " + error.message);

    setMsg("✅ Account created. Now login.");
    r.push("/login");
  }

  return (
    <main className="container auth-page" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="panel" style={{ width: "100%", maxWidth: 520, padding: 22 }}>
        <Link href="/" className="member-brand auth-brand"><b>R</b><span>RICH MODE<small>ACADEMY</small></span></Link>
        <div className="badge badgeGold">YOUR NEXT CHAPTER</div>
        <h1 className="h1" style={{ marginTop: 10 }}>
          Create your account
        </h1>
        <p className="p">Build a daily learning rhythm around mindset, money and markets.</p>

        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 14 }}>
          <div>
            <label className="small">Email</label>
            <input aria-label="Email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div>
            <label className="small">Password (8+)</label>
            <input aria-label="Password" autoComplete="new-password" className="input" value={pass} onChange={(e) => setPass(e.target.value)} type="password" minLength={8} required />
          </div>

          {msg && <div className="small">{msg}</div>}

          <button className="btn btnPrimary" type="submit">
            Register
          </button>

          <button className="btn" type="button" onClick={() => r.push("/login")}>
            Already have an account? Login
          </button>

          <button className="btn" type="button" onClick={() => r.push("/")}>
            Back home
          </button>
        </form>
      </div>
    </main>
  );
}
