import { Channel, ReleaseStatus } from "@/types";
import {
  ArrowRight,
  Disc3,
  LayoutDashboard,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
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
    href: "/overview",
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
  textSecondary: "#D4D4D8",

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
 * Status badge colors for releases (with improved contrast for white text)
 */
export const STATUS_COLORS: Record<ReleaseStatus, string> = {
  draft: "bg-gray-600", // Darker gray for better contrast
  scheduled: "bg-blue-600", // Darker blue for better contrast
  live: "bg-green-700", // Darker green for better contrast
  archived: "bg-gray-800", // Darker gray for better contrast
};

/**
 * Chart color configuration using channel colors
 */
export const CHART_COLORS = {
  gross: { label: "Gross Revenue", color: CHANNEL_INFO.direct_to_fan.color },
  net: { label: "Net Revenue", color: CHANNEL_INFO.physical.color },
  direct_to_fan: {
    label: CHANNEL_INFO.direct_to_fan.name,
    color: CHANNEL_INFO.direct_to_fan.color,
  },
  digital: {
    label: CHANNEL_INFO.digital.name,
    color: CHANNEL_INFO.digital.color,
  },
  physical: {
    label: CHANNEL_INFO.physical.name,
    color: CHANNEL_INFO.physical.color,
  },
  bundles: {
    label: CHANNEL_INFO.bundles.name,
    color: CHANNEL_INFO.bundles.color,
  },
  totalFans: { label: "Total Fans", color: CHANNEL_INFO.direct_to_fan.color },
  activeFans: { label: "Active Fans", color: CHANNEL_INFO.physical.color },
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
