import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";
import { ArrowRight, Home, Heart, Sparkles } from "lucide-react";
import programChildren from "@/assets/program-children.jpg";
import programElderly from "@/assets/program-elderly.jpg";
import programEmpowerment from "@/assets/program-empowerment.jpg";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Eagle's Wings Empowerment" },
      { name: "description", content: "Explore our impact areas: motherless homes, elderly care, and empowerment programs for women and youth." },
    ],
  }),
  component: ProgramsPage,
});

const programs = [
  { img: programChildren, icon: Home, title: "Motherless Homes", desc: "Safe shelter, schooling, and a loving community for children without parents.", href: "/programs/motherless-home" },
  { img: programElderly, icon: Heart, title: "Elderly Care", desc: "Meals, medical visits and companionship for seniors who are alone.", href: "/programs/elderly-care" },
  { img: programEmpowerment, icon: Sparkles, title: "Empowerment", desc: "Vocational training, mentorship and micro-grants for women and youth.", href: "/programs/empowerment" },
] as const;

function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title="Programs that restore dignity."
        description="Three core areas. One mission: to meet people where they are and walk with them toward what's possible."
      />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((p) => (
            <Link
              key={p.title}
              to={p.href}
              className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-7">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold font-display">{p.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Outlet />
    </>
  );
}
