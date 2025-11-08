"use client";
import { useState, useEffect } from "react";
import { User } from "@/lib/types";

type AuthMode = "login" | "register";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [region, setRegion] = useState("Delhi");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("ksh_token");
    const storedUser = localStorage.getItem("ksh_user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
      const body =
        authMode === "register"
          ? { name, email, password, preferredLanguage, region }
          : { email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");

      const { token, user } = data;
      localStorage.setItem("ksh_token", token);
      localStorage.setItem("ksh_user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ksh_token");
    localStorage.removeItem("ksh_user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    authMode,
    setAuthMode,
    authLoading,
    authError,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    preferredLanguage,
    setPreferredLanguage,
    region,
    setRegion,
    handleAuth,
    handleLogout,
  };
};
