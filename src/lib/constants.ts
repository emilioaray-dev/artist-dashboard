import { Channel } from "@/types";
import { 
  LayoutDashboard, 
  Disc3, 
  Users, 
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from "lucide-react";

/**
 * Channel information with display names and colors
 */
export const CHANNEL_INFO: Record<Channel, { name: string; color: string }> = {
  direct_to_fan: {
    name: "Direct to Fan",
    color: "#F59E0B", // amber-500
  },
  digital: {
    name: "Digital",
    color: "#3B82F6", // blue-500
  },
  physical: {
    name: "Physical",
    color: "#10B981", // emerald-500
  },
  bundles: {
    name: "Bundles",
    color: "#8B5CF6", // violet-500
  },
};

/**
 * Navigation items for the sidebar
 */
export const NAV_ITEMS = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Releases",
    href: "/releases",
    icon: Disc3,
  },
  {
    title: "Fans",
    href: "/fans",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

/**
 * Design tokens for the premium dark theme
 */
export const DESIGN_TOKENS = {
  // Colors
  background: "#09090B",
  surface: "#0A0A0A",
  surfaceElevated: "#111111",
  border: "#27272A",
  accent: "#F59E0B", // amber
  accentHover: "#D97706",
  positive: "#10B981", // green
  negative: "#F43F5E", // red
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",

  // Typography scale
  headingXL: "32px", // Page titles
  headingLG: "24px", // Section headers
  dataValue: "20px", // Metric numbers
  body: "14px", // Body text
  caption: "12px", // Labels, captions

  // Spacing
  sectionPadding: "24px 32px",
  cardGap: "16px",
};

/**
 * Trend icons for displaying direction
 */
export const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  stable: ArrowRight,
};

/**
 * Time range options for charts
 */
export const TIME_RANGES = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];