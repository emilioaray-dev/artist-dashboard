import { describe, it, expect } from "vitest";
import {
  cn,
  formatNumber,
  formatCurrency,
  formatDate,
  formatPercentage,
  formatDateRange,
} from "../src/lib/utils";

describe("Utility Functions", () => {
  describe("formatNumber", () => {
    it("should format numbers less than 1000 with commas", () => {
      expect(formatNumber(500)).toBe("500");
      expect(formatNumber(1234)).toBe("1.2K");
      expect(formatNumber(1000)).toBe("1K");
    });

    it("should format numbers greater than or equal to 1000 with K suffix", () => {
      expect(formatNumber(1500)).toBe("1.5K");
      expect(formatNumber(10000)).toBe("10K");
      expect(formatNumber(10500)).toBe("10.5K");
    });

    it("should format numbers greater than or equal to 1,000,000 with M suffix", () => {
      expect(formatNumber(1000000)).toBe("1M");
      expect(formatNumber(1500000)).toBe("1.5M");
      expect(formatNumber(1234567)).toBe("1.2M");
    });
  });

  describe("formatCurrency", () => {
    it("should format cents to currency format", () => {
      expect(formatCurrency(100)).toBe("$1");
      expect(formatCurrency(150)).toBe("$1.50");
      expect(formatCurrency(12345)).toBe("$123.45");
      expect(formatCurrency(0)).toBe("$0");
    });
  });

  describe("formatDate", () => {
    it("should format date string to readable format", () => {
      // Note: Since this depends on locale, we'll test with a known format
      expect(formatDate("2023-01-15")).toMatch(/Jan \d{1,2}, 2023/);
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage with one decimal place", () => {
      expect(formatPercentage(5.23)).toBe("5.2%");
      expect(formatPercentage(10)).toBe("10.0%");
      expect(formatPercentage(0)).toBe("0.0%");
    });
  });

  describe("formatDateRange", () => {
    it("should format date string to short format", () => {
      expect(formatDateRange("2023-01-15")).toMatch(/Jan \d{1,2}/);
    });
  });

  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toContain("bg-red-500");
      expect(cn("bg-red-500", "text-white")).toContain("text-white");

      // Test tailwind-merge functionality (conflicting classes)
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });
  });
});
