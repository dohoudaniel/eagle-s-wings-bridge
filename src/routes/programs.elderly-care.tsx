import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import img from "@/assets/program-elderly.jpg";

export const Route = createFileRoute("/programs/elderly-care")({
  head: () => ({
    meta: [
      { title: "Elderly Care Program — Eagle's Wings Empowerment" },
      { name: "description", content: "Daily meals, medical visits, and companionship for elderly individuals living alone." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Program" title="Elderly Care" description="Walking beside our elders with dignity and love." />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <img src={img} alt="Caregiver with elderly man" className="rounded-3xl shadow-elegant aspect-[4/3] object-cover" loading="lazy" />
          <div>
            <h2 className="text-3xl font-bold">Care that comes to them.</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Many elderly Nigerians live alone, without family or income. Our trained caregivers visit weekly with hot meals, medical check-ins, and the simple gift of presence.
            </p>
            <ul className="mt-6 space-y-3 text-foreground/90">
              <li>• Weekly home visits & meals</li>
              <li>• Free medical screenings & medication</li>
              <li>• Companionship & community days</li>
              <li>• Dignified end-of-life support</li>
            </ul>
            <Button asChild variant="donate" size="lg" className="mt-8">
              <Link to="/donate"><Heart className="h-4 w-4" /> Support an elder</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  ),
});
