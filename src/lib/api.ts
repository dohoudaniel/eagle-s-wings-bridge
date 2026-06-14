import type {
  DonationConfig,
  FormResponse,
  HeroSlide,
  ImpactStat,
  Program,
  SiteSetting,
  Story,
  Testimonial,
  TimelineEvent,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Request failed: ${response.status}`);
  }
  return data as T;
}

export const api = {
  // CMS content
  getHeroSlides: () => fetchJson<HeroSlide[]>("/hero-slides"),
  getPrograms: () => fetchJson<Program[]>("/programs"),
  getProgram: (slug: string) => fetchJson<Program>(`/programs/${slug}`),
  getStories: () => fetchJson<Story[]>("/stories"),
  getStory: (slug: string) => fetchJson<Story>(`/stories/${slug}`),
  getTestimonials: () => fetchJson<Testimonial[]>("/testimonials"),
  getTimeline: () => fetchJson<TimelineEvent[]>("/timeline"),
  getImpactStats: () => fetchJson<ImpactStat[]>("/impact-stats"),
  getSiteSettings: () => fetchJson<SiteSetting[]>("/site-settings"),
  getDonationConfig: () => fetchJson<DonationConfig[]>("/donation-config"),

  // Forms
  submitContact: (body: { name: string; email: string; phone?: string; message: string }) =>
    fetchJson<FormResponse>("/contact", { method: "POST", body: JSON.stringify(body) }),

  submitVolunteer: (formData: FormData) =>
    fetchJson<FormResponse>("/volunteers", { method: "POST", body: formData }),

  subscribeNewsletter: (email: string) =>
    fetchJson<FormResponse>("/newsletter", { method: "POST", body: JSON.stringify({ email }) }),

  // Donations
  initiateDonation: (body: {
    donor_name: string;
    donor_email: string;
    amount: number;
    currency: string;
    frequency: "one-time" | "monthly";
    message?: string;
  }) => fetchJson<{ reference: string; authorization_url: string }>("/donations/initiate", { method: "POST", body: JSON.stringify(body) }),

  verifyDonation: (reference: string) =>
    fetchJson<{ status: string; amount: number; currency: string }>(`/donations/verify?reference=${encodeURIComponent(reference)}`),
};
