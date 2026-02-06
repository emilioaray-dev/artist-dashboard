"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentReleasesList } from "@/components/dashboard/RecentReleasesList";
import { TopFans } from "@/components/dashboard/TopFans";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { fetchReleases, fetchSales, fetchEngagement } from "@/lib/api";
import { Release, SalesSummary, EngagementMetrics } from "@/types";
import { motion } from "motion/react";

export default function HomePageClient() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [sales, setSales] = useState<SalesSummary | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [releasesResponse, salesResponse, engagementResponse] = await Promise.all([
          fetchReleases(),
          fetchSales('30d'),
          fetchEngagement()
        ]);

        if (releasesResponse.data) {
          setReleases(releasesResponse.data);
        }
        if (salesResponse.data) {
          setSales(salesResponse.data);
        }
        if (engagementResponse.data) {
          setEngagement(engagementResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Loading dashboard data...
          </p>
        </motion.div>
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Error loading dashboard data
          </p>
        </motion.div>
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  // Calculate metrics if data is available
  const totalRevenue = sales ? sales.totalRevenue : 0;
  const netRevenue = sales ? sales.netRevenue : 0;
  const totalSales = sales ? sales.totalSales : 0;
  const revenueChange = sales ? sales.revenueChange : { percentage: 0, trend: "stable" as const };

  // Mock dashboard stats based on our data
  const mockDashboardStats = {
    totalRevenue: formatCurrency(totalRevenue).replace('$', ''),
    revenueChange: revenueChange.percentage,
    totalFans: engagement?.totalFans || 0,
    fanChange: engagement?.fanGrowth.percentage || 0,
    activeBuyers: engagement?.totalBuyers || 0,
    buyerChange: engagement?.purchaseRate.change || 0,
    avgOrderValue: engagement ? (totalRevenue / engagement.totalBuyers / 100).toFixed(2) : '0.00',
    orderValueChange: 2.1
  };

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Your dashboard for direct-to-fan performance
        </p>
      </motion.div>

      {/* Stats Grid - 4 cards in a row on large screens */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={mockDashboardStats.totalRevenue}
          change={mockDashboardStats.revenueChange}
          icon={DollarSign}
          prefix="$"
          delay={0}
        />
        <MetricCard
          title="Total Fans"
          value={mockDashboardStats.totalFans.toString()}
          change={mockDashboardStats.fanChange}
          icon={Users}
          delay={0.05}
        />
        <MetricCard
          title="Active Buyers"
          value={mockDashboardStats.activeBuyers.toString()}
          change={mockDashboardStats.buyerChange}
          icon={ShoppingCart}
          delay={0.1}
        />
        <MetricCard
          title="Avg. Order Value"
          value={mockDashboardStats.avgOrderValue}
          change={mockDashboardStats.orderValueChange}
          icon={TrendingUp}
          prefix="$"
          delay={0.15}
        />
      </div>

      {/* Charts Section - Two charts side by side */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sales ? <RevenueChart salesData={sales} /> : <div>No sales data available</div>}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Fan Engagement</h3>
          <p className="text-muted-foreground">Engagement chart coming soon...</p>
        </div>
      </div>

      {/* Bottom Section - Recent Releases on left, Top Fans on right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentReleasesList releases={releases} />
        </div>
        <div>
          <TopFans fans={engagement?.topFans || []} />
        </div>
      </div>
    </div>
  );
}