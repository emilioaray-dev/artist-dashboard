"use client";

import { Suspense } from "react";
import { ClientMetricCard } from "@/components/ui/customs/cards/ClientMetricCard";
import { FanGrowthChart } from "@/components/ui/customs/charts/FanGrowthChart";
import { TopFans } from "@/components/ui/customs/lists/TopFans";
import { formatNumber } from "@/lib/utils";
import { useEngagement } from "@/hooks/useApiData";
import { MetricCardSkeleton } from "@/components/ui/customs/feedback/MetricCardSkeleton";
import { FadeInAnimation } from "@/components/motion/AnimationUtils";
import { EngagementMetrics } from "@/types";
import { useLocale, useTranslations } from "next-intl";

interface FansPageContentProps {
  initialEngagement?: EngagementMetrics;
}

function FansPageInner({ initialEngagement }: FansPageContentProps) {
  const { data: engagement, isLoading, error: isError } = useEngagement();
  const locale = useLocale();
  const t = useTranslations("Fans");
  const tCommon = useTranslations("Common");

  // Use initial data if available, otherwise use SWR data
  const finalEngagement = initialEngagement || engagement;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <FadeInAnimation duration={0.3}>
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("loading")}</p>
          </div>
        </FadeInAnimation>
        <div className="p-4">{tCommon("loading")}</div>
      </div>
    );
  }

  if (isError || !finalEngagement) {
    return (
      <div className="container mx-auto py-6">
        <FadeInAnimation duration={0.3}>
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("errorLoading")}</p>
          </div>
        </FadeInAnimation>
        <div className="text-destructive p-4">
          {isError ? t("errorFanData") : t("noEngagement")}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <FadeInAnimation duration={0.3}>
        <div className="mb-8">
          <h1 className="text-foreground text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </FadeInAnimation>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title={t("totalFans")}
            value={formatNumber(finalEngagement.totalFans, locale)}
            change={finalEngagement.fanGrowth.percentage}
            icon="Users"
            delay={0}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title={t("activeBuyers")}
            value={formatNumber(finalEngagement.totalBuyers, locale)}
            change={finalEngagement.purchaseRate.change}
            icon="UserCheck"
            delay={0.05}
          />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ClientMetricCard
            title={t("engagementRate")}
            value={`${finalEngagement.engagementRate.value}%`}
            change={finalEngagement.engagementRate.change}
            icon="Heart"
            delay={0.1}
          />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FanGrowthChart engagementData={finalEngagement} />
        </div>
        <div>
          <TopFans fans={finalEngagement.topFans || []} />
        </div>
      </div>
    </div>
  );
}

export default function FansPageContent({
  initialEngagement,
}: FansPageContentProps) {
  const t = useTranslations("Fans");
  const tCommon = useTranslations("Common");

  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6">
          <FadeInAnimation duration={0.3}>
            <div className="mb-8">
              <h1 className="text-foreground text-2xl font-bold">
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-1">{t("loading")}</p>
            </div>
          </FadeInAnimation>
          <div className="p-4">{tCommon("loading")}</div>
        </div>
      }
    >
      <FansPageInner initialEngagement={initialEngagement} />
    </Suspense>
  );
}
