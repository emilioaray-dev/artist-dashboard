import type { Metadata } from "next";
import { SITE_PRODUCTION_URL } from "@/lib/constants";
import SettingsPageClient from "./_components/SettingsPageClient";

export const metadata: Metadata = {
  title: "Settings | MUSIC Backstage",
  description: "Manage your account settings and preferences",
  openGraph: {
    title: "Settings | MUSIC Backstage",
    description: "Manage your account settings and preferences",
    url: `${SITE_PRODUCTION_URL}/settings`,
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
    title: "Settings | MUSIC Backstage",
    description: "Manage your account settings and preferences",
    images: ["/images/android-chrome-512x512.png"],
  },
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
