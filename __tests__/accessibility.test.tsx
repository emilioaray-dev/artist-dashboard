import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { MetricCard } from "@/components/ui/customs/cards/MetricCard";
import { DollarSign } from "lucide-react";

// Prueba de accesibilidad para el componente MetricCard
describe("MetricCard Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <MetricCard
        icon={DollarSign}
        title="Total Revenue"
        value="24,500"
        change={12.5}
        prefix="$"
      />,
    );

    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
