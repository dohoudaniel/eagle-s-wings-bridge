import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useSiteSettings } from "@/lib/site-settings";
import { useState } from "react";

export function Footer() {
  const { getValue } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus("success");
      setMessage(res.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Subscription failed.");
    }
  }

  return (
    <footer className="mt-24 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="font-display font-bold">Eagle's Wings</div>
          </Link>
          <p className="mt-4 text-sm text-background/70 leading-relaxed">
            {getValue("footer_tagline", "A humanitarian bridge between Europe and Nigeria — restoring dignity to children, the elderly, and empowering women & youth.")}
          </p>
          <div className="flex gap-3 mt-5">
            {[
              { Icon: Facebook, label: "Facebook", href: "#" },
              { Icon: Instagram, label: "Instagram", href: "#" },
              { Icon: Twitter, label: "Twitter", href: "#" },
              { Icon: Linkedin, label: "LinkedIn", href: "#" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="h-9 w-9 rounded-full grid place-items-center bg-background/10 hover:bg-primary transition"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li>
              <Link to="/about" className="hover:text-primary-glow">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/programs" className="hover:text-primary-glow">
                Programs
              </Link>
            </li>
            <li>
              <Link to="/stories" className="hover:text-primary-glow">
                Stories of Impact
              </Link>
            </li>
            <li>
              <Link to="/volunteer" className="hover:text-primary-glow">
                Volunteer
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-primary-glow">
                Donate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-background/70">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {getValue("contact_address", "Lagos, Nigeria · Berlin, Germany")}
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" /> {getValue("contact_email", "hello@eagleswings.org")}
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" /> {getValue("contact_phone", "+234 800 000 0000")}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Stay informed</h4>
          <p className="text-sm text-background/70 mb-3">
            Get monthly updates on the lives you're changing.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
            />
            <Button type="submit" variant="donate" size="sm" disabled={status === "loading"}>
              {status === "loading" ? "..." : "Join"}
            </Button>
          </form>
          {status === "success" || status === "error" ? (
            <p className={`text-xs mt-2 ${status === "error" ? "text-red-400" : "text-green-400"}`}>
              {message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/60">
          <p>© {new Date().getFullYear()} Eagle's Wings Empowerment. All rights reserved.</p>
          <p>Built with love. Powered by community.</p>
        </div>
      </div>
    </footer>
  );
}
