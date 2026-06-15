import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";
import { fallbackPrograms } from "@/lib/fallback-content";
import { useApi } from "@/hooks/use-api";

export function ProgramDetail({ slug }: { slug: string }) {
  const fallback = useMemo(() => fallbackPrograms.find((p) => p.slug === slug), [slug]);
  const fetcher = useMemo(() => () => api.getProgram(slug), [slug]);
  const { data: program, loading, error } = useApi(fetcher);

  if (loading) {
    return <LoadingSpinner message="Loading program..." />;
  }

  const displayProgram = program || fallback;

  if (error || !displayProgram) {
    return (
      <section className="py-20 lg:py-28 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold">Program not found</h2>
          <p className="mt-2 text-muted-foreground">{error || "This program does not exist."}</p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/programs">Back to programs</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
        {displayProgram.image_url ? (
          <img
            src={displayProgram.image_url}
            alt={displayProgram.title}
            className="rounded-3xl shadow-elegant aspect-[4/3] object-cover"
            loading="lazy"
          />
        ) : null}
        <div>
          <h2 className="text-3xl font-bold">{displayProgram.subtitle || displayProgram.title}</h2>
          <div className="mt-5 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {displayProgram.description}
          </div>
          <Button asChild variant="donate" size="lg" className="mt-8">
            <Link to="/donate">
              <Heart className="h-4 w-4" /> Support this program
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
