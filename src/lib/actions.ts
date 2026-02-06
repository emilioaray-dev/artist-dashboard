// src/lib/actions.ts
"use server";

import { unstable_cache } from "next/cache";
import { Release, SalesSummary, EngagementMetrics, Fan } from "@/types";
import { dataService } from "@/lib/data-service";

// Fetch data directly from the data service (no HTTP round-trip needed
// in Server Components — see Next.js data-patterns best practice).

export const getCachedReleases = unstable_cache(
  async (): Promise<Release[]> => {
    const response = await dataService.getReleases();
    if (response.status !== 200 || !response.data) {
      throw new Error(response.error?.message ?? "Failed to fetch releases");
    }
    return response.data;
  },
  ["releases-data"],
  {
    revalidate: 3600,
    tags: ["releases"],
  },
);

export const getCachedSales = unstable_cache(
  async (range: "7d" | "30d" | "90d" = "30d"): Promise<SalesSummary> => {
    const response = await dataService.getSales(range);
    if (response.status !== 200 || !response.data) {
      throw new Error(
        response.error?.message ?? `Failed to fetch sales for range ${range}`,
      );
    }
    return response.data;
  },
  ["sales-data", "range"],
  {
    revalidate: 1800,
    tags: ["sales"],
  },
);

export const getCachedEngagement = unstable_cache(
  async (): Promise<EngagementMetrics> => {
    const response = await dataService.getEngagement();
    if (response.status !== 200 || !response.data) {
      throw new Error(response.error?.message ?? "Failed to fetch engagement");
    }
    return response.data;
  },
  ["engagement-data"],
  {
    revalidate: 1800,
    tags: ["engagement"],
  },
);

export const getCachedReleaseById = unstable_cache(
  async (id: string): Promise<Release | null> => {
    const response = await dataService.getReleases();
    if (response.status !== 200 || !response.data) {
      throw new Error(
        response.error?.message ?? `Failed to fetch release ${id}`,
      );
    }
    return response.data.find((r) => r.id === id) ?? null;
  },
  ["release-by-id", "id"],
  {
    revalidate: 7200,
    tags: ["releases"],
  },
);

export const getCachedTopFans = unstable_cache(
  async (limit: number = 5): Promise<Fan[]> => {
    const response = await dataService.getTopFans();
    if (response.status !== 200 || !response.data) {
      throw new Error(response.error?.message ?? "Failed to fetch top fans");
    }
    return response.data.slice(0, limit);
  },
  ["top-fans", "limit"],
  {
    revalidate: 3600,
    tags: ["fans"],
  },
);
