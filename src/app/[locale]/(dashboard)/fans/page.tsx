import type { Metadata } from "next";
import { SITE_PRODUCTION_URL } from "@/lib/constants";
import FansPageServer from "./_components/FansPageServer";

export const metadata: Metadata = {
  title: "Fans | MUSIC Backstage",
  description: "Track your community growth and engagement",
  openGraph: {
    title: "Fans | MUSIC Backstage",
    description: "Track your community growth and engagement",
    url: `${SITE_PRODUCTION_URL}/fans`,
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
    title: "Fans | MUSIC Backstage",
    description: "Track your community growth and engagement",
    images: ["/images/android-chrome-512x512.png"],
  },
};

export default function FansPage() {
  return <FansPageServer />;
}
