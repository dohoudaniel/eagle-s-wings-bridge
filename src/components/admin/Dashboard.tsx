import { useEffect, useState } from "react";
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

  const stats = data
    ? [
        { label: "Contacts Today", value: data.contacts_today, sub: `${data.total_contacts} total` },
        { label: "Volunteers Today", value: data.volunteers_today, sub: `${data.total_volunteers} total` },
        { label: "Donations Today", value: data.donations_today, sub: `${data.total_donations} total` },
        { label: "Page Views Today", value: data.page_views_today, sub: "Activity" },
        {
          label: "Total Donated",
          value: `${data.total_donated.toLocaleString()}`,
          sub: "Completed donations",
        },
      ]
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>

      {error ? <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-6">{error}</p> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
                <div className="h-10 w-16 bg-slate-200 rounded" />
              </div>
            ))
          : stats.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
              </div>
            ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Donations</h3>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          ) : data && data.recent_donations.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {data.recent_donations.map((d) => (
                <li key={d.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{d.donor_name}</p>
                    <p className="text-xs text-slate-500">{d.donor_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {d.amount} {d.currency}
                    </p>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        d.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : d.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No donations yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Admin Activity</h3>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          ) : data && data.recent_actions.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {data.recent_actions.map((a) => (
                <li key={a.id} className="py-3">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{a.admin_email}</span>{" "}
                    <span className="capitalize">{a.action.replace("_", " ")}</span>
                    {a.entity_type ? ` ${a.entity_type}` : null}
                  </p>
                  <p className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No admin activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
