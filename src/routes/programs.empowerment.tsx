import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import img from "@/assets/program-empowerment.jpg";

export const Route = createFileRoute("/programs/empowerment")({
  head: () => ({
    meta: [
      { title: "Empowerment Program — Eagle's Wings Empowerment" },
      { name: "description", content: "Vocational training, mentorship, and micro-grants for women and youth." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Program" title="Empowerment" description="From survival to self-sufficiency." />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <img src={img} alt="Women in vocational workshop" className="rounded-3xl shadow-elegant aspect-[4/3] object-cover" loading="lazy" />
          <div>
            <h2 className="text-3xl font-bold">Tools, training, and trust.</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              We equip women and youth with marketable skills, business mentorship, and starter micro-grants — so the next generation can lift their families out of poverty for good.
            </p>
            <ul className="mt-6 space-y-3 text-foreground/90">
              <li>• Tailoring, baking, digital & trade skills</li>
              <li>• Business mentorship & financial literacy</li>
              <li>• Micro-grants to launch ventures</li>
              <li>• Ongoing alumni network support</li>
            </ul>
            <Button asChild variant="donate" size="lg" className="mt-8">
              <Link to="/donate"><Heart className="h-4 w-4" /> Empower a life</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  ),
});
