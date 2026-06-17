import {
  Banknote,
  BarChart3,
  Calendar,
  Heart,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Moon,
  Settings,
  Sun,
  Users,
  UsersRound,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

export type AdminTab =
  | "dashboard"
  | "programs"
  | "stories"
  | "testimonials"
  | "hero-slides"
  | "timeline"
  | "impact-stats"
  | "site-settings"
  | "donation-config"
  | "contacts"
  | "volunteers"
  | "newsletter"
  | "storage"
  | "team-members"
  | "donations";

const contentItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "programs", label: "Programs", icon: Heart },
  { id: "stories", label: "Stories", icon: Megaphone },
  { id: "testimonials", label: "Testimonials", icon: Users },
  { id: "hero-slides", label: "Hero Slides", icon: Image },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "impact-stats", label: "Impact Stats", icon: BarChart3 },
  { id: "site-settings", label: "Site Settings", icon: Settings },
  { id: "donation-config", label: "Donation Config", icon: Heart },
  { id: "team-members", label: "Team Members", icon: UsersRound },
];

const submissionItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "contacts", label: "Contacts", icon: Mail },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "newsletter", label: "Newsletter", icon: Inbox },
  { id: "donations", label: "Donations", icon: Banknote },
];

export function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
}: {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
}) {
  function NavItem({
    id,
    label,
    icon: Icon,
  }: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
  }) {
    const active = activeTab === id;
    return (
      <button
        type="button"
        onClick={() => onTabChange(id)}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          active
            ? "bg-gradient-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </button>
    );
  }

  function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
      <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {children}
      </div>
    );
  }

  function ThemeRow() {
    const { theme, toggle } = useTheme();
    const isDark = theme === "dark";
    return (
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {isDark ? "Light mode" : "Dark mode"}
      </button>
    );
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-soft">
          <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold text-foreground">Eagle's Wings</div>
          <div className="text-xs text-muted-foreground">Admin Panel</div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div>
          <SectionLabel>Overview</SectionLabel>
          <div className="space-y-1">
            <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavItem id="storage" label="Media Library" icon={Image} />
          </div>
        </div>

        <div>
          <SectionLabel>Content</SectionLabel>
          <div className="space-y-1">
            {contentItems.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Submissions</SectionLabel>
          <div className="space-y-1">
            {submissionItems.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1 border-t border-border p-4">
        <ThemeRow />
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
