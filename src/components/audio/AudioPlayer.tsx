"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player-store";

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
    reset
  } = usePlayerStore();

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack;
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

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
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-50">
      <div className="container mx-auto flex items-center gap-4">
        <audio
          ref={audioRef}
          src={currentTrack}
          onEnded={() => {
            pause();
            setCurrentTime(0);
          }}
        />

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={() => isPlaying ? pause() : usePlayerStore.getState().play(currentTrack)}
            className="p-2 rounded-full hover:bg-accent"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause">
                <rect width="4" height="16" x="6" y="4"/>
                <rect width="4" height="16" x="14" y="4"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">
              {currentTrack.split('/').pop()?.replace('%20', ' ') || 'Current Track'}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
              <span>/</span>
              <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 w-24">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2 w-4 h-4">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}