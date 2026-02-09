"use client";

import { Suspense, useState } from "react";
import { ReleasesGrid } from "@/components/ui/customs/lists/ReleasesGrid";
import { ReleaseUploadDialog } from "@/components/ui/customs/forms/ReleaseUploadDialog";
import { useReleases } from "@/hooks/useApiData";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/core/button";
import { Plus } from "lucide-react";
import { Release } from "@/types";
import { useTranslations } from "next-intl";

interface ReleasesPageContentProps {
  initialReleases?: Release[];
}

function ReleasesPageInner({
  initialReleases,
}: Readonly<ReleasesPageContentProps>) {
  const { data: releases, isLoading, error: isError } = useReleases();
  const t = useTranslations("Releases");
  const tCommon = useTranslations("Common");
  const tUpload = useTranslations("ReleaseUpload");
  const [uploadOpen, setUploadOpen] = useState(false);

  // Use initial data if available, otherwise use SWR data
  const finalReleases = initialReleases || releases;

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <PageHeader title={t("title")} subtitle={t("loading")} />
        <div className="p-4">{tCommon("loading")}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto">
        <PageHeader title={t("title")} subtitle={t("errorLoading")} />
        <div className="text-destructive p-4">{t("errorLoading")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="mr-2 size-4" />
            {tUpload("addRelease")}
          </Button>
        }
      />

      <ReleasesGrid
        releases={finalReleases || []}
        onAddRelease={() => setUploadOpen(true)}
      />

      <ReleaseUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}

export default function ReleasesPageContent({
  initialReleases,
}: Readonly<ReleasesPageContentProps>) {
  const t = useTranslations("Releases");
  const tCommon = useTranslations("Common");

  return (
    <Suspense
      fallback={
        <div className="container mx-auto">
          <PageHeader title={t("title")} subtitle={t("loading")} />
          <div className="p-4">{tCommon("loading")}</div>
        </div>
      }
    >
      <ReleasesPageInner initialReleases={initialReleases} />
    </Suspense>
  );
}
