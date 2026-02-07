import { ReleaseStatus } from "@/types";

/**
 * Design tokens for the premium dark theme (blue-grey HSL base)
 */
export const DESIGN_TOKENS = {
  // Colors (HSL blue-grey system)
  background: "hsl(220, 15%, 8%)",
  surface: "hsl(220, 15%, 10%)",
  surfaceElevated: "hsl(220, 15%, 12%)",
  border: "hsl(220, 15%, 18%)",
  accent: "hsl(42, 100%, 50%)", // golden amber
  accentHover: "hsl(42, 100%, 42%)",
  positive: "hsl(142, 70%, 45%)", // green
  negative: "hsl(0, 84%, 60%)", // red
  success: "hsl(142, 70%, 45%)", // semantic success green
  textPrimary: "hsl(0, 0%, 95%)",
  textSecondary: "hsl(220, 10%, 55%)",

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
 * Status badge styling for releases (semantic tinted colors)
 */
/**
 * Predefined music genre list
 */
export const MUSIC_GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Electronic",
  "Latin",
  "Jazz",
  "Classical",
  "Country",
  "Reggaeton",
  "Indie",
  "Alternative",
  "Other",
] as const;

export type MusicGenre = (typeof MUSIC_GENRES)[number];

/**
 * Status badge styling for releases (semantic tinted colors)
 */
export const STATUS_COLORS: Record<ReleaseStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-primary/10 text-primary border border-primary/20",
  live: "bg-success/10 text-success border border-success/20",
  archived: "bg-muted/50 text-muted-foreground",
};
