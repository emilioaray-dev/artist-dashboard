import { ReleaseStatus } from "@/types";

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
  draft: "bg-gray-600",
  scheduled: "bg-blue-600",
  live: "bg-green-700",
  archived: "bg-gray-800",
};
