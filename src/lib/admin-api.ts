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

function getToken() {
  return localStorage.getItem("admin_token");
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Request failed: ${response.status}`);
  }
  return data as T;
}

export const adminApi = {
  login: (email: string, password: string) =>
    fetchJson<{ access_token: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Programs
  listPrograms: () => fetchJson<Program[]>("/admin/programs"),
  createProgram: (body: Record<string, unknown>) => fetchJson<Program>("/admin/programs", { method: "POST", body: JSON.stringify(body) }),
  updateProgram: (id: string, body: Record<string, unknown>) =>
    fetchJson<Program>(`/admin/programs/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteProgram: (id: string) => fetchJson<void>(`/admin/programs/${id}`, { method: "DELETE" }),

  // Stories
  listStories: () => fetchJson<Story[]>("/admin/stories"),
  createStory: (body: Record<string, unknown>) => fetchJson<Story>("/admin/stories", { method: "POST", body: JSON.stringify(body) }),
  updateStory: (id: string, body: Record<string, unknown>) =>
    fetchJson<Story>(`/admin/stories/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteStory: (id: string) => fetchJson<void>(`/admin/stories/${id}`, { method: "DELETE" }),

  // Testimonials
  listTestimonials: () => fetchJson<Testimonial[]>("/admin/testimonials"),
  createTestimonial: (body: Record<string, unknown>) =>
    fetchJson<Testimonial>("/admin/testimonials", { method: "POST", body: JSON.stringify(body) }),
  updateTestimonial: (id: string, body: Record<string, unknown>) =>
    fetchJson<Testimonial>(`/admin/testimonials/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteTestimonial: (id: string) => fetchJson<void>(`/admin/testimonials/${id}`, { method: "DELETE" }),

  // Hero slides
  listHeroSlides: () => fetchJson<HeroSlide[]>("/admin/hero-slides"),
  createHeroSlide: (body: Record<string, unknown>) =>
    fetchJson<HeroSlide>("/admin/hero-slides", { method: "POST", body: JSON.stringify(body) }),
  updateHeroSlide: (id: string, body: Record<string, unknown>) =>
    fetchJson<HeroSlide>(`/admin/hero-slides/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteHeroSlide: (id: string) => fetchJson<void>(`/admin/hero-slides/${id}`, { method: "DELETE" }),

  // Timeline
  listTimeline: () => fetchJson<TimelineEvent[]>("/admin/timeline"),
  createTimelineEvent: (body: Record<string, unknown>) =>
    fetchJson<TimelineEvent>("/admin/timeline", { method: "POST", body: JSON.stringify(body) }),
  updateTimelineEvent: (id: string, body: Record<string, unknown>) =>
    fetchJson<TimelineEvent>(`/admin/timeline/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteTimelineEvent: (id: string) => fetchJson<void>(`/admin/timeline/${id}`, { method: "DELETE" }),

  // Impact stats
  listImpactStats: () => fetchJson<ImpactStat[]>("/admin/impact-stats"),
  createImpactStat: (body: Record<string, unknown>) =>
    fetchJson<ImpactStat>("/admin/impact-stats", { method: "POST", body: JSON.stringify(body) }),
  updateImpactStat: (id: string, body: Record<string, unknown>) =>
    fetchJson<ImpactStat>(`/admin/impact-stats/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteImpactStat: (id: string) => fetchJson<void>(`/admin/impact-stats/${id}`, { method: "DELETE" }),

  // Site settings
  listSiteSettings: () => fetchJson<SiteSetting[]>("/admin/site-settings"),
  createSiteSetting: (body: Record<string, unknown>) =>
    fetchJson<SiteSetting>("/admin/site-settings", { method: "POST", body: JSON.stringify(body) }),
  updateSiteSetting: (key: string, body: Record<string, unknown>) =>
    fetchJson<SiteSetting>(`/admin/site-settings/${key}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteSiteSetting: (key: string) => fetchJson<void>(`/admin/site-settings/${key}`, { method: "DELETE" }),

  // Donation config
  listDonationConfigs: () => fetchJson<DonationConfig[]>("/admin/donation-config"),
  createDonationConfig: (body: Record<string, unknown>) =>
    fetchJson<DonationConfig>("/admin/donation-config", { method: "POST", body: JSON.stringify(body) }),
  updateDonationConfig: (id: string, body: Record<string, unknown>) =>
    fetchJson<DonationConfig>(`/admin/donation-config/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteDonationConfig: (id: string) => fetchJson<void>(`/admin/donation-config/${id}`, { method: "DELETE" }),

  // Submissions
  listContacts: () => fetchJson<ContactSubmission[]>("/admin/contacts"),
  updateContactStatus: (id: string, status: string) =>
    fetchJson<ContactSubmission>(`/admin/contacts/${id}/status?status_value=${status}`, { method: "PATCH" }),
  listVolunteers: () => fetchJson<VolunteerSubmission[]>("/admin/volunteers"),
  updateVolunteerStatus: (id: string, status: string) =>
    fetchJson<VolunteerSubmission>(`/admin/volunteers/${id}/status?status_value=${status}`, { method: "PATCH" }),
  getVolunteerCvUrl: (id: string) => fetchJson<{ signed_url: string }>(`/admin/volunteers/${id}/cv-url`),
  listNewsletterSubscribers: () => fetchJson<NewsletterSubscriber[]>("/admin/newsletter-subscribers"),

  // Storage
  uploadImage: (file: File, folder = "cms") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return fetchJson<{ url: string }>("/admin/storage/images", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set multipart boundary
    });
  },
  deleteImage: (url: string) => fetchJson<void>(`/admin/storage/images?url=${encodeURIComponent(url)}`, { method: "DELETE" }),
  listImages: (folder = "cms") => fetchJson<{ images: { name: string; path: string; url: string; size: number; created_at: string }[] }>(`/admin/storage/images?folder=${encodeURIComponent(folder)}`),
};

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "replied" | "spam" | "archived";
  created_at: string;
}

export interface VolunteerSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  area_of_interest: string;
  message: string | null;
  cv_url: string;
  cv_filename: string;
  status: "new" | "reviewing" | "accepted" | "rejected";
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}
