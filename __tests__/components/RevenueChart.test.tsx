import { screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach } from "vitest";
import { RevenueChart } from "@/components/ui/customs/charts/RevenueChart";
import { SalesSummary } from "@/types";
import { renderWithIntl } from "../test-utils";

describe("RevenueChart", () => {
  // Clean up DOM after each test
  afterEach(() => {
    cleanup();
  });

  const mockSalesData: SalesSummary = {
    totalRevenue: 4523456,
    totalSales: 1850,
    grossRevenue: 5028284,
    netRevenue: 4523456,
    periodStart: "2026-01-05",
    periodEnd: "2026-02-04",
    dailyData: [
      {
        date: "2026-01-05",
        revenue: 150234,
        sales: 62,
        revenueByChannel: {
          direct_to_fan: 90140,
          digital: 37558,
          physical: 15023,
          bundles: 7513,
        },
        salesByChannel: {
          direct_to_fan: 37,
          digital: 15,
          physical: 6,
          bundles: 4,
        },
      },
      {
        date: "2026-01-06",
        revenue: 145678,
        sales: 58,
        revenueByChannel: {
          direct_to_fan: 87406,
          digital: 36419,
          physical: 14567,
          bundles: 7286,
        },
        salesByChannel: {
          direct_to_fan: 35,
          digital: 14,
          physical: 6,
          bundles: 3,
        },
      },
    ],
    byChannel: {
      direct_to_fan: 2714073,
      digital: 1131864,
      physical: 452345,
      bundles: 225174,
    },
    revenueChange: {
      percentage: 12.5,
      trend: "up",
    },
  };

  it("renders chart with time range tabs", () => {
    renderWithIntl(<RevenueChart initialSalesData={mockSalesData} />);

    // Check if chart title is present
    expect(screen.getByText("Revenue")).toBeInTheDocument();

    // Check if time range tabs are present
    expect(screen.getByRole("tab", { name: "7 Days" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "30 Days" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "90 Days" })).toBeInTheDocument();
  });

  it("switches data when time range tabs are clicked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<RevenueChart initialSalesData={mockSalesData} />);

    // Initially should show 30d as active
    const thirtyDayTab = screen.getByRole("tab", { name: "30 Days" });
    expect(thirtyDayTab).toHaveAttribute("data-state", "active");

    // Click on 7d tab using userEvent
    const sevenDayTab = screen.getByRole("tab", { name: "7 Days" });
    await user.click(sevenDayTab);

    // Now 7d should be active
    expect(sevenDayTab).toHaveAttribute("data-state", "active");
  });

  it("displays period date range in description", () => {
    renderWithIntl(<RevenueChart initialSalesData={mockSalesData} />);

    // Check if the period is shown (both dates in the same description text)
    const description = screen.getByText(/2026-01-05.*2026-02-04/);
    expect(description).toBeInTheDocument();
  });
});
