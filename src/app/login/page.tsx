"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

 async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    alert("❌ " + error.message);
    return;
  }

  r.push("/dashboard");
}


  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 14,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>Login</h1>
        <p style={{ opacity: 0.7, marginTop: 6 }}>Welcome back to RMA.</p>

        <label style={{ display: "block", marginTop: 16 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <label style={{ display: "block", marginTop: 12 }}>Password</label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          required
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <button
          style={{
            width: "100%",
            marginTop: 14,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #111",
            fontWeight: 800,
          }}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => r.push("/register")}
          style={{
            width: "100%",
            marginTop: 10,
            background: "transparent",
            border: "none",
            textDecoration: "underline",
            opacity: 0.8,
            cursor: "pointer",
          }}
        >
          No account? Register
        </button>
      </form>
    </main>
  );
}
