import { useEffect, useState } from "react";
import { Activity, HandHeart, Heart, Mail, Users } from "lucide-react";
import { adminApi, type AdminAction, type Donation } from "@/lib/admin-api";

interface DashboardData {
  contacts_today: number;
  volunteers_today: number;
  donations_today: number;
  page_views_today: number;
  total_contacts: number;
  total_volunteers: number;
  total_donations: number;
  total_donated: number;
  recent_actions: AdminAction[];
  recent_donations: Donation[];
}

function statusBadge(status: string) {
  if (status === "completed") return "bg-success/15 text-success";
  if (status === "pending") return "bg-warm/20 text-warm-foreground";
  return "bg-destructive/15 text-destructive";
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const dashboard = await adminApi.getDashboard();
        setData(dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = data
    ? [
        {
          label: "Contacts Today",
          value: data.contacts_today,
          sub: `${data.total_contacts} total`,
          icon: Mail,
        },
        {
          label: "Volunteers Today",
          value: data.volunteers_today,
          sub: `${data.total_volunteers} total`,
          icon: Users,
        },
        {
          label: "Donations Today",
          value: data.donations_today,
          sub: `${data.total_donations} total`,
          icon: HandHeart,
        },
        {
          label: "Page Views Today",
          value: data.page_views_today,
          sub: "Today's activity",
          icon: Activity,
        },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="mt-1 text-muted-foreground">An overview of activity across the site.</p>
      </div>

      {error ? (
        <p className="mb-6 rounded-xl bg-destructive/10 px-4 py-3 text-destructive">{error}</p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))
          : cards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-elegant"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-4 font-display text-3xl font-bold text-foreground">{c.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
                </div>
              );
            })}
      </div>

      {!loading && data ? (
        <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
          <div className="absolute -bottom-12 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-foreground/80">Total donated</p>
              <p className="mt-2 font-display text-4xl font-bold">
                {data.total_donated.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-primary-foreground/70">
                Across all completed donations
              </p>
            </div>
            <Heart className="h-12 w-12 text-primary-foreground/30" fill="currentColor" />
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-display font-semibold text-foreground">Recent Donations</h3>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 rounded-lg bg-muted" />
              <div className="h-10 rounded-lg bg-muted" />
            </div>
          ) : data && data.recent_donations.length > 0 ? (
            <ul className="divide-y divide-border">
              {data.recent_donations.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.donor_name}</p>
                    <p className="text-xs text-muted-foreground">{d.donor_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {d.amount} {d.currency}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge(d.status)}`}
                    >
                      {d.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No donations yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-display font-semibold text-foreground">Recent Admin Activity</h3>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 rounded-lg bg-muted" />
              <div className="h-10 rounded-lg bg-muted" />
            </div>
          ) : data && data.recent_actions.length > 0 ? (
            <ul className="divide-y divide-border">
              {data.recent_actions.map((a) => (
                <li key={a.id} className="py-3">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{a.admin_email}</span>{" "}
                    <span className="capitalize">{a.action.replace(/_/g, " ")}</span>
                    {a.entity_type ? ` ${a.entity_type}` : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No admin activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
