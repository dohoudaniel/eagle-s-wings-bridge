import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";
import { Heart, Globe, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";
import { fallbackTimeline } from "@/lib/fallback-content";
import { useSiteSettings } from "@/lib/site-settings";
import { useApi } from "@/hooks/use-api";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Eagle's Wings Empowerment" },
      {
        name: "description",
        content:
          "Our story, mission, and the founders behind Eagle's Wings — a humanitarian bridge between Europe and Nigeria.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Heart,
    title: "Dignity first",
    desc: "Every person we serve is met with respect, not pity.",
  },
  {
    icon: Globe,
    title: "Two continents",
    desc: "Active teams in Nigeria & Europe, one shared mission.",
  },
  { icon: Award, title: "Transparent", desc: "Detailed impact reporting on every program we run." },
  { icon: Users, title: "Community-led", desc: "Programs are co-designed with local leaders." },
];

function AboutPage() {
  const { getValue } = useSiteSettings();
  const { data: rawTimeline, loading: timelineLoading } = useApi(api.getTimeline);
  const { data: teamMembers, loading: teamLoading } = useApi(api.getTeamMembers);
  const timeline = rawTimeline?.length ? rawTimeline : fallbackTimeline;

  return (
    <>
      <PageHeader
        eyebrow={getValue("about_eyebrow", "Our Story")}
        title={getValue("about_title", "Built on dignity. Grown by community.")}
        description={getValue(
          "about_description",
          "Eagle's Wings Empowerment exists because no child should grow up forgotten and no elder should die alone."
        )}
      />

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
              {getValue("about_mission_label", "Mission")}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              {getValue("about_mission_title", "Restore dignity. Open doors. Build futures.")}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {getValue(
                "about_mission_text",
                "We serve vulnerable children, the elderly in need of care, and women & youth seeking opportunity. Every program is rooted in long-term outcomes, not short-term aid."
              )}
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
              {getValue("about_vision_label", "Vision")}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              {getValue("about_vision_title", "A trusted humanitarian bridge between continents.")}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {getValue(
                "about_vision_text",
                "Connecting Europe's generosity with Nigeria's needs — transparently, accountably, and with love at the center."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="p-6 rounded-2xl border border-border bg-card shadow-soft">
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-gradient-primary text-primary-foreground mb-4">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold font-display text-lg">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      {teamLoading || (teamMembers && teamMembers.length > 0) ? (
        <section className="py-20 lg:py-28 bg-gradient-soft border-y border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-14">
              <div className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
                {getValue("about_team_eyebrow", "Our Team")}
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold">
                {getValue("about_team_title", "The people behind the mission")}
              </h2>
            </div>
            {teamLoading ? (
              <LoadingSpinner message="Loading team..." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers?.map((member) => (
                  <div key={member.id} className="bg-white rounded-2xl border border-border p-6 text-center shadow-soft">
                    <div className="h-24 w-24 mx-auto rounded-full bg-slate-100 overflow-hidden mb-4">
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-2xl font-bold text-slate-400">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    {member.bio ? <p className="text-sm text-muted-foreground mt-3">{member.bio}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Timeline */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
              {getValue("about_journey_label", "Our Journey")}
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold">
              {getValue("about_journey_title", "From a single meal to a movement")}
            </h2>
          </div>
          {timelineLoading ? (
            <LoadingSpinner message="Loading journey..." />
          ) : (
            <div className="relative space-y-10 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border">
              {timeline.map((t) => (
                <div key={t.id} className="relative pl-14">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-bold shadow-soft">
                    {t.year.slice(-2)}
                  </div>
                  <div className="text-sm font-semibold text-primary">{t.year}</div>
                  <h3 className="mt-1 text-xl font-bold font-display">{t.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 lg:py-28 text-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <h2 className="text-3xl lg:text-4xl font-bold">Walk this journey with us.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you give, volunteer, or partner — there's a place for you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="donate" size="lg">
              <Link to="/donate">Donate</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/volunteer">Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
