// src/app/releases/components/ReleasesPageWithSuspense.tsx
"use client";

import { Suspense } from "react";
import { ReleasesGrid } from "@/components/ui/customs/lists/ReleasesGrid";
import { useReleases } from "@/hooks/useApiData";
import { FadeInAnimation } from "@/components/motion/AnimationUtils";
import { Release } from "@/types";

interface ReleasesPageContentProps {
  initialReleases?: Release[];
}

function ReleasesPageInner({ initialReleases }: ReleasesPageContentProps) {
  const { data: releases, isLoading, error: isError } = useReleases();

  // Use initial data if available, otherwise use SWR data
  const finalReleases = initialReleases || releases;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <FadeInAnimation duration={0.3}>
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-bold">Releases</h1>
            <p className="text-muted-foreground mt-1">Loading releases...</p>
          </div>
        </FadeInAnimation>
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <FadeInAnimation duration={0.3}>
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-bold">Releases</h1>
            <p className="text-muted-foreground mt-1">Error loading releases</p>
          </div>
        </FadeInAnimation>
        <div className="text-destructive p-4">Error loading releases</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <FadeInAnimation duration={0.3}>
        <div className="mb-8">
          <h1 className="text-foreground text-2xl font-bold">Releases</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your exclusive drops
          </p>
        </div>
      </FadeInAnimation>

      <ReleasesGrid releases={finalReleases || []} />
    </div>
  );
}

export default function ReleasesPageContent({
  initialReleases,
}: ReleasesPageContentProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6">
          <FadeInAnimation duration={0.3}>
            <div className="mb-8">
              <h1 className="text-foreground text-2xl font-bold">Releases</h1>
              <p className="text-muted-foreground mt-1">Loading releases...</p>
            </div>
          </FadeInAnimation>
          <div className="p-4">Loading...</div>
        </div>
      }
    >
      <ReleasesPageInner initialReleases={initialReleases} />
    </Suspense>
  );
}
