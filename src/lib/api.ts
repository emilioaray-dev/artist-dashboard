import {
  ReleasesResponse,
  SalesResponse,
  EngagementResponse,
} from "@/types";

/**
 * Fetches releases from the API
 * @returns Promise resolving to ReleasesResponse
 */
export async function fetchReleases(): Promise<ReleasesResponse> {
  try {
    // Use absolute URL for server-side compatibility
    const apiUrl =
      globalThis.window === undefined
        ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/releases`
        : "/api/releases";

    const response = await fetch(apiUrl);
    const data: ReleasesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching releases:", error);
    return {
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server",
      },
      status: 500,
    };
  }
}

/**
 * Fetches sales data from the API
 * @param range Time range for sales data ('7d', '30d', '90d')
 * @returns Promise resolving to SalesResponse
 */
export async function fetchSales(
  range: "7d" | "30d" | "90d" = "30d",
): Promise<SalesResponse> {
  try {
    // Use absolute URL for server-side compatibility
    const apiUrl =
      globalThis.window === undefined
        ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/sales?range=${range}`
        : `/api/sales?range=${range}`;

    const response = await fetch(apiUrl);
    const data: SalesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sales:", error);
    return {
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server",
      },
      status: 500,
    };
  }
}

/**
 * Fetches engagement metrics from the API
 * @returns Promise resolving to EngagementResponse
 */
export async function fetchEngagement(): Promise<EngagementResponse> {
  try {
    // Use absolute URL for server-side compatibility
    const apiUrl =
      globalThis.window === undefined
        ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/engagement`
        : "/api/engagement";

    const response = await fetch(apiUrl);
    const data: EngagementResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching engagement:", error);
    return {
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server",
      },
      status: 500,
    };
  }
}
