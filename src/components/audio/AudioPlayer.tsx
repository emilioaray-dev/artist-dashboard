"use client";

import { usePlayerStore } from "@/store/player-store";
import { useEffect, useRef } from "react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    seekTime,
    setCurrentTime,
    setDuration,
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

    let playPromise: Promise<void> | null = null;

    if (isPlaying) {
      // Only attempt to play if we have a valid track
      if (currentTrack) {
        playPromise = audio.play().catch((e) => {
          // Ignore the AbortError which occurs when play is interrupted by a new load
          if (e.name !== "AbortError") {
            console.error("Audio play error:", e);
          }
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      // Cancel play promise if component unmounts or effect re-runs
      if (playPromise) {
        // We can't actually cancel a play promise, but we can ignore the result
      }
    };
  }, [isPlaying, currentTrack]);

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

  if (!currentTrack) return null;

  return (
    <div className="bg-background fixed right-0 bottom-17 left-0 z-50 ml-0 border-t px-4 py-2 transition-all duration-300 md:bottom-0 md:ml-[1rem] lg:ml-[15rem]">
      <div className="container mx-auto flex items-center gap-4">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          ref={audioRef}
          src={currentTrack}
          onEnded={() => {
            pause();
            setCurrentTime(0);
          }}
        />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            onClick={() => (isPlaying ? pause() : play(currentTrack))}
            className="hover:bg-accent rounded-full p-2"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pause"
              >
                <rect width="4" height="16" x="6" y="4" />
                <rect width="4" height="16" x="14" y="4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-play"
              >
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {currentTrack.split("/").pop()?.replace("%20", " ") ||
                "Current Track"}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>
                {new Date(currentTime * 1000).toISOString().substr(14, 5)}
              </span>
              <span>/</span>
              <span>
                {new Date(duration * 1000).toISOString().substr(14, 5)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="bg-muted h-1.5 w-full cursor-pointer appearance-none rounded-lg"
          />
        </div>

        <div className="flex w-24 items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-volume-2 h-4 w-4"
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
            className="bg-muted h-1.5 w-full cursor-pointer appearance-none rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
