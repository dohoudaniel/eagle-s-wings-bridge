import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

interface Stats {
  contacts: number;
  volunteers: number;
  newsletter: number;
  programs: number;
  stories: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [contacts, volunteers, newsletter, programs, stories] = await Promise.all([
          adminApi.listContacts(),
          adminApi.listVolunteers(),
          adminApi.listNewsletterSubscribers(),
          adminApi.listPrograms(),
          adminApi.listStories(),
        ]);
        setStats({
          contacts: contacts.length,
          volunteers: volunteers.length,
          newsletter: newsletter.length,
          programs: programs.length,
          stories: stories.length,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Contact Messages", value: stats?.contacts ?? 0, color: "bg-blue-500" },
    { label: "Volunteer Applications", value: stats?.volunteers ?? 0, color: "bg-green-500" },
    { label: "Newsletter Subscribers", value: stats?.newsletter ?? 0, color: "bg-purple-500" },
    { label: "Programs", value: stats?.programs ?? 0, color: "bg-orange-500" },
    { label: "Stories", value: stats?.stories ?? 0, color: "bg-pink-500" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
                <div className="h-10 w-16 bg-slate-200 rounded" />
              </div>
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${card.color} opacity-20`} />
                </div>
              </div>
            ))}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Welcome to the admin panel</h3>
        <p className="text-blue-800/80 text-sm leading-relaxed">
          Manage your website content, review form submissions, and upload images from here. Changes are saved to the
          FastAPI backend and reflected on the public site immediately.
        </p>
      </div>
    </div>
  );
}
