import {
  BarChart3,
  Calendar,
  Heart,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";

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
  | "storage";

const contentItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "programs", label: "Programs", icon: Heart },
  { id: "stories", label: "Stories", icon: Megaphone },
  { id: "testimonials", label: "Testimonials", icon: Users },
  { id: "hero-slides", label: "Hero Slides", icon: Image },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "impact-stats", label: "Impact Stats", icon: BarChart3 },
  { id: "site-settings", label: "Site Settings", icon: Settings },
  { id: "donation-config", label: "Donation Config", icon: Heart },
];

const submissionItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "contacts", label: "Contacts", icon: Mail },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "newsletter", label: "Newsletter", icon: Inbox },
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
  function NavItem({ id, label, icon: Icon }: { id: AdminTab; label: string; icon: React.ElementType }) {
    const active = activeTab === id;
    return (
      <button
        type="button"
        onClick={() => onTabChange(id)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
          active
            ? "bg-primary text-primary-foreground"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <div className="font-bold">Eagle's Wings</div>
            <div className="text-xs text-slate-400">Admin Panel</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Overview</div>
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="storage" label="Image Library" icon={Image} />
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</div>
          <div className="space-y-1">
            {contentItems.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submissions</div>
          <div className="space-y-1">
            {submissionItems.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
