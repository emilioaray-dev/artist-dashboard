import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MetricCard } from "@/components/ui/customs/cards/MetricCard";
import { DollarSign } from "lucide-react";

describe("MetricCard Snapshot Tests", () => {
  it("matches snapshot with positive change", () => {
    const { container } = render(
      <MetricCard
        icon={DollarSign}
        title="Total Revenue"
        value="24,500"
        change={12.5}
        prefix="$"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot with negative change", () => {
    const { container } = render(
      <MetricCard
        icon={DollarSign}
        title="Total Revenue"
        value="24,500"
        change={-5.2}
        prefix="$"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot without change indicator", () => {
    const { container } = render(
      <MetricCard
        icon={DollarSign}
        title="Total Revenue"
        value="24,500"
        change={undefined}
        prefix="$"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot without prefix", () => {
    const { container } = render(
      <MetricCard
        icon={DollarSign}
        title="Total Revenue"
        value="24,500"
        change={12.5}
        prefix=""
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
