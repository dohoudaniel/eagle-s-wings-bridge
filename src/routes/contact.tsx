import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Eagle's Wings Empowerment" },
      {
        name: "description",
        content: "Reach our team in Nigeria or Europe — we'd love to hear from you.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { getValue } = useSiteSettings();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await api.submitContact({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        phone: formData.get("phone") ? String(formData.get("phone")) : undefined,
        message: String(formData.get("message")),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={getValue("contact_eyebrow", "Contact")}
        title={getValue("contact_title", "Let's talk.")}
        description={getValue("contact_description", "Questions, partnerships, press — we read every message.")}
      />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-[1.2fr_1fr] gap-10 max-w-6xl">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-3xl p-6 lg:p-10 shadow-elegant space-y-5"
          >
            {done ? (
              <div className="text-center py-10" role="status" aria-live="polite">
                <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
                <h3 className="mt-4 text-2xl font-bold">Message sent</h3>
                <p className="mt-2 text-muted-foreground">We'll be in touch shortly.</p>
                <Button onClick={() => setDone(false)} variant="outline" className="mt-6">
                  Send another
                </Button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className="mt-1.5"
                    />
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
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="msg">Message</Label>
                  <Textarea
                    id="msg"
                    name="message"
                    required
                    rows={6}
                    placeholder="How can we help?"
                    className="mt-1.5"
                  />
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <Button type="submit" variant="donate" size="lg" disabled={loading}>
                  <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send message"}
                </Button>
              </>
            )}
          </form>

          <aside className="space-y-4">
            {[
              {
                icon: MapPin,
                title: "Visit us",
                lines: getValue("contact_address", "Lagos, Nigeria · Berlin, Germany").split(" · "),
              },
              { icon: Mail, title: "Email", lines: [getValue("contact_email", "hello@eagleswings.org")] },
              {
                icon: Phone,
                title: "Call",
                lines: getValue("contact_phone", "+234 800 000 0000").split(" · "),
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-border p-6 bg-card shadow-soft"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-3">
                  <c.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">{c.title}</h4>
                {c.lines.map((l) => (
                  <p key={l} className="text-sm text-muted-foreground">
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
