import type { Metadata } from "next";
import { SITE_PRODUCTION_URL } from "@/lib/constants";
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
      url: SITE_PRODUCTION_URL,
      siteName: "MUSIC Backstage",
      images: [
        {
          url: "/images/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "MUSIC Backstage Logo",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: ["/images/android-chrome-512x512.png"],
      site: "@musicbackstage",
    },
  };
}

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground landing-page min-h-dvh">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
