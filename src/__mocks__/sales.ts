import { SalesSummary, DailySales, Channel } from "@/types";

// Helper function to generate date range
function generateDateRange(startDate: string, days: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Helper function to generate mock daily sales data
function generateDailySales(dates: string[], baseRevenue: number, variation: number = 0.2): DailySales[] {
  return dates.map((date) => {
    // Add some variation to make it look more realistic
    const dailyVariation = 1 + (Math.random() - 0.5) * variation;
    const revenue = Math.round(baseRevenue * dailyVariation);
    const sales = Math.round(revenue / 20); // Assume avg $20 per sale
    
    // Distribute revenue across channels
    const directToFanPercent = 0.5 + Math.random() * 0.2; // 50-70%
    const digitalPercent = 0.2 + Math.random() * 0.2;     // 20-40%
    const physicalPercent = 0.1 + Math.random() * 0.1;    // 10-20%
    const bundlesPercent = 0.1;                           // 10%
    
    return {
      date,
      revenue,
      sales,
      revenueByChannel: {
        direct_to_fan: Math.round(revenue * directToFanPercent),
        digital: Math.round(revenue * digitalPercent),
        physical: Math.round(revenue * physicalPercent),
        bundles: Math.round(revenue * bundlesPercent)
      },
      salesByChannel: {
        direct_to_fan: Math.round(sales * directToFanPercent),
        digital: Math.round(sales * digitalPercent),
        physical: Math.round(sales * physicalPercent),
        bundles: Math.round(sales * bundlesPercent)
      }
    };
  });
}

// Generate mock sales data for different time ranges
const sevenDays = generateDateRange("2026-01-28", 7);
const thirtyDays = generateDateRange("2026-01-05", 30);
const ninetyDays = generateDateRange("2025-11-06", 90);

const sevenDaySales = generateDailySales(sevenDays, 150000); // ~$1,500/day
const thirtyDaySales = generateDailySales(thirtyDays, 140000); // ~$1,400/day
const ninetyDaySales = generateDailySales(ninetyDays, 120000); // ~$1,200/day

// Calculate totals for each range
function calculateTotals(dailyData: DailySales[]) {
  let totalRevenue = 0;
  let totalSales = 0;
  const byChannel: Record<Channel, number> = {
    direct_to_fan: 0,
    digital: 0,
    physical: 0,
    bundles: 0
  };

  for (const day of dailyData) {
    totalRevenue += day.revenue;
    totalSales += day.sales;
    
    for (const channel of Object.keys(day.revenueByChannel) as Channel[]) {
      byChannel[channel] += day.revenueByChannel[channel];
    }
  }

  return { totalRevenue, totalSales, byChannel };
}

const sevenDayTotals = calculateTotals(sevenDaySales);
const thirtyDayTotals = calculateTotals(thirtyDaySales);
const ninetyDayTotals = calculateTotals(ninetyDaySales);

// Mock sales data for different time ranges
export const mockSales: SalesSummary[] = [
  {
    periodRange: '7d',
    totalRevenue: sevenDayTotals.totalRevenue,
    totalSales: sevenDayTotals.totalSales,
    grossRevenue: Math.round(sevenDayTotals.totalRevenue * 1.1), // 10% fee
    netRevenue: sevenDayTotals.totalRevenue,
    periodStart: sevenDays[0],
    periodEnd: sevenDays[6],
    dailyData: sevenDaySales,
    byChannel: sevenDayTotals.byChannel,
    revenueChange: {
      percentage: 5.2,
      trend: "up"
    }
  },
  {
    periodRange: '30d',
    totalRevenue: thirtyDayTotals.totalRevenue,
    totalSales: thirtyDayTotals.totalSales,
    grossRevenue: Math.round(thirtyDayTotals.totalRevenue * 1.1), // 10% fee
    netRevenue: thirtyDayTotals.totalRevenue,
    periodStart: thirtyDays[0],
    periodEnd: thirtyDays[29],
    dailyData: thirtyDaySales,
    byChannel: thirtyDayTotals.byChannel,
    revenueChange: {
      percentage: 3.1,
      trend: "up"
    }
  },
  {
    periodRange: '90d',
    totalRevenue: ninetyDayTotals.totalRevenue,
    totalSales: ninetyDayTotals.totalSales,
    grossRevenue: Math.round(ninetyDayTotals.totalRevenue * 1.1), // 10% fee
    netRevenue: ninetyDayTotals.totalRevenue,
    periodStart: ninetyDays[0],
    periodEnd: ninetyDays[89],
    dailyData: ninetyDaySales,
    byChannel: ninetyDayTotals.byChannel,
    revenueChange: {
      percentage: -1.2,
      trend: "down"
    }
  }
];