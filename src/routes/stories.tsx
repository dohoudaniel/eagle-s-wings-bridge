import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Stories of Impact — Eagle's Wings Empowerment" },
      {
        name: "description",
        content: "Real stories from the children, elders, and communities we serve.",
      },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const { data: stories, loading } = useApi(api.getStories);

  return (
    <>
      <PageHeader
        eyebrow="Stories"
        title="The lives behind the numbers."
        description="Every donation becomes a story. Here are a few of them."
      />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading || !stories
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl overflow-hidden bg-card border border-border shadow-soft"
                >
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="animate-pulse h-4 w-1/3 bg-muted rounded" />
                    <div className="animate-pulse h-6 w-2/3 bg-muted rounded" />
                    <div className="animate-pulse h-16 w-full bg-muted rounded" />
                  </div>
                </div>
              ))
            : stories.map((s) => (
                <article
                  key={s.id}
                  className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {s.image_url ? (
                      <img
                        src={s.image_url}
                        alt={s.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary uppercase tracking-wider">
                        {s.author_name || "Story"}
                      </span>
                      <span className="text-muted-foreground">
                        {s.published_at ? new Date(s.published_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold font-display leading-snug">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {s.excerpt}
                    </p>
                    <Link
                      to="/stories"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all"
                    >
                      Read story <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
        </div>
      </section>
    </>
  );
}
