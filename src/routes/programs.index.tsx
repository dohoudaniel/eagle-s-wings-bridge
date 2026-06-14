import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { getIcon } from "@/lib/icons";

export const Route = createFileRoute("/programs/")({
  component: ProgramsIndex,
});

function ProgramsIndex() {
  const { data: programs, loading } = useApi(api.getPrograms);

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-3 gap-6 lg:gap-8">
        {loading || !programs
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
              >
                <div className="aspect-[4/3] animate-pulse bg-muted" />
                <div className="p-7 space-y-3">
                  <div className="animate-pulse h-10 w-10 rounded-xl bg-muted" />
                  <div className="animate-pulse h-6 w-2/3 bg-muted rounded" />
                  <div className="animate-pulse h-4 w-full bg-muted rounded" />
                </div>
              </div>
            ))
          : programs.map((p) => {
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
                  <div className="p-7">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </div>
                    <h3 className="text-xl font-bold font-display">{p.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{p.summary}</p>
                    <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
