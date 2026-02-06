import { screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { TopFans } from "@/components/ui/customs/lists/TopFans";
import { Fan } from "@/types";
import { renderWithIntl } from "../test-utils";

describe("TopFans", () => {
  // Clean up DOM after each test
  afterEach(() => {
    cleanup();
  });

  const mockFans: Fan[] = [
    {
      id: "fan_001",
      displayName: "MusicLover42",
      totalSpent: 42500, // $425
      purchaseCount: 18,
      avatarUrl: "/avatars/musiclover42.jpg",
    },
    {
      id: "fan_002",
      displayName: "VinylCollector",
      totalSpent: 38750, // $387.50
      purchaseCount: 15,
      avatarUrl: "/avatars/vinylcollector.jpg",
    },
    {
      id: "fan_003",
      displayName: "ConcertGoer99",
      totalSpent: 31200, // $312
      purchaseCount: 12,
      avatarUrl: "/avatars/concertgoer99.jpg",
    },
  ];

  it("renders ranked list with correct formatting", () => {
    renderWithIntl(<TopFans fans={mockFans} />);

    // Check if the header is rendered
    expect(screen.getByText("Top Fans")).toBeInTheDocument();

    // Check if the first fan is rendered with correct rank
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("MusicLover42")).toBeInTheDocument();

    // Check if purchase count is rendered
    expect(screen.getByText(/18.*purchases/)).toBeInTheDocument();

    // Check if total spent is rendered
    expect(screen.getByText("$425")).toBeInTheDocument();
  });

  it("renders all fans in the list", () => {
    renderWithIntl(<TopFans fans={mockFans} />);

    // Check if all three fans are rendered by their names
    expect(screen.getByText("MusicLover42")).toBeInTheDocument();
    expect(screen.getByText("VinylCollector")).toBeInTheDocument();
    expect(screen.getByText("ConcertGoer99")).toBeInTheDocument();
  });

  it("handles empty list", () => {
    renderWithIntl(<TopFans fans={[]} />);

    // Should render the header even with empty list
    expect(screen.getByText("Top Fans")).toBeInTheDocument();

    // Should show empty state message
    expect(screen.getByText(/No fans data available/i)).toBeInTheDocument();
  });
});
