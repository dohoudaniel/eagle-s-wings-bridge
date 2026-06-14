import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";

export function ProgramDetail({ slug }: { slug: string }) {
  const { data: program, loading, error } = useApi(() => api.getProgram(slug));

  if (loading) {
    return (
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <div className="aspect-[4/3] animate-pulse bg-muted rounded-3xl" />
          <div className="space-y-4">
            <div className="animate-pulse h-10 w-2/3 bg-muted rounded" />
            <div className="animate-pulse h-32 w-full bg-muted rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !program) {
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
        {program.image_url ? (
          <img
            src={program.image_url}
            alt={program.title}
            className="rounded-3xl shadow-elegant aspect-[4/3] object-cover"
            loading="lazy"
          />
        ) : null}
        <div>
          <h2 className="text-3xl font-bold">{program.subtitle || program.title}</h2>
          <div className="mt-5 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {program.description}
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
