import { Heart, HandHeart, Users, Home, Sparkles, MapPin, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  "hand-heart": HandHeart,
  users: Users,
  home: Home,
  sparkles: Sparkles,
  "map-pin": MapPin,
};

export function getIcon(name: string | null | undefined): LucideIcon | undefined {
  if (!name) return undefined;
  return iconMap[name.toLowerCase()];
}
