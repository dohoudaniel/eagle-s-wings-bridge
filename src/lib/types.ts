export interface Program {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  description: string;
  image_url: string | null;
  icon: string | null;
  order: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  author_image_url: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
  created_at: string;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  icon: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  group: string | null;
  updated_at: string;
}

export interface DonationConfig {
  id: string;
  currency: string;
  amount: number;
  description: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface FormResponse {
  success: boolean;
  message: string;
}
