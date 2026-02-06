import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ReleaseCard } from "@/components/ui/customs/cards/ReleaseCard";
import { Release, ReleaseStatus, ReleaseType } from "@/types";
import { renderWithIntl } from "../test-utils";

describe("ReleaseCard", () => {
  const mockRelease: Release = {
    id: "rel_001",
    title: "Test Release",
    type: "single" as ReleaseType,
    status: "live" as ReleaseStatus,
    releaseDate: "2026-01-15",
    coverArtUrl: "/test-cover.jpg",
    audioUrl: "https://example.com/test.mp3",
    totalSales: 1000,
    totalRevenue: 2000000, // $20,000
    salesByChannel: {
      direct_to_fan: 600,
      digital: 300,
      physical: 100,
      bundles: 0,
    },
    revenueByChannel: {
      direct_to_fan: 1200000,
      digital: 600000,
      physical: 200000,
      bundles: 0,
    },
  };

  it("renders all fields correctly", () => {
    renderWithIntl(<ReleaseCard release={mockRelease} />);

    // Check title
    expect(screen.getByText(mockRelease.title)).toBeInTheDocument();

    // Check type is rendered (lowercase)
    expect(screen.getByText(/single/i)).toBeInTheDocument();

    // Check revenue is formatted
    expect(screen.getByText("$20,000")).toBeInTheDocument();
  });

  it("shows correct status badge", () => {
    renderWithIntl(<ReleaseCard release={mockRelease} />);

    // Check for the status badge with correct text (uppercase)
    // Use getAllByText since there might be multiple LIVE elements
    const liveElements = screen.getAllByText("LIVE");
    expect(liveElements.length).toBeGreaterThan(0);
  });

  it("displays waveform component", () => {
    const { container } = renderWithIntl(<ReleaseCard release={mockRelease} />);

    // Check if the audio waveform container is present
    const waveformContainer = container.querySelector(
      '[data-testid="audio-waveform-container"]',
    );
    expect(waveformContainer).toBeInTheDocument();

    // Check if the play button is present (from AudioWaveform)
    const playButton = container.querySelector('button[aria-label="Play"]');
    expect(playButton).toBeInTheDocument();
  });

  it("formats revenue correctly", () => {
    const releaseWithHighRevenue: Release = {
      ...mockRelease,
      totalRevenue: 5250000, // $52,500
    };

    renderWithIntl(<ReleaseCard release={releaseWithHighRevenue} />);

    // Check if the formatted revenue is displayed
    expect(screen.getByText("$52,500")).toBeInTheDocument();
  });
});
