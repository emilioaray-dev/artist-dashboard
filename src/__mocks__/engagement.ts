import { EngagementMetrics, FanData } from "@/types";
import { mockFans } from "./fans";

// Helper function to generate date range
function generateDateRange(startDate: string, days: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
}

// Generate fan history data
const fanHistoryDates = generateDateRange("2025-11-06", 90);
const fanHistory: FanData[] = fanHistoryDates.map((date, index) => {
  // Start with 100k fans and grow to 125k over 90 days
  const baseCount = 100000 + Math.floor(index * 277); // ~277 new fans per day
  // Add some variation
  const variation = Math.floor(Math.random() * 1000) - 500;
  const count = baseCount + variation;
  // Active fans are roughly 35-40% of total fans
  const activeFans = Math.floor(count * (0.35 + Math.random() * 0.05));

  return {
    date,
    count,
    activeFans,
  };
});

// Calculate engagement metrics
const totalFans = fanHistory.at(-1)!.count;
const totalBuyers = Math.floor(totalFans * 0.085); // 8.5% purchase rate
const activeFans = fanHistory.at(-1)!.activeFans;

// Calculate fan growth
const initialFanCount = fanHistory[0].count;
const fanGrowthAbsolute = totalFans - initialFanCount;
const fanGrowthPercentage = (fanGrowthAbsolute / initialFanCount) * 100;
type Trend = "up" | "down" | "stable";

function getTrend(value: number, upperThreshold: number, lowerThreshold: number): Trend {
  if (value > upperThreshold) return "up";
  if (value < lowerThreshold) return "down";
  return "stable";
}

const fanGrowthTrend = getTrend(fanGrowthPercentage, 0.5, -0.5);

// Calculate engagement rate
const engagementRateValue = (activeFans / totalFans) * 100;
const engagementRateTrend = getTrend(engagementRateValue, 37, 35);
const engagementRateChange = 2.3; // Example change from previous period

// Calculate purchase rate
const purchaseRateValue = (totalBuyers / totalFans) * 100;
const purchaseRateTrend = getTrend(purchaseRateValue, 8.5, 8);
const purchaseRateChange = 0.8; // Example change from previous period

export const mockEngagement: EngagementMetrics = {
  totalFans,
  totalBuyers,
  activeFans,
  fanGrowth: {
    absolute: fanGrowthAbsolute,
    percentage: Number.parseFloat(fanGrowthPercentage.toFixed(1)),
    trend: fanGrowthTrend,
  },
  engagementRate: {
    value: Number.parseFloat(engagementRateValue.toFixed(1)),
    trend: engagementRateTrend,
    change: engagementRateChange,
  },
  purchaseRate: {
    value: Number.parseFloat(purchaseRateValue.toFixed(1)),
    trend: purchaseRateTrend,
    change: purchaseRateChange,
  },
  fanHistory,
  topFans: mockFans, // Using the mock fans data
};
