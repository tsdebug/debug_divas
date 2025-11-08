import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { MOCK_USER } from "@/lib/constants"; // Import mock user

type AuthMode = "login" | "register";

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
    // Simulate checking for an existing session
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");
    if (storedAuth === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (authMode === "register") {
      if (!email || !password || !name) {
        setAuthError("Please fill all required fields");
        setAuthLoading(false);
        return;
      }
      // Simulate successful registration
      const newUser: User = {
        id: "user-" + Date.now(),
        name,
        email,
        preferredLanguage,
        region,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else { // Login mode
      if (!email || !password) {
        setAuthError("Please enter email and password");
        setAuthLoading(false);
        return;
      }
      // Simulate successful login with mock user
      setUser(MOCK_USER);
      localStorage.setItem("user", JSON.stringify(MOCK_USER));
    }

    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    setAuthLoading(false);
  };

  const handleGuestAccess = () => {
    const guestUser: User = {
      id: "guest",
      name: "Guest User",
      email: "guest@example.com",
      preferredLanguage: "en",
      region: "Delhi"
    };
    setIsAuthenticated(true);
    setUser(guestUser);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(guestUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setEmail("");
    setPassword("");
    setName("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
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
    handleGuestAccess,
    handleLogout,
  };
};