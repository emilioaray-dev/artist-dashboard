"use client";

import { cn } from "@/lib/utils";
import { getWaveformDataForRelease } from "@/lib/waveform";
import { usePlayerStore } from "@/store/player-store";
import { Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Release } from "@/types";

type AudioWaveformProps = {
  release: Release;
  className?: string;
  onPlayPause?: () => void;
};

/**
 * Audio waveform visualizer with play/pause toggle and time indicators
 * Uses seeded waveform data based on release ID for consistency
 * Connected to global player store for unified playback
 * Shows current time and total time, allows seeking via drag & release
 */
export function AudioWaveform({
  release,
  className,
  onPlayPause,
}: AudioWaveformProps) {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    currentTime: globalCurrentTime,
    duration: globalDuration,
    seekTo,
    setDuration,
  } = usePlayerStore();

  // Use proxy URL — never expose CDN origin to the client
  const audioUrl = release.audioUrl || `/api/audio/${release.id}`;
  const isCurrentTrack = currentTrack === audioUrl;

  // Scrubbing state
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPercent, setPreviewPercent] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Waveform data derived from release ID (memoized)
  const waveformData = useMemo(
    () => getWaveformDataForRelease(release.id, 40),
    [release.id],
  );

  // Track duration derived from release ID (in a real app, this would come from the audio file)
  const trackDuration = useMemo(
    () => 180 + (release.id.length % 120),
    [release.id],
  );

  // Update global store duration when this track becomes active
  useEffect(() => {
    if (isCurrentTrack) {
      setDuration(trackDuration);
    }
  }, [isCurrentTrack, trackDuration, setDuration]);

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate percent from mouse position
  const getPercentFromEvent = useCallback((clientX: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  // Handle mouse down - start dragging
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isCurrentTrack) return;
    e.preventDefault();
    setIsDragging(true);
    setPreviewPercent(getPercentFromEvent(e.clientX));
  };

  // Handle click - seek immediately on simple click
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isCurrentTrack) return;
    const percent = getPercentFromEvent(e.clientX);
    const duration = globalDuration > 0 ? globalDuration : trackDuration;
    const newTime = percent * duration;
    seekTo(newTime); // Use seekTo to sync with actual audio element
    setPreviewPercent(null);
  };

  // Handle mouse move - update preview while dragging or hovering
  const handleMouseMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!svgRef.current) return;
      const percent = getPercentFromEvent(e.clientX);
      setPreviewPercent(percent);
    },
    [getPercentFromEvent],
  );

  // Handle mouse up - commit the seek
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !isCurrentTrack) {
        setIsDragging(false);
        return;
      }

      const percent = getPercentFromEvent(e.clientX);
      const duration = globalDuration > 0 ? globalDuration : trackDuration;
      const newTime = percent * duration;
      seekTo(newTime); // Use seekTo to sync with actual audio element

      setIsDragging(false);
      setPreviewPercent(null);
    },
    [
      isDragging,
      isCurrentTrack,
      globalDuration,
      trackDuration,
      getPercentFromEvent,
      seekTo,
    ],
  );

  // Global mouse events for dragging outside the element
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
      const handleGlobalMouseUp = (e: MouseEvent) => handleMouseUp(e);

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleToggle = () => {
    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      // When playing this track, update the global store with its specific duration
      setDuration(trackDuration);
      play(audioUrl);
    }

    // Call the parent's onPlayPause handler if provided
    if (typeof onPlayPause === "function") {
      onPlayPause();
    }
  };

  // Calculate progress percentage based on if this is the current track
  const displayCurrentTime = isCurrentTrack ? globalCurrentTime : 0;
  const displayDuration = isCurrentTrack ? globalDuration : trackDuration;
  const progressPercentage =
    isCurrentTrack && globalDuration > 0
      ? (globalCurrentTime / globalDuration) * 100
      : 0;

  // Preview percentage for display (while hovering or dragging)
  const showPreview =
    isCurrentTrack && (isHovering || isDragging) && previewPercent !== null;
  const previewTime =
    previewPercent === null
      ? 0
      : previewPercent * (globalDuration > 0 ? globalDuration : trackDuration);

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-2",
          className,
        )}
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="relative h-full w-full align-middle">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${waveformData.length * 6} 40`}
              className={cn(
                "w-full transition-opacity",
                isCurrentTrack && "cursor-pointer",
                isDragging && "cursor-grabbing",
              )}
              preserveAspectRatio="none"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onMouseMove={(e) =>
                isHovering && !isDragging && handleMouseMove(e)
              }
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                if (!isDragging) setPreviewPercent(null);
              }}
            >
              {waveformData.map((amplitude, index) => {
                // Normalize amplitude to fit within SVG height
                const normalizedHeight = Math.min(amplitude, 30);
                const height =
                  isCurrentTrack && isPlaying
                    ? normalizedHeight
                    : normalizedHeight * 0.3;
                const x = index * 6;

                // Calculate if this bar is in the played portion
                const barPosition = (x / (waveformData.length * 6)) * 100;
                const isPlayed = barPosition <= progressPercentage;

                // Calculate if this bar is in the preview portion (while dragging/hovering)
                const isInPreview =
                  showPreview &&
                  previewPercent !== null &&
                  barPosition <= previewPercent * 100;

                return (
                  <motion.rect
                    key={index}
                    x={x}
                    y={(40 - height) / 2}
                    width="4"
                    height={height}
                    rx="2"
                    fill="currentColor"
                    className={cn(
                      isPlayed ? "text-primary" : "text-accent",
                      showPreview &&
                        isInPreview &&
                        !isPlayed &&
                        "text-primary/50",
                    )}
                    animate={{
                      scaleY:
                        isCurrentTrack && isPlaying && !isDragging
                          ? [1, 1.3, 1]
                          : 1,
                      originY: "center",
                    }}
                    transition={{
                      duration: 0.5,
                      repeat:
                        isCurrentTrack && isPlaying && !isDragging
                          ? Infinity
                          : 0,
                      delay: index * 0.02,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}

              {/* Progress line */}
              {isCurrentTrack && !showPreview && (
                <line
                  x1={(progressPercentage / 100) * waveformData.length * 6}
                  y1="0"
                  x2={(progressPercentage / 100) * waveformData.length * 6}
                  y2="40"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary"
                />
              )}

              {/* Preview line (while hovering or dragging) */}
              {showPreview && previewPercent !== null && (
                <line
                  x1={previewPercent * waveformData.length * 6}
                  y1="0"
                  x2={previewPercent * waveformData.length * 6}
                  y2="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                />
              )}
            </svg>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className="bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent flex size-8 items-center justify-center rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label={isCurrentTrack && isPlaying ? "Pause" : "Play"}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </button>
      </div>
      {/* Time indicators */}
      <div className="text-muted-foreground mt-1 flex justify-between pr-3 pl-2 text-xs">
        <span>
          {showPreview ? (
            <span className="text-primary font-medium">
              {formatTime(previewTime)}
            </span>
          ) : (
            formatTime(displayCurrentTime)
          )}
        </span>
        <span>{formatTime(displayDuration)}</span>
      </div>
    </>
  );
}
