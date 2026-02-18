"use client";

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
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="panel" style={{ width: "100%", maxWidth: 520, padding: 22 }}>
        <div className="badge badgeGold">👑 Start your 30-day run</div>
        <h1 className="h1" style={{ marginTop: 10 }}>
          Create your account
        </h1>
        <p className="p">Join the system. Take action daily. Become unrecognizable.</p>

        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 14 }}>
          <div>
            <label className="small">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div>
            <label className="small">Password (8+)</label>
            <input className="input" value={pass} onChange={(e) => setPass(e.target.value)} type="password" minLength={8} required />
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
