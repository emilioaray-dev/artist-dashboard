import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LandingFeatures } from "./_components/LandingFeatures";
import { LandingFooter } from "./_components/LandingFooter";
import { LandingHeader } from "./_components/LandingHeader";
import { LandingHero } from "./_components/LandingHero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Landing");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground landing-page min-h-dvh">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}
