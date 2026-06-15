import { useEffect } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";
import { SiteSettingsProvider } from "@/lib/site-settings";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Eagle's Wings Empowerment — Restoring Dignity & Opportunity" },
      {
        name: "description",
        content:
          "A humanitarian bridge between Europe and Nigeria, supporting vulnerable children, the elderly, and empowering women and youth.",
      },
      { property: "og:title", content: "Eagle's Wings Empowerment" },
      {
        property: "og:description",
        content: "Restoring dignity and opportunity to those who need it most.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const status = useRouterState({ select: (s) => s.status });
  const isAdmin = pathname.startsWith("/admin");
  const isLoading = status === "pending";

  useEffect(() => {
    if (typeof document === "undefined" || isAdmin) return;
    api.trackPageView(pathname, document.referrer).catch(() => {});
  }, [pathname, isAdmin]);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
          <div className="h-full w-1/3 bg-primary animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      )}
      <SiteSettingsProvider>
        {!isAdmin && <Navbar />}
        <main className="flex-1">{isLoading ? <LoadingSpinner message="Loading page..." /> : <Outlet />}</main>
        {!isAdmin && <Footer />}
      </SiteSettingsProvider>
    </div>
  );
}
