import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";
import { fallbackStories } from "@/lib/fallback-content";
import { useApi } from "@/hooks/use-api";

export const Route = createFileRoute("/stories/$slug")({
  component: StoryDetailPage,
});

function StoryDetailPage() {
  const { slug } = Route.useParams();
  const fetcher = useMemo(() => () => api.getStory(slug), [slug]);
  const { data: story, loading } = useApi(fetcher);
  const fallback = fallbackStories.find((s) => s.slug === slug);
  const content = story || fallback;

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading story..." />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Story not found</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/stories">Back to stories</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <Button asChild variant="ghost" className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/stories">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to stories
          </Link>
        </Button>

        {content.image_url ? (
          <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-10">
            <img
              src={content.image_url}
              alt={content.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          {content.author_name ? (
            <span className="font-medium text-primary">{content.author_name}</span>
          ) : null}
          {content.published_at ? (
            <span>
              {new Date(content.published_at).toLocaleDateString(undefined, { dateStyle: "long" })}
            </span>
          ) : null}
        </div>

        <h1 className="text-3xl lg:text-5xl font-bold font-display leading-tight">
          {content.title}
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{content.excerpt}</p>

        <div className="mt-10 prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
          {content.content}
        </div>
      </div>
    </article>
  );
}
