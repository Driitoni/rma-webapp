"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) return setMsg("❌ " + error.message);
    r.push("/dashboard");
  }

  return (
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="panel" style={{ width: "100%", maxWidth: 520, padding: 22 }}>
        <div className="badge">🔐 Secure Login</div>
        <h1 className="h1" style={{ marginTop: 10 }}>
          Welcome back
        </h1>
        <p className="p">Log in to continue your RMA program.</p>

        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 14 }}>
          <div>
            <label className="small">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div>
            <label className="small">Password</label>
            <input className="input" value={pass} onChange={(e) => setPass(e.target.value)} type="password" required />
          </div>

          {msg && <div className="small">{msg}</div>}

          <button className="btn btnPrimary" type="submit">
            Login
          </button>

          <button className="btn" type="button" onClick={() => r.push("/register")}>
            Create account
          </button>

          <button className="btn" type="button" onClick={() => r.push("/")}>
            Back home
          </button>
        </form>
      </div>
    </main>
  );
}
