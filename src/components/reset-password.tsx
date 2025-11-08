// frontend/pages/reset-password.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { setMsg("Missing token"); return; }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/reset-password`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ token, new_password: password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Password reset. You can sign in now.");
    } else {
      setMsg(data.detail || "Error resetting password.");
    }
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="New password" />
        <button type="submit">Reset Password</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
