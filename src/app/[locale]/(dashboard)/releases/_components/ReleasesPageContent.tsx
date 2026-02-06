"use client";

import { Suspense } from "react";
import { ReleasesGrid } from "@/components/ui/customs/lists/ReleasesGrid";
import { useReleases } from "@/hooks/useApiData";
import { FadeInAnimation } from "@/components/motion/AnimationUtils";
import { Release } from "@/types";
import { useTranslations } from "next-intl";

interface ReleasesPageContentProps {
  initialReleases?: Release[];
}

function ReleasesPageInner({ initialReleases }: ReleasesPageContentProps) {
  const { data: releases, isLoading, error: isError } = useReleases();
  const t = useTranslations("Releases");
  const tCommon = useTranslations("Common");

  // Use initial data if available, otherwise use SWR data
  const finalReleases = initialReleases || releases;

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

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <FadeInAnimation duration={0.3}>
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("errorLoading")}</p>
          </div>
        </FadeInAnimation>
        <div className="text-destructive p-4">{t("errorLoading")}</div>
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

      <ReleasesGrid releases={finalReleases || []} />
    </div>
  );
}

export default function ReleasesPageContent({
  initialReleases,
}: ReleasesPageContentProps) {
  const t = useTranslations("Releases");
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
      <ReleasesPageInner initialReleases={initialReleases} />
    </Suspense>
  );
}
