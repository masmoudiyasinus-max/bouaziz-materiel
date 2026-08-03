"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AdminThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-admin-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("admin_theme", nextTheme);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-admin-theme={theme} style={{ display: "contents" }}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
