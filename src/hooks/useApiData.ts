// src/hooks/useApiData.ts
import useSWR, { SWRConfiguration, KeyedMutator } from "swr";
import { Release, SalesSummary, EngagementMetrics } from "@/types";

// Fetcher con manejo de errores
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(
      `HTTP error! Status: ${response.status}`,
    ) as Error & { status: number; statusText: string };
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  return response.json();
};

interface ApiResponse<T, Raw = { data: T }> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<Raw>;
}

export function useReleases(
  config: SWRConfiguration = {},
): ApiResponse<Release[]> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: Release[] },
    Error
  >("/api/releases", fetcher, config);

  return {
    data: data?.data || [],
    error: error || null,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useSales(
  range: "7d" | "30d" | "90d" = "30d",
  config: SWRConfiguration = {},
): ApiResponse<SalesSummary> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: SalesSummary },
    Error
  >(`/api/sales?range=${range}`, fetcher, config);

  return {
    data: data?.data,
    error: error || null,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useEngagement(
  config: SWRConfiguration = {},
): ApiResponse<EngagementMetrics> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: EngagementMetrics },
    Error
  >("/api/engagement", fetcher, config);

  return {
    data: data?.data,
    error: error || null,
    isLoading,
    isValidating,
    mutate,
  };
}
