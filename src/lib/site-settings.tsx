import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import type { SiteSetting } from "./types";

interface SiteSettingsContextValue {
  settings: SiteSetting[];
  loading: boolean;
  getValue: (key: string, fallback?: string) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: [],
  loading: true,
  getValue: (_key, fallback = "") => fallback ?? "",
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSiteSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function getValue(key: string, fallback = ""): string {
    return settings.find((s) => s.key === key)?.value ?? fallback;
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, getValue }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
