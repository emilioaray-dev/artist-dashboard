import type { Metadata } from "next";
import { SITE_PRODUCTION_URL } from "@/lib/constants";
import ReleasesPageServer from "./_components/ReleasesPageServer";

export const metadata: Metadata = {
  title: "Releases | MUSIC Backstage",
  description: "Manage and track your exclusive drops",
  openGraph: {
    title: "Releases | MUSIC Backstage",
    description: "Manage and track your exclusive drops",
    url: `${SITE_PRODUCTION_URL}/releases`,
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
    title: "Releases | MUSIC Backstage",
    description: "Manage and track your exclusive drops",
    images: ["/images/android-chrome-512x512.png"],
    site: "@musicbackstage",
  },
};

export default function ReleasesPage() {
  return <ReleasesPageServer />;
}
