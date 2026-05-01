import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";
import { ArrowRight } from "lucide-react";
import programChildren from "@/assets/program-children.jpg";
import programElderly from "@/assets/program-elderly.jpg";
import programEmpowerment from "@/assets/program-empowerment.jpg";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Stories of Impact — Eagle's Wings Empowerment" },
      { name: "description", content: "Real stories from the children, elders, and communities we serve." },
    ],
  }),
  component: StoriesPage,
});

const stories = [
  {
    img: programChildren,
    category: "Motherless Homes",
    title: "How Chiamaka found her way back to school",
    excerpt: "After losing both parents, Chiamaka's future looked uncertain. Today, she's top of her class.",
    date: "Mar 12, 2025",
  },
  {
    img: programElderly,
    category: "Elderly Care",
    title: "Baba Sule's Wednesday smile",
    excerpt: "A weekly visit became the highlight of his week — and ours.",
    date: "Feb 24, 2025",
  },
  {
    img: programEmpowerment,
    category: "Empowerment",
    title: "From trainee to tailor: Halima's first shop",
    excerpt: "Six months of training, one micro-grant, and an entirely new chapter.",
    date: "Feb 02, 2025",
  },
];

function StoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Stories"
        title="The lives behind the numbers."
        description="Every donation becomes a story. Here are a few of them."
      />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stories.map((s) => (
            <article key={s.title} className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary uppercase tracking-wider">{s.category}</span>
                  <span className="text-muted-foreground">{s.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold font-display leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.excerpt}</p>
                <Link to="/stories" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
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
