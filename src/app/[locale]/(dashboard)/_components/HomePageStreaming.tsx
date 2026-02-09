import { ClientMetricCard } from "@/components/ui/customs/cards/ClientMetricCard";
import { RecentReleasesList } from "@/components/ui/customs/lists/RecentReleasesList";
import { DynamicRevenueChart } from "@/components/ui/customs/charts/DynamicRevenueChart";
import { MetricCardSkeleton } from "@/components/ui/customs/feedback/MetricCardSkeleton";
import { RevenueChartSkeleton } from "@/components/ui/customs/feedback/RevenueChartSkeleton";
import { DynamicFanGrowthChart } from "@/components/ui/customs/charts/DynamicFanGrowthChart";
import { TopFans } from "@/components/ui/customs/lists/TopFans";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  getCachedEngagement,
  getCachedReleases,
  getCachedSales,
} from "@/lib/actions";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Release } from "@/types";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

// Separate components for each section to enable streaming
async function RevenueSection() {
  const t = await getTranslations("Overview");
  let sales;
  try {
    sales = await getCachedSales("30d");
  } catch {
    // Falls back to client-side fetching via SWR
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">{t("revenue")}</h2>
      {sales ? (
        <DynamicRevenueChart initialSalesData={sales} />
      ) : (
        <p>{t("noSalesData")}</p>
      )}
    </div>
  );
}

async function FanEngagementSection() {
  const t = await getTranslations("Overview");
  let engagement;
  try {
    engagement = await getCachedEngagement();
  } catch {
    // Falls back to client-side fetching via SWR
  }

  if (!engagement) {
    return <div>{t("noEngagementData")}</div>;
  }

  return <DynamicFanGrowthChart engagementData={engagement} />;
}

function ReleasesSection({ releases }: Readonly<{ releases: Release[] }>) {
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
  const t = await getTranslations("Overview");
  const locale = await getLocale();
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
  const revenueChange = sales?.revenueChange ?? {
    percentage: 0,
    trend: "stable" as const,
  };

  // Mock dashboard stats based on our data
  const mockDashboardStats = {
    totalRevenue: formatCurrency(totalRevenue, locale)
      .replaceAll(/[^0-9.,\s]/g, "")
      .trim(),
    revenueChange: revenueChange.percentage,
    totalFans: formatNumber(engagement?.totalFans || 0, locale),
    fanChange: engagement?.fanGrowth.percentage || 0,
    activeBuyers: formatNumber(engagement?.totalBuyers || 0, locale),
    buyerChange: engagement?.purchaseRate.change || 0,
    avgOrderValue: engagement
      ? new Intl.NumberFormat(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalRevenue / engagement.totalBuyers / 100)
      : "0.00",
    orderValueChange: 2.1,
  };

  return (
    <div className="container mx-auto">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {/* Stats Grid - 4 cards in a row on large screens */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title={t("totalRevenue")}
            value={mockDashboardStats.totalRevenue}
            change={mockDashboardStats.revenueChange}
            icon="DollarSign"
            prefix="$"
            delay={0}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title={t("totalFans")}
            value={mockDashboardStats.totalFans}
            change={mockDashboardStats.fanChange}
            icon="Users"
            delay={0.05}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title={t("activeBuyers")}
            value={mockDashboardStats.activeBuyers}
            change={mockDashboardStats.buyerChange}
            icon="ShoppingCart"
            delay={0.1}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title={t("avgOrderValue")}
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
          <Suspense fallback={<div>{t("loadingReleases")}</div>}>
            <ReleasesSection releases={releasesData || []} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div>{t("loadingTopFans")}</div>}>
            <TopFansSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default async function HomePageStreaming() {
  const t = await getTranslations("Overview");

  return (
    <Suspense
      fallback={
        <div className="container mx-auto">
          <PageHeader title={t("title")} subtitle={t("loadingDashboard")} />
          <div className="p-4">{t("loadingDashboard")}</div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
