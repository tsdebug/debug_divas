// frontend/components/ForgotPassword.tsx
import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/request-password-reset`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.msg || "If an account exists you will receive a link.");
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
      <button type="submit">Send reset link</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
