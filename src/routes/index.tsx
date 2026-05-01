import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, HandHeart, Users, Home, Sparkles, ArrowRight, Quote, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Counter } from "@/components/Counter";
import programChildren from "@/assets/program-children.jpg";
import programElderly from "@/assets/program-elderly.jpg";
import programEmpowerment from "@/assets/program-empowerment.jpg";

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

const programs = [
  {
    img: programChildren,
    icon: Home,
    title: "Motherless Homes",
    desc: "Safe shelter, education, and family for children who have lost everything.",
    href: "/programs/motherless-home",
  },
  {
    img: programElderly,
    icon: Heart,
    title: "Elderly Care",
    desc: "Daily meals, medical attention, and companionship for forgotten seniors.",
    href: "/programs/elderly-care",
  },
  {
    img: programEmpowerment,
    icon: Sparkles,
    title: "Empowerment",
    desc: "Vocational training and micro-grants for women and youth to thrive.",
    href: "/programs/empowerment",
  },
] as const;

const stats = [
  { n: 1240, suffix: "+", label: "Children supported", icon: Users },
  { n: 380, suffix: "+", label: "Elderly cared for", icon: Heart },
  { n: 95, suffix: "+", label: "Volunteers engaged", icon: HandHeart },
  { n: 12, suffix: "", label: "Communities served", icon: MapPin },
] as const;

const testimonials = [
  {
    quote: "Eagle's Wings gave my grandchildren a chance I could never afford. They are now in school, fed, and full of hope.",
    name: "Mama Ngozi",
    role: "Beneficiary, Enugu",
  },
  {
    quote: "Donating monthly from Berlin felt small until I visited and saw the home my contributions helped build. Real, transparent impact.",
    name: "Lukas Berger",
    role: "Donor, Germany",
  },
  {
    quote: "Volunteering here changed how I see service. The dignity they bring to every elder is something I'll carry forever.",
    name: "Amaka O.",
    role: "Volunteer, Lagos",
  },
];

function HomePage() {
  return (
    <>
      <Hero />

      {/* Impact stats */}
      <section className="relative -mt-20 z-20 container mx-auto px-4 lg:px-8">
        <div className="bg-card rounded-3xl shadow-elegant border border-border p-8 lg:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground mb-3">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold font-display text-foreground">
                <Counter to={s.n} suffix={s.suffix} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission strip */}
      <Section
        eyebrow="Our Mission"
        align="center"
        title={<>A bridge of hope between <span className="text-primary">Europe and Nigeria</span>.</>}
        description="We channel global compassion into measurable local impact — restoring dignity to those society has forgotten."
      />

      {/* Programs */}
      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {programs.map((p) => (
              <Link
                key={p.title}
                to={p.href}
                className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 lg:p-7">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold font-display">{p.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{p.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-gradient-soft border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">Voices</div>
            <h2 className="text-3xl lg:text-5xl font-bold text-balance">From the people we serve.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-7 shadow-soft">
                <Quote className="h-6 w-6 text-primary/40" />
                <p className="mt-4 text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 lg:p-16 text-background shadow-elegant">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight text-balance">
                Your gift today writes someone's story tomorrow.
              </h2>
              <p className="mt-5 text-lg text-background/85 leading-relaxed">
                Every euro and every naira goes directly to programs that change lives. Transparent. Accountable. Loving.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="donate" size="xl">
                  <Link to="/donate"><Heart className="h-5 w-5" /> Donate now</Link>
                </Button>
                <Button asChild variant="outlineLight" size="xl">
                  <Link to="/volunteer"><HandHeart className="h-5 w-5" /> Become a volunteer</Link>
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
