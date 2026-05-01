import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Eagle's Wings Empowerment" },
      { name: "description", content: "Make a one-time or monthly donation in EUR or NGN. 100% transparent. Direct impact." },
    ],
  }),
  component: DonatePage,
});

const presetsEUR = [10, 25, 50, 100, 250];
const presetsNGN = [5000, 10000, 25000, 50000, 100000];

function DonatePage() {
  const [currency, setCurrency] = useState<"EUR" | "NGN">("EUR");
  const [type, setType] = useState<"one-time" | "monthly">("one-time");
  const [amount, setAmount] = useState<number>(50);
  const [submitted, setSubmitted] = useState(false);

  const presets = currency === "EUR" ? presetsEUR : presetsNGN;
  const symbol = currency === "EUR" ? "€" : "₦";

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Thank you" title="Your gift will change a life." description="We've received your contribution. A confirmation will arrive in your inbox shortly." />
        <section className="py-20 text-center">
          <div className="container mx-auto px-4 max-w-xl">
            <div className="mx-auto h-20 w-20 rounded-full bg-success/15 grid place-items-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <p className="mt-6 text-lg text-muted-foreground">
              {symbol}{amount.toLocaleString()} {type === "monthly" ? "monthly" : "one-time"} — thank you for standing with us.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8">Make another donation</Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Donate"
        title="Turn compassion into action."
        description="Every contribution is tracked, transparent, and tied directly to a program outcome."
      />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start max-w-6xl">
          {/* Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="bg-card border border-border rounded-3xl p-6 lg:p-10 shadow-elegant"
          >
            {/* Currency toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
              {(["EUR", "NGN"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCurrency(c); setAmount(c === "EUR" ? 50 : 10000); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${currency === c ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"}`}
                >
                  {c === "EUR" ? "€ Euro" : "₦ Naira"}
                </button>
              ))}
            </div>

            {/* Type */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {(["one-time", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-4 rounded-xl border-2 text-left transition ${type === t ? "border-primary bg-accent" : "border-border hover:border-primary/40"}`}
                >
                  <div className="font-semibold capitalize">{t}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t === "monthly" ? "Recurring impact" : "Single contribution"}
                  </div>
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="mt-6">
              <Label className="text-sm font-semibold">Choose an amount</Label>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`py-3 rounded-xl border-2 font-semibold transition ${amount === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"}`}
                  >
                    {symbol}{p.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Label htmlFor="custom" className="text-xs text-muted-foreground">Or enter a custom amount</Label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border-2 border-border focus-within:border-primary px-4 py-3">
                  <span className="text-lg font-semibold">{symbol}</span>
                  <input
                    id="custom"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-transparent outline-none text-lg font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Donor info */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required placeholder="Jane Doe" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
              </div>
            </div>

            <Button type="submit" variant="donate" size="xl" className="mt-8 w-full">
              <Heart className="h-5 w-5" /> Donate {symbol}{amount.toLocaleString()} {type === "monthly" && "/month"}
            </Button>
            <p className="mt-3 text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Secure checkout via Stripe (Europe) & Paystack (Nigeria)
            </p>
          </form>

          {/* Impact panel */}
          <aside className="space-y-4">
            <div className="rounded-3xl bg-gradient-hero p-8 text-background shadow-elegant">
              <h3 className="text-xl font-bold font-display">Your impact, today</h3>
              <ul className="mt-5 space-y-3 text-background/90 text-sm">
                <li>• <b>{symbol}{currency === "EUR" ? 25 : 10000}</b> feeds a child for a month</li>
                <li>• <b>{symbol}{currency === "EUR" ? 50 : 25000}</b> covers a senior's medical visits</li>
                <li>• <b>{symbol}{currency === "EUR" ? 250 : 100000}</b> launches a woman's micro-business</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border p-6 bg-card">
              <h4 className="font-semibold">100% transparency</h4>
              <p className="mt-2 text-sm text-muted-foreground">We publish quarterly reports showing exactly how every contribution is used.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
