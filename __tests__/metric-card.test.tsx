import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/ui/customs/cards/MetricCard";
import { DollarSign } from "lucide-react";

describe("MetricCard Component", () => {
  const defaultProps = {
    icon: DollarSign,
    title: "Total Revenue",
    value: "24,500",
    change: 12.5,
    prefix: "$",
  };

  it("renders correctly with all props", () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.prefix)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.value)).toBeInTheDocument();
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
  });

  it("renders correctly with negative change", () => {
    render(<MetricCard {...defaultProps} change={-5.2} />);

    expect(screen.getByText("-5.2%")).toBeInTheDocument();
  });

  it("does not render change indicator when change is undefined", () => {
    render(<MetricCard {...defaultProps} change={undefined} />);

    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });

  it("omits prefix when not provided", () => {
    render(<MetricCard {...defaultProps} prefix="" />);

    expect(screen.getByText(defaultProps.value)).toBeInTheDocument();
    // Check that the prefix is not rendered
    const textParts = screen.getByText(defaultProps.value).parentElement
      ?.textContent;
    expect(textParts).not.toContain(defaultProps.prefix);
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<MetricCard {...defaultProps} className={customClass} />);

    expect(screen.getByTestId("card")).toHaveClass(customClass);
  });
});
