import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, HandHeart, Upload } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — Eagle's Wings Empowerment" },
      {
        name: "description",
        content:
          "Offer your time, skills, or expertise to one of our humanitarian programs in Nigeria or Europe.",
      },
    ],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate file presence
    const cv = formData.get("cv");
    if (!cv || !(cv instanceof File) || cv.size === 0) {
      setError("Please upload your CV (PDF).");
      setLoading(false);
      return;
    }

    try {
      const res = await api.submitVolunteer(formData);
      if (res?.success === false) {
        setError(res.message || "We couldn't submit your application. Please try again.");
        return;
      }
      setDone(true);
      form.reset();
      setCvName(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <PageHeader
          eyebrow="Welcome"
          title="Thank you for stepping forward."
          description="A team member will reach out within 48 hours."
        />
        <section className="py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
          <Button onClick={() => setDone(false)} variant="outline" className="mt-8">
            Submit another response
          </Button>
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
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-3xl p-6 lg:p-10 shadow-elegant space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Area of interest</Label>
              <Select name="area_of_interest" required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Motherless Homes">Motherless Homes</SelectItem>
                  <SelectItem value="Elderly Care">Elderly Care</SelectItem>
                  <SelectItem value="Empowerment">Empowerment</SelectItem>
                  <SelectItem value="Operations / Admin">Operations / Admin</SelectItem>
                  <SelectItem value="Communications & Storytelling">
                    Communications & Storytelling
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cv">Upload CV (PDF)</Label>
              <label
                htmlFor="cv"
                className="mt-1.5 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-8 cursor-pointer hover:border-primary/60 hover:bg-accent/50 transition"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {cvName ? `Selected: ${cvName}` : "Click to upload your CV (PDF)"}
                </span>
                <input
                  id="cv"
                  name="cv"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setCvName(e.target.files?.[0]?.name || null)}
                  required
                />
              </label>
            </div>
            <div>
              <Label htmlFor="msg">Why you want to join (optional)</Label>
              <Textarea
                id="msg"
                name="message"
                rows={4}
                placeholder="Tell us a bit about yourself..."
                className="mt-1.5"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" variant="donate" size="lg" className="w-full" disabled={loading}>
              <HandHeart className="h-5 w-5" /> {loading ? "Submitting..." : "Submit application"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
