import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Eagle's Wings Empowerment" },
      { name: "description", content: "Reach our team in Nigeria or Europe — we'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [done, setDone] = useState(false);

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk." description="Questions, partnerships, press — we read every message." />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-[1.2fr_1fr] gap-10 max-w-6xl">
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="bg-card border border-border rounded-3xl p-6 lg:p-10 shadow-elegant space-y-5"
          >
            {done ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
                <h3 className="mt-4 text-2xl font-bold">Message sent</h3>
                <p className="mt-2 text-muted-foreground">We'll be in touch shortly.</p>
                <Button onClick={() => setDone(false)} variant="outline" className="mt-6">Send another</Button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" required placeholder="Jane Doe" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="msg">Message</Label>
                  <Textarea id="msg" required rows={6} placeholder="How can we help?" className="mt-1.5" />
                </div>
                <Button type="submit" variant="donate" size="lg">
                  <Send className="h-4 w-4" /> Send message
                </Button>
              </>
            )}
          </form>

          <aside className="space-y-4">
            {[
              { icon: MapPin, title: "Visit us", lines: ["Lagos, Nigeria", "Berlin, Germany"] },
              { icon: Mail, title: "Email", lines: ["hello@eagleswings.org"] },
              { icon: Phone, title: "Call", lines: ["+234 800 000 0000", "+49 30 0000 0000"] },
            ].map((c) => (
              <div key={c.title} className="rounded-3xl border border-border p-6 bg-card shadow-soft">
                <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-3">
                  <c.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">{c.title}</h4>
                {c.lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
