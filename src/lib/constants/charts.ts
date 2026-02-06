import { Channel } from "@/types";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

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
