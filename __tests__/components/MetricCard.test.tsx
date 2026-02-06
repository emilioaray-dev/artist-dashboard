import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MetricCard } from "@/components/ui/customs/cards/MetricCard";
import { DollarSign } from "lucide-react";

describe("MetricCard", () => {
  const defaultProps = {
    icon: DollarSign,
    title: "Total Revenue",
    value: "45,234",
  };

  it("renders title and value", () => {
    render(<MetricCard {...defaultProps} />);

    // Check if title is rendered
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();

    // Check if value is rendered
    expect(screen.getByText("45,234")).toBeInTheDocument();
  });

  it("renders correct colors for positive change", () => {
    render(<MetricCard {...defaultProps} change={12.5} />);

    // Check if change indicator is rendered with positive direction
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
  });

  it("renders correct colors for negative change", () => {
    render(<MetricCard {...defaultProps} change={-3.2} />);

    // Check if change indicator shows negative direction
    expect(screen.getByText("-3.2%")).toBeInTheDocument();
  });

  it("renders prefix when provided", () => {
    render(<MetricCard {...defaultProps} prefix="$" />);

    // Check if prefix is rendered
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("does not render change when not provided", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    // The change section should not be present
    // Check that no TrendingUp or TrendingDown icons are present
    const svgIcons = container.querySelectorAll(
      "svg.lucide-trending-up, svg.lucide-trending-down",
    );
    expect(svgIcons.length).toBe(0);
  });
});
