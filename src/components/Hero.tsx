import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { fallbackHeroSlides } from "@/lib/fallback-content";
import { useApi } from "@/hooks/use-api";

export function Hero() {
  const { data: rawSlides } = useApi(api.getHeroSlides);
  const slides = rawSlides?.length ? rawSlides : fallbackHeroSlides;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides]);

  const slide = slides[i];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-foreground">
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === idx ? 1 : 0 }}
          aria-hidden={i !== idx}
        >
          {s.image_url ? (
            <img
              src={s.image_url}
              alt={s.title}
              className="absolute inset-0 h-full w-full object-cover"
              width={1920}
              height={1080}
              fetchPriority={idx === 0 ? "high" : "low"}
              decoding="async"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        </div>
      ))}

      <div className="relative container mx-auto px-4 lg:px-8 min-h-[100svh] flex items-center pt-20">
        <div className="max-w-2xl text-background animate-fade-up" key={i}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 backdrop-blur border border-background/20 text-xs uppercase tracking-widest font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Our Mission
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] text-balance">
            {slide.title}
          </h1>
          {slide.subtitle ? (
            <p className="mt-6 text-lg lg:text-xl text-background/85 max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="donate" size="xl">
              <Link to={slide.cta_link || "/donate"}>
                <Heart className="h-5 w-5" /> {slide.cta_text || "Donate Now"}
              </Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link to="/volunteer">
                <HandHeart className="h-5 w-5" /> Volunteer
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-8 right-4 lg:right-8 flex items-center gap-3 z-10">
          <button
            type="button"
            onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)}
            className="h-10 w-10 grid place-items-center rounded-full bg-background/10 backdrop-blur border border-background/20 text-background hover:bg-background/20 transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-background" : "w-4 bg-background/40"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setI((v) => (v + 1) % slides.length)}
            className="h-10 w-10 grid place-items-center rounded-full bg-background/10 backdrop-blur border border-background/20 text-background hover:bg-background/20 transition"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
