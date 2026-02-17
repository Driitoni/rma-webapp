"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabaseClient";



export default function RegisterPage() {
  const r = useRouter();
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  alert("Creating account...");

  const { error } = await supabase.auth.signUp({
    email,
    password: pass,
  });

  if (error) {
    alert("❌ " + error.message);
    return;
  }

  alert("✅ Account created! Check your email to confirm (if enabled).");
  r.push("/login");
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
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>Create account</h1>
        <p style={{ opacity: 0.7, marginTop: 6 }}>
          Zero → Hero starts now.
        </p>

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

        <label style={{ display: "block", marginTop: 12 }}>
          Password (8+)
        </label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          minLength={8}
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
          Register
        </button>

        <button
          type="button"
          onClick={() => r.push("/login")}
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
          Already have an account? Login
        </button>
      </form>
    </main>
  );
}
