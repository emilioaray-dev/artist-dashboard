import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as getReleases } from "../src/app/api/releases/route";
import { GET as getSales } from "../src/app/api/sales/route";
import { GET as getEngagement } from "../src/app/api/engagement/route";
import { dataService } from "../src/lib/data-service";

// Mock the dataService
vi.mock("../src/lib/data-service", () => ({
  dataService: {
    getReleases: vi.fn(),
    getSales: vi.fn(),
    getEngagement: vi.fn(),
  },
}));

describe("API Routes Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Releases API Route", () => {
    it("should return releases data successfully", async () => {
      const mockReleasesResponse = {
        data: [{ id: "1", title: "Test Release" }],
        status: 200,
      };

      vi.spyOn(dataService, "getReleases").mockResolvedValue(
        mockReleasesResponse,
      );

      const request = new Request("http://localhost:3000/api/releases", {
        method: "GET",
      });

      const response = await getReleases(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toEqual(mockReleasesResponse);
      expect(dataService.getReleases).toHaveBeenCalled();
    });

    it("should handle errors properly", async () => {
      vi.spyOn(dataService, "getReleases").mockRejectedValue(
        new Error("Test error"),
      );

      const request = new Request("http://localhost:3000/api/releases", {
        method: "GET",
      });

      const response = await getReleases(request);

      expect(response.status).toBe(500);
    });
  });

  describe("Sales API Route", () => {
    it("should return sales data for default range", async () => {
      const mockSalesResponse = {
        data: { totalRevenue: 100000 },
        status: 200,
      };

      vi.spyOn(dataService, "getSales").mockResolvedValue(mockSalesResponse);

      const request = new Request("http://localhost:3000/api/sales", {
        method: "GET",
      });

      const response = await getSales(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toEqual(mockSalesResponse);
      expect(dataService.getSales).toHaveBeenCalledWith("30d"); // Default range
    });

    it("should return sales data for specified range", async () => {
      const mockSalesResponse = {
        data: { totalRevenue: 50000 },
        status: 200,
      };

      vi.spyOn(dataService, "getSales").mockResolvedValue(mockSalesResponse);

      const request = new Request("http://localhost:3000/api/sales?range=7d", {
        method: "GET",
      });

      const response = await getSales(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toEqual(mockSalesResponse);
      expect(dataService.getSales).toHaveBeenCalledWith("7d");
    });

    it("should handle errors properly", async () => {
      vi.spyOn(dataService, "getSales").mockRejectedValue(
        new Error("Test error"),
      );

      const request = new Request("http://localhost:3000/api/sales", {
        method: "GET",
      });

      const response = await getSales(request);

      expect(response.status).toBe(500);
    });
  });

  describe("Engagement API Route", () => {
    it("should return engagement data successfully", async () => {
      const mockEngagementResponse = {
        data: { totalFans: 1000 },
        status: 200,
      };

      vi.spyOn(dataService, "getEngagement").mockResolvedValue(
        mockEngagementResponse,
      );

      const request = new Request("http://localhost:3000/api/engagement", {
        method: "GET",
      });

      const response = await getEngagement(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toEqual(mockEngagementResponse);
      expect(dataService.getEngagement).toHaveBeenCalled();
    });

    it("should handle errors properly", async () => {
      vi.spyOn(dataService, "getEngagement").mockRejectedValue(
        new Error("Test error"),
      );

      const request = new Request("http://localhost:3000/api/engagement", {
        method: "GET",
      });

      const response = await getEngagement(request);

      expect(response.status).toBe(500);
    });
  });
});
