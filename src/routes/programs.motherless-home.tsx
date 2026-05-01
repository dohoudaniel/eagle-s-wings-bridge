import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import img from "@/assets/program-children.jpg";

export const Route = createFileRoute("/programs/motherless-home")({
  head: () => ({
    meta: [
      { title: "Motherless Homes Program — Eagle's Wings Empowerment" },
      { name: "description", content: "We give vulnerable children in Nigeria shelter, education, and a family that loves them." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Program" title="Motherless Homes" description="A family for every child without one." />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <img src={img} alt="Children studying" className="rounded-3xl shadow-elegant aspect-[4/3] object-cover" loading="lazy" />
          <div>
            <h2 className="text-3xl font-bold">Shelter, education, family.</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Our community homes provide safe shelter, three meals a day, school enrollment and consistent loving care for children who have lost their parents. We don't run orphanages — we run families.
            </p>
            <ul className="mt-6 space-y-3 text-foreground/90">
              <li>• Safe housing with house parents</li>
              <li>• Full school sponsorship & supplies</li>
              <li>• Health, nutrition & emotional care</li>
              <li>• Mentorship through young adulthood</li>
            </ul>
            <Button asChild variant="donate" size="lg" className="mt-8">
              <Link to="/donate"><Heart className="h-4 w-4" /> Sponsor a child</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  ),
});
