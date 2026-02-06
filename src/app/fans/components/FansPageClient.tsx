"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FanGrowthChart } from "@/components/dashboard/FanGrowthChart";
import { TopFans } from "@/components/dashboard/TopFans";
import { Users, UserCheck, Heart } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { EngagementMetrics } from "@/types";
import { fetchEngagement } from "@/lib/api";
import { motion } from "motion/react";

export default function FansPageClient() {
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetchEngagement();
        if (response.data) {
          setEngagement(response.data);
        } else {
          setError(response.error?.message || "Failed to fetch engagement data");
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
          <h1 className="text-2xl font-bold text-foreground">Fans</h1>
          <p className="mt-1 text-muted-foreground">
            Loading fan engagement data...
          </p>
        </motion.div>
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (error || !engagement) {
    return (
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Fans</h1>
          <p className="mt-1 text-muted-foreground">
            Error loading fan engagement data
          </p>
        </motion.div>
        <div className="p-4 text-red-500">{error || "No engagement data available"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Fans</h1>
        <p className="mt-1 text-muted-foreground">
          Track your community growth and engagement
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total Fans"
          value={formatNumber(engagement.totalFans)}
          change={engagement.fanGrowth.percentage}
          icon={Users}
          delay={0}
        />
        <MetricCard
          title="Active Buyers"
          value={formatNumber(engagement.totalBuyers)}
          change={engagement.purchaseRate.change}
          icon={UserCheck}
          delay={0.05}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${engagement.engagementRate.value}%`}
          change={engagement.engagementRate.change}
          icon={Heart}
          delay={0.1}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FanGrowthChart engagementData={engagement} />
        </div>
        <div>
          <TopFans fans={engagement.topFans || []} />
        </div>
      </div>
    </div>
  );
}