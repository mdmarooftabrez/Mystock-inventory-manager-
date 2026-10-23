import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import AuthContext from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadUser() {
      try {
        const data = await apiRequest("/auth/me");
        if (isCurrent) setUser(data.user || null);
      } catch (error) {
        if (error.status !== 401) {
          console.error("Could not load your account:", error.message);
        }
        if (isCurrent) setUser(null);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    loadUser();
    return () => {
      isCurrent = false;
    };
  }, []);

  async function authenticate(path, body) {
    const data = await apiRequest(path, { method: "POST", body });
    setUser(data.user);
    return data.user;
  }

  function login(email, password) {
    return authenticate("/auth/login", { email, password });
  }

  function register(name, email, password) {
    return authenticate("/auth/register", { name, email, password });
  }

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Could not log out:", error.message);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
