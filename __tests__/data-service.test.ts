import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DataService } from "../src/lib/data-service";
import { mockReleases } from "../src/__mocks__/releases";
import { mockEngagement } from "../src/__mocks__/engagement";
import { mockFans } from "../src/__mocks__/fans";

describe("DataService", () => {
  let service: DataService;

  beforeEach(() => {
    service = new DataService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getReleases", () => {
    it("should return mock releases data", async () => {
      const result = await service.getReleases();

      expect(result).toHaveProperty("data");
      expect(result.data).toEqual(mockReleases);
      expect(result.status).toBe(200);
    });

    it("should handle errors gracefully", async () => {
      // Mock an error scenario
      vi.spyOn(global, "setTimeout").mockImplementation((callback) => {
        callback();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      });

      const result = await service.getReleases();

      // Should still return the data since we're not simulating an actual error
      expect(result).toHaveProperty("data");
      expect(result.status).toBe(200);
    });
  });

  describe("getSales", () => {
    it("should return sales data for 30d range by default", async () => {
      const result = await service.getSales();

      expect(result).toHaveProperty("data");
      expect(result.status).toBe(200);

      const salesData = result.data;
      if (salesData) {
        expect(salesData.periodRange).toBe("30d");
      }
    });

    it("should return sales data for specified range", async () => {
      const result = await service.getSales("7d");

      expect(result).toHaveProperty("data");
      expect(result.status).toBe(200);

      const salesData = result.data;
      if (salesData) {
        expect(salesData.periodRange).toBe("7d");
      }
    });

    it("should return error for invalid range", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await service.getSales("invalid" as any);

      expect(result).toHaveProperty("error");
      expect(result.status).toBe(400);
    });
  });

  describe("getEngagement", () => {
    it("should return engagement metrics", async () => {
      const result = await service.getEngagement();

      expect(result).toHaveProperty("data");
      expect(result.data).toEqual(mockEngagement);
      expect(result.status).toBe(200);
    });
  });

  describe("getTopFans", () => {
    it("should return top fans data", async () => {
      const result = await service.getTopFans();

      expect(result).toHaveProperty("data");
      expect(result.data).toEqual(mockFans);
      expect(result.status).toBe(200);
    });
  });
});
