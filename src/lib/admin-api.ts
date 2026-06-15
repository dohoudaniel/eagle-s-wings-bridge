import type {
  Donation,
  DonationConfig,
  FormResponse,
  HeroSlide,
  ImpactStat,
  Program,
  SiteSetting,
  Story,
  TeamMember,
  Testimonial,
  TimelineEvent,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

let _csrfToken: string | null = null;

function getCsrfToken(): string | null {
  // Refresh from cookie in case it changed (e.g. after login in another tab).
  return _csrfToken || getCsrfTokenFromCookie();
}

function setCsrfToken(token: string | null) {
  _csrfToken = token;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const csrfToken = getCsrfToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    setCsrfToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/admin";
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Request failed: ${response.status}`);
  }
  return data as T;
}

async function fetchLogin(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Login failed: ${response.status}`);
  }
  return data as { csrf_token: string };
}

export const adminApi = {
  login: async (email: string, password: string) => {
    const data = await fetchLogin("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setCsrfToken(data.csrf_token);
    return data;
  },
  logout: () => fetchJson<void>("/admin/logout", { method: "POST" }),

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
    fetchJson<ContactSubmission>(`/admin/contacts/${id}/status?status_value=${encodeURIComponent(status)}`, { method: "PATCH" }),
  updateContactNotes: (id: string, notes: string) => {
    const formData = new FormData();
    formData.append("notes", notes);
    return fetchJson<ContactSubmission>(`/admin/contacts/${id}/notes`, { method: "PATCH", body: formData });
  },
  listVolunteers: () => fetchJson<VolunteerSubmission[]>("/admin/volunteers"),
  updateVolunteerStatus: (id: string, status: string) =>
    fetchJson<VolunteerSubmission>(`/admin/volunteers/${id}/status?status_value=${encodeURIComponent(status)}`, { method: "PATCH" }),
  updateVolunteerNotes: (id: string, notes: string) => {
    const formData = new FormData();
    formData.append("notes", notes);
    return fetchJson<VolunteerSubmission>(`/admin/volunteers/${id}/notes`, { method: "PATCH", body: formData });
  },
  getVolunteerCvUrl: (id: string) => fetchJson<{ signed_url: string }>(`/admin/volunteers/${id}/cv-url`),
  listNewsletterSubscribers: () => fetchJson<NewsletterSubscriber[]>("/admin/newsletter-subscribers"),

  // Team members
  listTeamMembers: () => fetchJson<TeamMember[]>("/admin/team-members"),
  createTeamMember: (body: Record<string, unknown>) =>
    fetchJson<TeamMember>("/admin/team-members", { method: "POST", body: JSON.stringify(body) }),
  updateTeamMember: (id: string, body: Record<string, unknown>) =>
    fetchJson<TeamMember>(`/admin/team-members/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteTeamMember: (id: string) => fetchJson<void>(`/admin/team-members/${id}`, { method: "DELETE" }),

  // Donations
  listDonations: (params?: { status?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status_filter", params.status);
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.offset !== undefined) query.set("offset", String(params.offset));
    const qs = query.toString();
    return fetchJson<Donation[]>(`/admin/donations${qs ? `?${qs}` : ""}`);
  },
  getDonationStats: () => fetchJson<{ total: number; completed: number; total_amount: number }>("/admin/donations/stats"),

  // Dashboard
  getDashboard: () =>
    fetchJson<{
      contacts_today: number;
      volunteers_today: number;
      donations_today: number;
      page_views_today: number;
      total_contacts: number;
      total_volunteers: number;
      total_donations: number;
      total_donated: number;
      recent_actions: AdminAction[];
      recent_donations: Donation[];
    }>("/admin/dashboard"),
  listAdminActions: () => fetchJson<AdminAction[]>("/admin/admin-actions"),

  // Storage
  uploadImage: (file: File, folder = "cms") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return fetchJson<{ url: string }>("/admin/storage/images", {
      method: "POST",
      body: formData,
    });
  },
  uploadVideo: (file: File, folder = "cms") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return fetchJson<{ url: string }>("/admin/storage/videos", {
      method: "POST",
      body: formData,
    });
  },
  deleteImage: (url: string) => fetchJson<void>(`/admin/storage/images?url=${encodeURIComponent(url)}`, { method: "DELETE" }),
  listImages: (folder = "cms") => fetchJson<{ images: { name: string; path: string; url: string; size: number; created_at: string }[] }>(`/admin/storage/images?folder=${encodeURIComponent(folder)}`),
};

export interface AdminAction {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export type { Donation } from "./types";

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
