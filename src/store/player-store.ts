import { create } from "zustand";

type PlayerState = {
  currentTrack: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  seekTime: number | null; // Target time to seek to (watched by AudioPlayer)
  _intervalId: ReturnType<typeof setInterval> | null;
  play: (trackUrl: string) => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void; // Request seek (updates seekTime for AudioPlayer to handle)
  clearSeek: () => void; // Clear seekTime after AudioPlayer handles it
  reset: () => void;
  _startProgressTimer: () => void;
  _stopProgressTimer: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 180, // Default duration of 3 minutes for demo purposes
  volume: 1,
  seekTime: null, // Target seek time (watched by AudioPlayer)
  _intervalId: null,

  _startProgressTimer: () => {
    const { _intervalId } = get();
    // Clear any existing interval
    if (_intervalId) {
      clearInterval(_intervalId);
    }

    // Start a new interval that updates currentTime every 100ms
    const newIntervalId = setInterval(() => {
      const { isPlaying, currentTime, duration } = get();
      if (isPlaying && currentTime < duration) {
        set({ currentTime: currentTime + 0.1 });
      } else if (currentTime >= duration) {
        // Track ended - pause and reset to beginning
        get()._stopProgressTimer();
        set({ isPlaying: false, currentTime: 0 });
      }
    }, 100);

    set({ _intervalId: newIntervalId });
  },

  _stopProgressTimer: () => {
    const { _intervalId } = get();
    if (_intervalId) {
      clearInterval(_intervalId);
      set({ _intervalId: null });
    }
  },

  play: (trackUrl) => {
    const { currentTrack, _stopProgressTimer, _startProgressTimer } = get();

    // Stop any existing timer
    _stopProgressTimer();

    // If it's a new track, reset time; otherwise resume from current position
    const isNewTrack = currentTrack !== trackUrl;

    set({
      currentTrack: trackUrl,
      isPlaying: true,
      ...(isNewTrack ? { currentTime: 0 } : {})
    });

    // Start the progress timer
    _startProgressTimer();
  },

  pause: () => {
    get()._stopProgressTimer();
    set({ isPlaying: false });
  },

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume: volume }),

  // Request a seek - AudioPlayer watches this and syncs to actual audio element
  seekTo: (time) => set({ seekTime: time, currentTime: time }),

  // Clear seek target after AudioPlayer handles it
  clearSeek: () => set({ seekTime: null }),

  reset: () => {
    get()._stopProgressTimer();
    set({ currentTrack: null, isPlaying: false, currentTime: 0, duration: 180, seekTime: null });
  },
}));