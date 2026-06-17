import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "ew-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Admin-only theme: apply the stored choice when the admin mounts, and revert
  // to light on unmount so leaving the admin never darkens the public site.
  // (The inline head script applies it pre-paint on a hard load of /admin.)
  useEffect(() => {
    let stored: Theme = "light";
    try {
      stored = localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch {
      // ignore storage failures
    }
    setThemeState(stored);
    applyTheme(stored);
    return () => applyTheme("light");
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

// Runs before React hydrates (injected into <head>) to set the theme class up
// front on a hard load, preventing a flash. Scoped to /admin only — the public
// site is always light regardless of the stored admin preference.
export const themeInitScript = `(function(){try{if(location.pathname.indexOf('/admin')!==0)return;if(localStorage.getItem('${STORAGE_KEY}')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;
