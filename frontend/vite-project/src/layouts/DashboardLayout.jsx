import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AuthContext from "../context/auth-context";

function getInitialDarkMode() {
  try {
    const savedTheme = localStorage.getItem("product-inventory-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme === "dark";
    }
  } catch {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";

    try {
      localStorage.setItem("product-inventory-theme", darkMode ? "dark" : "light");
    } catch {
      return;
    }
  }, [darkMode]);

  async function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className={`${darkMode ? "dark" : ""} flex min-h-screen bg-gray-100 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100`}>
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col sm:ml-64">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(4rem_+_env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-6 sm:pt-7">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
