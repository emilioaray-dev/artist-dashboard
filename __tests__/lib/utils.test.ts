import { describe, it, expect } from "vitest";
import { formatNumber, formatCurrency } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("formatNumber", () => {
    it("formats numbers with K/M suffixes", () => {
      expect(formatNumber(1000)).toBe("1K");
      expect(formatNumber(1500)).toBe("1.5K");
      expect(formatNumber(1000000)).toBe("1M");
      expect(formatNumber(1250000)).toBe("1.3M");
      expect(formatNumber(500)).toBe("500");
    });

    it("handles edge cases", () => {
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(999)).toBe("999");
    });
  });

  describe("formatCurrency", () => {
    it("formats cents to currency format", () => {
      expect(formatCurrency(100)).toBe("$1"); // 100 cents = $1
      expect(formatCurrency(150)).toBe("$1.5"); // 150 cents = $1.50
      expect(formatCurrency(10000)).toBe("$100"); // 10000 cents = $100
      expect(formatCurrency(1234567)).toBe("$12,345.67"); // 1234567 cents = $12,345.67
    });

    it("handles edge cases", () => {
      expect(formatCurrency(0)).toBe("$0");
      expect(formatCurrency(5)).toBe("$0.05");
      expect(formatCurrency(99)).toBe("$0.99");
    });
  });
});
