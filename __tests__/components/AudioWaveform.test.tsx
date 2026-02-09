import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AudioWaveform } from "@/components/audio/AudioWaveform";
import { Release } from "@/types";

const createMockRelease = (id: string): Release => ({
  id,
  title: "Test Release",
  type: "single",
  status: "live",
  releaseDate: "2026-01-15",
  coverArtUrl: "/covers/test.jpg",
  audioUrl: `https://example.com/audio-${id}.mp3`,
  duration: 214,
  totalSales: 100,
  totalRevenue: 10000,
  salesByChannel: {
    direct_to_fan: 50,
    digital: 30,
    physical: 15,
    bundles: 5,
  },
  revenueByChannel: {
    direct_to_fan: 5000,
    digital: 3000,
    physical: 1500,
    bundles: 500,
  },
});

describe("AudioWaveform", () => {
  const defaultRelease = createMockRelease("test-release-id");

  it("renders waveform bars", () => {
    render(<AudioWaveform release={defaultRelease} />);

    // Check if SVG element with waveform bars is rendered
    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeInTheDocument();

    // Check if rect elements (waveform bars) are present
    const bars = document.querySelectorAll("rect");
    expect(bars.length).toBeGreaterThan(0);
  });

  it("renders play button initially", () => {
    const { container } = render(<AudioWaveform release={defaultRelease} />);

    // Find the play button within this component
    const playButton = container.querySelector('button[aria-label="Play"]');
    expect(playButton).toBeInTheDocument();
  });

  it("toggles play/pause state when button is clicked", () => {
    const { container } = render(<AudioWaveform release={defaultRelease} />);

    // Find the play button within this component
    const playButton = container.querySelector('button[aria-label="Play"]');
    expect(playButton).toBeInTheDocument();

    // Click to play
    if (playButton) {
      fireEvent.click(playButton);
    }

    // After clicking, the button should show loading (buffering) or pause
    const loadingOrPause = container.querySelector(
      'button[aria-label="Loading"], button[aria-label="Pause"]',
    );
    expect(loadingOrPause).toBeInTheDocument();
  });

  it("generates consistent waveform for same release ID", () => {
    const release1 = createMockRelease("same-id");
    const release2 = createMockRelease("same-id");

    const { container: container1 } = render(
      <AudioWaveform release={release1} />,
    );
    const { container: container2 } = render(
      <AudioWaveform release={release2} />,
    );

    // Both should have the same number of bars
    const bars1 = container1.querySelectorAll("rect");
    const bars2 = container2.querySelectorAll("rect");
    expect(bars1.length).toBe(bars2.length);
  });

  it("displays time indicators", () => {
    render(<AudioWaveform release={defaultRelease} />);

    // Should show time indicators in the format X:XX
    const timeElements = screen.getAllByText(/\d+:\d{2}/);
    expect(timeElements.length).toBeGreaterThan(0);
  });
});
