import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, HandHeart, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Counter } from "@/components/Counter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { fallbackImpactStats, fallbackPrograms, fallbackTestimonials } from "@/lib/fallback-content";
import { getIcon } from "@/lib/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eagle's Wings Empowerment — Donate to Children & Elderly in Nigeria" },
      {
        name: "description",
        content:
          "Join our mission to restore dignity to vulnerable children, elderly, and empower women & youth across Nigeria. Donate, volunteer, or partner with us.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: stats, loading: statsLoading } = useApi(api.getImpactStats);
  const { data: programs, loading: programsLoading } = useApi(api.getPrograms);
  const { data: testimonials, loading: testimonialsLoading } = useApi(api.getTestimonials);

  const isLoading = statsLoading || programsLoading || testimonialsLoading;
  const displayStats = stats?.length ? stats : fallbackImpactStats;
  const displayPrograms = programs?.length ? programs : fallbackPrograms;
  const displayTestimonials = testimonials?.length ? testimonials : fallbackTestimonials;

  return (
    <>
      <Hero />

      {isLoading ? (
        <section className="py-20 lg:py-28">
          <LoadingSpinner message="Loading latest impact..." />
        </section>
      ) : (
        <>
          {/* Impact stats */}
          <section className="relative -mt-12 lg:-mt-16 z-20 container mx-auto px-4 lg:px-8">
            <div className="bg-card rounded-3xl shadow-elegant border border-border px-6 py-10 sm:px-10 sm:py-12 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-y-0 lg:divide-x lg:divide-border">
              {displayStats.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <div key={s.id} className="flex flex-col items-center text-center lg:px-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft mb-4">
                      {Icon ? <Icon className="h-6 w-6" /> : null}
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold font-display text-foreground">
                      <Counter to={s.value} suffix={s.suffix || ""} />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2 leading-snug">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mission strip */}
          <Section
            eyebrow="Our Mission"
            align="center"
            title={
              <>
                A bridge of hope between <span className="text-primary">Europe and Nigeria</span>.
              </>
            }
            description="We channel global compassion into measurable local impact — restoring dignity to those society has forgotten."
          />

          {/* Programs */}
          <section className="pb-20 lg:pb-28">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                {displayPrograms.map((p) => {
                  const Icon = getIcon(p.icon);
                  return (
                    <Link
                      key={p.id}
                      to={
                        `/programs/${p.slug}` as
                          | "/programs/motherless-home"
                          | "/programs/elderly-care"
                          | "/programs/empowerment"
                      }
                      className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.title}
                            loading="lazy"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : null}
                      </div>
                      <div className="p-6 lg:p-7">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                          {Icon ? <Icon className="h-5 w-5" /> : null}
                        </div>
                        <h3 className="text-xl font-bold font-display">{p.title}</h3>
                        <p className="mt-2 text-muted-foreground leading-relaxed">{p.summary}</p>
                        <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                          Learn more <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 lg:py-28 bg-gradient-soft border-y border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <div className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
                  Voices
                </div>
                <h2 className="text-3xl lg:text-5xl font-bold text-balance">
                  From the people we serve.
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {displayTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-card border border-border rounded-2xl p-7 shadow-soft"
                  >
                    <Quote className="h-6 w-6 text-primary/40" />
                    <p className="mt-4 text-foreground/90 leading-relaxed">{t.quote}</p>
                    <div className="mt-6 pt-5 border-t border-border">
                      <div className="font-semibold">{t.author_name}</div>
                      {t.author_role ? (
                        <div className="text-sm text-muted-foreground">{t.author_role}</div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 lg:p-16 text-background shadow-elegant">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight text-balance">
                Your gift today writes someone's story tomorrow.
              </h2>
              <p className="mt-5 text-lg text-background/85 leading-relaxed">
                Every euro and every naira goes directly to programs that change lives. Transparent.
                Accountable. Loving.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="donate" size="xl">
                  <Link to="/donate">
                    <Heart className="h-5 w-5" /> Donate now
                  </Link>
                </Button>
                <Button asChild variant="outlineLight" size="xl">
                  <Link to="/volunteer">
                    <HandHeart className="h-5 w-5" /> Become a volunteer
                  </Link>
                </Button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-success/40 blur-3xl" />
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-primary-glow/30 blur-3xl" />
          </div>
        </div>
      </section>
    </>
  );
}
