import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_PRODUCTION_URL } from "@/lib/constants";
import { dataService } from "@/lib/data-service";
import { generateReleaseSalesData } from "@/__mocks__/sales";
import ReleaseDetailContent from "./_components/ReleaseDetailContent";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const response = await dataService.getReleases();
  const release = response.data?.find((r) => r.id === id) ?? null;

  if (!release) {
    return {
      title: "Release Not Found | MUSIC Backstage",
      description: "The release you're looking for doesn't exist.",
    };
  }

  return {
    title: `${release.title} | MUSIC Backstage`,
    description: `Details for ${release.title} release`,
    openGraph: {
      title: `${release.title} | MUSIC Backstage`,
      description: `Details for ${release.title} release`,
      url: `${SITE_PRODUCTION_URL}/releases/${id}`,
      siteName: "MUSIC Backstage",
      images: [
        {
          url: release.coverArtUrl || "/images/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: `${release.title} Cover`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${release.title} | MUSIC Backstage`,
      description: `Details for ${release.title} release`,
      images: [release.coverArtUrl || "/images/android-chrome-512x512.png"],
    },
  };
}

export async function generateStaticParams() {
  const response = await dataService.getReleases();
  const releases = response.data ?? [];
  return releases.map((release) => ({ id: release.id }));
}

export default async function ReleaseDetailPage({ params }: Readonly<Props>) {
  const { id } = await params;
  const response = await dataService.getReleases();
  const release = response.data?.find((r) => r.id === id) ?? null;

  if (!release) {
    notFound();
  }

  const dailySales = generateReleaseSalesData(release);

  return <ReleaseDetailContent release={release} dailySales={dailySales} />;
}
