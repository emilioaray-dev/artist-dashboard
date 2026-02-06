"use client";

import { Release } from "@/types";
import { ReleaseCard } from "@/components/ui/customs/cards/ReleaseCard";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/ui/customs/feedback/EmptyState";
import { Button } from "@/components/ui/core/button";
import { Music } from "lucide-react";
import { useTranslations } from "next-intl";

type ReleasesGridProps = {
  releases: Release[];
};

/**
 * Responsive grid of releases with 3 cols desktop, 2 tablet, 1 mobile
 * StaggerContainer wrapping FadeIn children
 */
export function ReleasesGrid({ releases }: ReleasesGridProps) {
  const t = useTranslations("Releases");
  const tCommon = useTranslations("Common");

  if (!releases || releases.length === 0) {
    return (
      <EmptyState
        title={t("noReleases")}
        description={t("noReleasesDescription")}
        action={
          <Button>
            <Music className="mr-2 size-4" />
            {tCommon("addRelease")}
          </Button>
        }
      />
    );
  }

  return (
    <StaggerContainer>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {releases.map((release, index) => (
          <FadeIn key={release.id}>
            <ReleaseCard release={release} priority={index < 3} />
          </FadeIn>
        ))}
      </div>
    </StaggerContainer>
  );
}
