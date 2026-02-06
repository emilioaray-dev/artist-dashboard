import { 
  Release, 
  SalesSummary, 
  EngagementMetrics, 
  ApiResponse,
  Channel
} from "@/types";

// Import mock data
import { mockReleases } from "@/__mocks__/releases";
import { mockSales } from "@/__mocks__/sales";
import { mockEngagement } from "@/__mocks__/engagement";
import { mockFans } from "@/__mocks__/fans";

/**
 * Abstract interface for data service
 */
import { Fan } from "@/types";

export interface IDataService {
  getReleases(): Promise<ApiResponse<Release[]>>;
  getSales(range: '7d' | '30d' | '90d'): Promise<ApiResponse<SalesSummary>>;
  getEngagement(): Promise<ApiResponse<EngagementMetrics>>;
  getTopFans(): Promise<ApiResponse<Fan[]>>;
}

/**
 * Mock implementation of the data service
 * Simulates API calls with mock data
 */
export class DataService implements IDataService {
  async getReleases(): Promise<ApiResponse<Release[]>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      return {
        data: mockReleases,
        status: 200
      };
    } catch (error: unknown) {
      return {
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch releases"
        },
        status: 500
      };
    }
  }

  async getSales(range: '7d' | '30d' | '90d' = '30d'): Promise<ApiResponse<SalesSummary>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Return sales data for the specified range
      // Find the sales data that matches the requested range
      // Since mockSales is an array of SalesSummary objects, we need to find the one with the right range
      // Looking at the mock data, we need to match based on periodStart/periodEnd or create a mapping
      const salesData = mockSales.find((s: SalesSummary) => {
        // Map the range to the corresponding period in the mock data
        if (range === '7d') return s.periodStart === '2026-01-28' && s.periodEnd === '2026-02-03';
        if (range === '30d') return s.periodStart === '2026-01-05' && s.periodEnd === '2026-02-03';
        if (range === '90d') return s.periodStart === '2025-11-06' && s.periodEnd === '2026-02-03';
        return false;
      });

      if (!salesData) {
        return {
          error: {
            code: "INVALID_RANGE",
            message: `Invalid time range: ${range}`
          },
          status: 400
        };
      }
      
      return {
        data: salesData,
        status: 200
      };
    } catch (error: unknown) {
      return {
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch sales data"
        },
        status: 500
      };
    }
  }

  async getEngagement(): Promise<ApiResponse<EngagementMetrics>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      return {
        data: mockEngagement,
        status: 200
      };
    } catch (error: unknown) {
      return {
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch engagement data"
        },
        status: 500
      };
    }
  }

  async getTopFans(): Promise<ApiResponse<Fan[]>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      return {
        data: mockFans,
        status: 200
      };
    } catch (error: unknown) {
      return {
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch top fans"
        },
        status: 500
      };
    }
  }
}

// Export singleton instance
export const dataService = new DataService();