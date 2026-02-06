// src/app/releases/components/ReleasesPageServer.tsx
import { getCachedReleases } from "@/lib/actions";
import ReleasesPageContent from "./ReleasesPageContent";

export default async function ReleasesPageServer() {
  let releases;
  try {
    releases = await getCachedReleases();
  } catch {
    // Falls back to client-side fetching via SWR
  }

  return <ReleasesPageContent initialReleases={releases} />;
}
