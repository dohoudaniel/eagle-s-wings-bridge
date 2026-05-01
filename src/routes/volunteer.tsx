import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, HandHeart, Upload } from "lucide-react";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — Eagle's Wings Empowerment" },
      { name: "description", content: "Offer your time, skills, or expertise to one of our humanitarian programs in Nigeria or Europe." },
    ],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <>
        <PageHeader eyebrow="Welcome" title="Thank you for stepping forward." description="A team member will reach out within 48 hours." />
        <section className="py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
          <Button onClick={() => setDone(false)} variant="outline" className="mt-8">Submit another response</Button>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Volunteer"
        title="Bring your gift to the work."
        description="Doctors, teachers, designers, storytellers, drivers — every skill has a home with us."
      />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="bg-card border border-border rounded-3xl p-6 lg:p-10 shadow-elegant space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required placeholder="Jane Doe" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" required placeholder="+234 800 000 0000" className="mt-1.5" />
            </div>
            <div>
              <Label>Area of interest</Label>
              <Select required>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a program" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="children">Motherless Homes</SelectItem>
                  <SelectItem value="elderly">Elderly Care</SelectItem>
                  <SelectItem value="empowerment">Empowerment</SelectItem>
                  <SelectItem value="ops">Operations / Admin</SelectItem>
                  <SelectItem value="comms">Communications & Storytelling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cv">Upload CV (PDF)</Label>
              <label
                htmlFor="cv"
                className="mt-1.5 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-8 cursor-pointer hover:border-primary/60 hover:bg-accent/50 transition"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload your CV (PDF)</span>
                <input id="cv" type="file" accept="application/pdf" className="hidden" />
              </label>
            </div>
            <div>
              <Label htmlFor="msg">Why you want to join (optional)</Label>
              <Textarea id="msg" rows={4} placeholder="Tell us a bit about yourself..." className="mt-1.5" />
            </div>

            <Button type="submit" variant="donate" size="lg" className="w-full">
              <HandHeart className="h-5 w-5" /> Submit application
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
