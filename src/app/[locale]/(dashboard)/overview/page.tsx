import type { Metadata } from "next";
import { SITE_PRODUCTION_URL } from "@/lib/constants";
import HomePageStreaming from "../_components/HomePageStreaming";

export const metadata: Metadata = {
  title: "Overview | MUSIC Backstage",
  description: "Your dashboard for direct-to-fan performance",
  openGraph: {
    title: "Overview | MUSIC Backstage",
    description: "Your dashboard for direct-to-fan performance",
    url: `${SITE_PRODUCTION_URL}/overview`,
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
    title: "Overview | MUSIC Backstage",
    description: "Your dashboard for direct-to-fan performance",
    images: ["/images/android-chrome-512x512.png"],
    site: "@musicbackstage",
  },
};

export default function OverviewPage() {
  return <HomePageStreaming />;
}
