import { notFound } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { generateReleaseSalesData } from "@/__mocks__/sales";
import ReleaseDetailContent from "./_components/ReleaseDetailContent";

type Props = {
  params: Promise<{ id: string }>;
};

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
