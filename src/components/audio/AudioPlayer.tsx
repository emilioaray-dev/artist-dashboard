"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { usePlayerStore } from "@/store/player-store";
import { useEffect, useRef } from "react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { collapsed } = useSidebar();
  const {
    currentTrack,
    currentTrackTitle,
    isPlaying,
    currentTime,
    duration,
    volume,
    seekTime,
    setCurrentTime,
    setDuration,
    setBuffering,
    clearSeek,
    pause,
    play,
  } = usePlayerStore();

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // Pause before changing the source to prevent conflicts
      audioRef.current.pause();

      // Update the source and load the new track
      audioRef.current.src = currentTrack;
      audioRef.current.load();

      // Reset time to 0 when changing tracks
      setCurrentTime(0);
    }
  }, [currentTrack, setCurrentTime]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (currentTrack) {
        audio.play().catch((e) => {
          if (e.name !== "AbortError") {
            console.error("Audio play error:", e);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Clear buffering when audio actually starts playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => setBuffering(false);

    audio.addEventListener("playing", handlePlaying);
    return () => {
      audio.removeEventListener("playing", handlePlaying);
    };
  }, [setBuffering]);

  // Handle time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [setCurrentTime]);

  // Handle when track ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      pause();
      setCurrentTime(0);
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [pause, setCurrentTime]);

  // Handle duration change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [setDuration]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle seek requests from waveform or other components
  useEffect(() => {
    if (seekTime !== null && audioRef.current) {
      audioRef.current.currentTime = seekTime;
      clearSeek();
    }
  }, [seekTime, clearSeek]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
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
      className={`bg-background fixed right-0 bottom-[var(--mobile-nav-height)] left-0 z-50 border-t px-4 transition-all duration-300 md:bottom-0 ${collapsed ? "md:ml-16" : "md:ml-60"} ${
        isPlaying
          ? "translate-y-0"
          : "translate-y-[calc(100%+var(--mobile-nav-height))] md:translate-y-full"
      }`}
    >
      <div className="container mx-auto flex h-14 items-center gap-4">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          ref={audioRef}
          src={currentTrack}
          onEnded={() => {
            pause();
            setCurrentTime(0);
          }}
        />

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
            <div className="truncate text-sm font-medium">
              {currentTrackTitle || "Current Track"}
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
