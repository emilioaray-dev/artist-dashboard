// src/app/fans/components/FansPageServer.tsx
import { getCachedEngagement } from "@/lib/actions";
import FansPageContent from "./FansPageContent";

export default async function FansPageServer() {
  let engagement;
  try {
    engagement = await getCachedEngagement();
  } catch {
    // Falls back to client-side fetching via SWR
  }

  return <FansPageContent initialEngagement={engagement} />;
}
