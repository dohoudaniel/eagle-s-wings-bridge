import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Heart, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import heroImage from "@/assets/hero-children.jpg";

export function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.login(email, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-background">
      {/* Brand / mission panel */}
      <aside className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary-glow/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-foreground/25" />
        <div className="absolute -left-24 -bottom-28 h-96 w-96 rounded-full bg-success/30 blur-3xl" />
        <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-warm/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <Heart className="h-6 w-6" fill="currentColor" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold">Eagle's Wings</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">Empowerment</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl font-bold leading-[1.1] text-balance xl:text-5xl">
            Restoring dignity, one life at a time.
          </h2>
          <p className="mt-5 leading-relaxed text-white/80">
            Sign in to shape programs, publish stories, and follow every life this mission touches.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {["Manage content", "Review submissions", "Track impact"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium ring-1 ring-white/15 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">© Eagle's Wings Empowerment</div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          {/* mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary shadow-soft">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-foreground">Eagle's Wings</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Empowerment
              </div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to the admin dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Admin Email"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-foreground transition placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-11 text-foreground transition placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error ? (
              <p
                className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-soft transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" /> Secure area
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
