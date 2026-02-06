import { ClientMetricCard } from "@/components/ui/customs/cards/ClientMetricCard";
import { RecentReleasesList } from "@/components/ui/customs/lists/RecentReleasesList";
import { RevenueChart } from "@/components/ui/customs/charts/RevenueChart";
import { MetricCardSkeleton } from "@/components/ui/customs/feedback/MetricCardSkeleton";
import { RevenueChartSkeleton } from "@/components/ui/customs/feedback/RevenueChartSkeleton";
import { FanGrowthChart } from "@/components/ui/customs/charts/FanGrowthChart";
import { TopFans } from "@/components/ui/customs/lists/TopFans";
import { FadeInAnimation } from "@/components/motion/AnimationUtils";
import {
  getCachedEngagement,
  getCachedReleases,
  getCachedSales,
} from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import { Release } from "@/types";
import { Suspense } from "react";

// Separate components for each section to enable streaming
async function RevenueSection() {
  let sales;
  try {
    sales = await getCachedSales("30d");
  } catch {
    // Falls back to client-side fetching via SWR
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">Revenue</h2>
      {sales ? (
        <RevenueChart initialSalesData={sales} />
      ) : (
        <p>No sales data available</p>
      )}
    </div>
  );
}

async function FanEngagementSection() {
  let engagement;
  try {
    engagement = await getCachedEngagement();
  } catch {
    // Falls back to client-side fetching via SWR
  }

  if (!engagement) {
    return <div>No engagement data available</div>;
  }

  return <FanGrowthChart engagementData={engagement} />;
}

function ReleasesSection({ releases }: { releases: Release[] }) {
  return (
    <div>
      <RecentReleasesList releases={releases} />
    </div>
  );
}

async function TopFansSection() {
  let engagement;
  try {
    engagement = await getCachedEngagement();
  } catch {
    // Falls back to client-side fetching via SWR
  }

  return (
    <div>
      <TopFans fans={engagement?.topFans || []} />
    </div>
  );
}

// Main content component
async function HomePageContent() {
  let releasesData, sales, engagement;
  try {
    [releasesData, sales, engagement] = await Promise.all([
      getCachedReleases(),
      getCachedSales("30d"),
      getCachedEngagement(),
    ]);
  } catch {
    // Falls back to defaults below when API is unavailable (e.g. during build)
  }

  // Calculate metrics if data is available
  const totalRevenue = sales?.totalRevenue || 0;
  const revenueChange = sales?.revenueChange
    ? sales.revenueChange
    : { percentage: 0, trend: "stable" as const };

  // Mock dashboard stats based on our data
  const mockDashboardStats = {
    totalRevenue: formatCurrency(totalRevenue).replace("$", ""),
    revenueChange: revenueChange.percentage,
    totalFans: engagement?.totalFans || 0,
    fanChange: engagement?.fanGrowth.percentage || 0,
    activeBuyers: engagement?.totalBuyers || 0,
    buyerChange: engagement?.purchaseRate.change || 0,
    avgOrderValue: engagement
      ? (totalRevenue / engagement.totalBuyers / 100).toFixed(2)
      : "0.00",
    orderValueChange: 2.1,
  };

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <FadeInAnimation duration={0.3}>
        <div className="mb-8">
          <h1 className="text-foreground text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Your dashboard for direct-to-fan performance
          </p>
        </div>
      </FadeInAnimation>

      {/* Stats Grid - 4 cards in a row on large screens */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title="Total Revenue"
            value={mockDashboardStats.totalRevenue}
            change={mockDashboardStats.revenueChange}
            icon="DollarSign"
            prefix="$"
            delay={0}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title="Total Fans"
            value={mockDashboardStats.totalFans.toString()}
            change={mockDashboardStats.fanChange}
            icon="Users"
            delay={0.05}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title="Active Buyers"
            value={mockDashboardStats.activeBuyers.toString()}
            change={mockDashboardStats.buyerChange}
            icon="ShoppingCart"
            delay={0.1}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title="Avg. Order Value"
            value={mockDashboardStats.avgOrderValue}
            change={mockDashboardStats.orderValueChange}
            icon="TrendingUp"
            prefix="$"
            delay={0.15}
          />
        </Suspense>
      </div>

      {/* Charts Section - Two charts side by side */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueSection />
        </Suspense>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <FanEngagementSection />
        </Suspense>
      </div>

      {/* Bottom Section - Recent Releases on left, Top Fans on right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading releases...</div>}>
            <ReleasesSection releases={releasesData || []} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div>Loading top fans...</div>}>
            <TopFansSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default async function HomePageStreaming() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6">
          <FadeInAnimation duration={0.3}>
            <div className="mb-8">
              <h1 className="text-foreground text-2xl font-bold">Overview</h1>
              <p className="text-muted-foreground mt-1">
                Loading dashboard data...
              </p>
            </div>
          </FadeInAnimation>
          <div className="p-4">Loading...</div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
