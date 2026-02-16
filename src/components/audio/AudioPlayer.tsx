"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { usePlayerStore } from "@/store/player-store";

export function AudioPlayer() {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const {
    currentTrack,
    currentTrackTitle,
    currentTrackId,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    play,
    seekTo,
  } = usePlayerStore();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value);
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    usePlayerStore.getState().setVolume(newVolume);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  const rangeTrackStyle = (percent: number) =>
    ({
      "--range-track": `linear-gradient(to right, var(--primaryDark) ${percent}%, var(--muted) ${percent}%)`,
    }) as React.CSSProperties;

  if (!currentTrack) return null;

  return (
    <div
      className={`bg-background fixed right-0 bottom-(--mobile-nav-height) left-0 z-50 border-t px-4 transition-all duration-300 md:bottom-0 ${collapsed ? "md:ml-16" : "md:ml-60"} ${
        isPlaying
          ? "translate-y-0"
          : "translate-y-[calc(100%+var(--mobile-nav-height))] md:translate-y-full"
      }`}
    >
      <div className="container mx-auto flex h-14 items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={() => (isPlaying ? pause() : play(currentTrack))}
            className="text-primary hover:text-primary/80 shrink-0 rounded-full p-1.5"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="4" height="16" x="6" y="4" />
                <rect width="4" height="16" x="14" y="4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">
                {currentTrackTitle || "Current Track"}
              </span>
              {currentTrackId && pathname !== `/releases/${currentTrackId}` && (
                <Link
                  href={`/releases/${currentTrackId}`}
                  className="text-muted-foreground hover:text-primary shrink-0 rounded p-0.5 transition-colors"
                  aria-label="Go to track detail"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>
                {new Date(currentTime * 1000).toISOString().substring(14, 19)}
              </span>
              <span>/</span>
              <span>
                {new Date(duration * 1000).toISOString().substring(14, 19)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="audio-range w-full"
            style={rangeTrackStyle(progressPercent)}
          />
        </div>

        <div className="hidden w-28 items-center gap-2 sm:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground shrink-0"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-range w-full"
            style={rangeTrackStyle(volumePercent)}
          />
        </div>
      </div>
    </div>
  );
}
