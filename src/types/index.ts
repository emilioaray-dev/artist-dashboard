/**
 * Sales channel types available in EVEN Backstage.
 * These represent the different ways artists can monetize their content directly with fans.
 */
export type Channel =
  | "direct_to_fan"   // Direct purchases from fans (primary revenue)
  | "digital"         // Digital downloads and streaming
  | "physical"        // Physical merchandise and vinyl
  | "bundles";        // Bundle packages combining multiple products

/**
 * Channel display information for UI rendering.
 */
export interface ChannelInfo {
  /** Unique channel identifier */
  id: Channel;
  /** Display name for UI: "Direct to Fan", "Digital", etc. */
  name: string;
  /** Brand color for charts and visualizations */
  color: string;
  /** Optional Lucide icon identifier */
  icon?: string;
}

/**
 * Types of releases available on EVEN Backstage.
 */
export type ReleaseType = "single" | "ep" | "album" | "drop" | "bundle";

/**
 * Release status indicating the current state of the release.
 */
export type ReleaseStatus = "draft" | "scheduled" | "live" | "archived";

/**
 * Represents a music release with sales data broken down by channel.
 */
export interface Release {
  /** Unique identifier */
  id: string;
  /** Release title */
  title: string;
  /** Type of release */
  type: ReleaseType;
  /** Current status */
  status: ReleaseStatus;
  /** ISO date string "2026-01-15" */
  releaseDate: string;
  /** URL to cover image (or empty for placeholder) */
  coverArtUrl: string;
  /** URL to audio file (optional) */
  audioUrl?: string;
  /** Total units sold across all channels */
  totalSales: number;
  /** Total revenue in cents */
  totalRevenue: number;
  /** Sales breakdown by channel */
  salesByChannel: Record<Channel, number>;
  /** Revenue breakdown by channel in cents */
  revenueByChannel: Record<Channel, number>;
}

/**
 * Daily sales record for a specific date.
 */
export interface DailySales {
  /** ISO date string "2026-01-15" */
  date: string;
  /** Total revenue in cents (integer) */
  revenue: number;
  /** Total units sold */
  sales: number;
  /** Revenue breakdown by channel in cents */
  revenueByChannel: Record<Channel, number>;
  /** Sales breakdown by channel */
  salesByChannel: Record<Channel, number>;
}

/**
 * Summary of sales data for a period with daily breakdown.
 */
export interface SalesSummary {
  /** Total revenue in cents */
  totalRevenue: number;
  /** Total units sold */
  totalSales: number;
  /** Gross revenue before fees (cents) */
  grossRevenue: number;
  /** Net revenue after fees (cents) */
  netRevenue: number;
  /** Period start date ISO string */
  periodStart: string;
  /** Period end date ISO string */
  periodEnd: string;
  /** Array of daily records */
  dailyData: DailySales[];
  /** Total revenue per channel in cents */
  byChannel: Record<Channel, number>;
  /** Revenue change percentage from previous period */
  revenueChange: {
    percentage: number;
    trend: "up" | "down" | "stable";
  };
  /** Time range for the data (for internal use) */
  periodRange?: '7d' | '30d' | '90d';
}

/**
 * Daily fan count record for historical tracking.
 */
export interface FanData {
  /** ISO date string */
  date: string;
  /** Total fans on that date */
  count: number;
  /** Active fans (engaged in last 30 days) */
  activeFans: number;
}

/**
 * Comprehensive fan engagement metrics.
 */
export interface EngagementMetrics {
  /** Current total fan count */
  totalFans: number;
  /** Fans who have made a purchase */
  totalBuyers: number;
  /** Fans active in last 30 days */
  activeFans: number;
  /** Fan growth metrics */
  fanGrowth: {
    /** Net new fans in period */
    absolute: number;
    /** Growth rate percentage (e.g., 12.5 for 12.5%) */
    percentage: number;
    /** Trend direction */
    trend: "up" | "down" | "stable";
  };
  /** Engagement rate metrics */
  engagementRate: {
    /** Percentage of fans who engaged (e.g., 4.2 for 4.2%) */
    value: number;
    /** Trend direction */
    trend: "up" | "down" | "stable";
    /** Change from previous period */
    change: number;
  };
  /** Purchase rate metrics */
  purchaseRate: {
    /** Percentage of fans who purchased (e.g., 8.5 for 8.5%) */
    value: number;
    /** Trend direction */
    trend: "up" | "down" | "stable";
    /** Change from previous period */
    change: number;
  };
  /** Daily fan counts for chart */
  fanHistory: FanData[];
  /** Top fans by purchase value (optional, for future) */
  topFans?: Array<{
    id: string;
    displayName: string;
    totalSpent: number;
    purchaseCount: number;
  }>;
}

/**
 * Standard API response wrapper for consistent error handling.
 */
export interface ApiResponse<T> {
  /** Response data on success */
  data?: T;
  /** Error information on failure */
  error?: {
    code: string;
    message: string;
  };
  /** HTTP status code */
  status: number;
}

/**
 * API endpoint response types.
 */
export type ReleasesResponse = ApiResponse<Release[]>;
export type SalesResponse = ApiResponse<SalesSummary>;
export type EngagementResponse = ApiResponse<EngagementMetrics>;

/**
 * Fan data for display purposes
 */
export interface Fan {
  id: string;
  displayName: string;
  totalSpent: number;
  purchaseCount: number;
  avatarUrl?: string;
}