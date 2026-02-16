import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/** Returns a random integer in [0, max). Uses crypto when available, falls back to Math.random(). */
function secureRandomInt(max: number): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0] % max;
  }
  return Math.floor(Math.random() * max);
}

// ---------------------------------------------------------------------------
// Singleton HTMLAudioElement — lives at module scope, outside the React tree.
// This ensures playback survives component remounts (e.g. locale changes).
// ---------------------------------------------------------------------------
let audioEl: HTMLAudioElement | null = null;

function getAudioElement(): HTMLAudioElement | null {
  if (globalThis.window === undefined) return null;
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = "auto";

    // Sync real audio events back into the Zustand store
    audioEl.addEventListener("timeupdate", () => {
      usePlayerStore.setState({ currentTime: audioEl!.currentTime });
    });
    audioEl.addEventListener("loadedmetadata", () => {
      usePlayerStore.setState({ duration: audioEl!.duration });
    });
    audioEl.addEventListener("playing", () => {
      usePlayerStore.setState({ isBuffering: false });
    });
    audioEl.addEventListener("waiting", () => {
      usePlayerStore.setState({ isBuffering: true });
    });
    audioEl.addEventListener("ended", () => {
      const s = usePlayerStore.getState();
      s.pause();
      s.setCurrentTime(0);
    });
  }
  return audioEl;
}

// Player state types
interface PlayerState {
  currentTrack: string | null;
  currentTrackTitle: string | null;
  currentTrackId: string | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  seekTime: number | null; // Seek target time (observed by AudioPlayer)
  playbackRate: number; // Playback speed
  playlist: string[]; // Playlist
  currentTrackIndex: number; // Current track index in playlist
  repeatMode: "off" | "track" | "playlist"; // Repeat mode
  shuffle: boolean; // Shuffle mode enabled
  _intervalId: ReturnType<typeof setInterval> | null;

  // Playback controls
  play: (trackUrl?: string, title?: string, trackId?: string) => void;
  pause: () => void;
  togglePlayPause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;

  // Position and time actions
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  seekTo: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;

  // Volume and speed actions
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;

  // Playlist actions
  setPlaylist: (tracks: string[]) => void;
  addToPlaylist: (track: string) => void;
  removeFromPlaylist: (index: number) => void;

  // Configuration actions
  setRepeatMode: (mode: "off" | "track" | "playlist") => void;
  toggleShuffle: () => void;

  // Utility actions
  setBuffering: (buffering: boolean) => void;
  clearSeek: () => void;
  reset: () => void;
  _startProgressTimer: () => void;
  _stopProgressTimer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentTrack: null,
    currentTrackTitle: null,
    currentTrackId: null,
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 180, // Default 3-minute duration for demo purposes
    volume: 1,
    seekTime: null, // Seek target time (observed by AudioPlayer)
    playbackRate: 1, // Normal playback speed
    playlist: [],
    currentTrackIndex: -1,
    repeatMode: "off",
    shuffle: false,
    _intervalId: null,

    // Private methods
    _startProgressTimer: () => {
      const { _intervalId } = get();
      // Clear any existing interval
      if (_intervalId) {
        clearInterval(_intervalId);
      }

      // Start a new interval that updates currentTime every 100ms
      const newIntervalId = setInterval(() => {
        const { isPlaying, isBuffering, currentTime, duration } = get();
        if (isBuffering) return; // Wait until audio actually starts playing
        if (isPlaying && currentTime < duration) {
          set({ currentTime: currentTime + 0.1 });
        } else if (currentTime >= duration) {
          // Track ended — handle based on repeat mode
          const { repeatMode, playlist, currentTrackIndex } = get();

          if (repeatMode === "track") {
            // Repeat the current track
            set({ currentTime: 0 });
          } else if (
            repeatMode === "playlist" ||
            currentTrackIndex < playlist.length - 1
          ) {
            // Go to next track if playlist repeat or more tracks remain
            get().next();
          } else {
            // Stop playback if no more tracks and not in repeat mode
            get()._stopProgressTimer();
            set({ isPlaying: false });
          }
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

    // Playback controls
    play: (trackUrl, title, trackId) => {
      const {
        currentTrack,
        _stopProgressTimer,
        _startProgressTimer,
        playlist,
        currentTrackIndex,
      } = get();

      // Stop any existing timer
      _stopProgressTimer();

      const audio = getAudioElement();

      // If a specific URL is provided, play it
      if (trackUrl) {
        const isNewTrack = trackUrl !== currentTrack;
        set({
          currentTrack: trackUrl,
          currentTrackTitle: title ?? get().currentTrackTitle,
          currentTrackId: trackId ?? get().currentTrackId,
          isPlaying: true,
          isBuffering: isNewTrack,
          currentTime: isNewTrack ? 0 : get().currentTime,
        });
        if (audio) {
          if (isNewTrack) {
            audio.src = trackUrl;
            audio.load();
          }
          audio.play()?.catch((e) => {
            if (e.name !== "AbortError") console.error("Audio play error:", e);
          });
        }
      } else if (currentTrack) {
        // Resume the current track
        set({ isPlaying: true, isBuffering: false });
        if (audio) {
          audio.play()?.catch((e) => {
            if (e.name !== "AbortError") console.error("Audio play error:", e);
          });
        }
      } else if (playlist.length > 0 && currentTrackIndex >= 0) {
        const track = playlist[currentTrackIndex];
        set({
          currentTrack: track,
          isPlaying: true,
          isBuffering: true,
          currentTime: 0,
        });
        if (audio) {
          audio.src = track;
          audio.load();
          audio.play()?.catch((e) => {
            if (e.name !== "AbortError") console.error("Audio play error:", e);
          });
        }
      }

      // Start the progress timer
      _startProgressTimer();
    },

    pause: () => {
      get()._stopProgressTimer();
      set({ isPlaying: false });
      const audio = getAudioElement();
      if (audio) audio.pause();
    },

    togglePlayPause: () => {
      const { isPlaying } = get();
      if (isPlaying) {
        get().pause();
      } else {
        get().play();
      }
    },

    stop: () => {
      get()._stopProgressTimer();
      set({ isPlaying: false, currentTime: 0 });
      const audio = getAudioElement();
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    },

    next: () => {
      const { playlist, currentTrackIndex, shuffle } = get();

      if (playlist.length === 0) return;

      let nextIndex;

      if (shuffle) {
        // Randomly select a track that isn't the current one
        const otherTracks = playlist
          .map((_, idx) => idx)
          .filter((idx) => idx !== currentTrackIndex);

        if (otherTracks.length > 0) {
          const randomIndex = secureRandomInt(otherTracks.length);
          nextIndex = otherTracks[randomIndex];
        } else {
          return; // No other tracks to play
        }
      } else {
        // Next track in order
        nextIndex = (currentTrackIndex + 1) % playlist.length;
      }

      set({ currentTrackIndex: nextIndex });
      get().play(playlist[nextIndex]);
    },

    previous: () => {
      const { playlist, currentTrackIndex, currentTime, shuffle } = get();

      if (playlist.length === 0) return;

      // If current track has played for more than 3 seconds, restart it
      if (currentTime > 3) {
        get().play();
        return;
      }

      let prevIndex;

      if (shuffle) {
        // Randomly select a track that isn't the current one
        const otherTracks = playlist
          .map((_, idx) => idx)
          .filter((idx) => idx !== currentTrackIndex);

        if (otherTracks.length > 0) {
          const randomIndex = secureRandomInt(otherTracks.length);
          prevIndex = otherTracks[randomIndex];
        } else {
          return; // No other tracks to play
        }
      } else {
        // Previous track in order
        prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      }

      set({ currentTrackIndex: prevIndex });
      get().play(playlist[prevIndex]);
    },

    // Position and time actions
    setCurrentTime: (time) => set({ currentTime: time }),

    setDuration: (duration) => set({ duration }),

    seekTo: (time) => {
      set({ seekTime: time, currentTime: time });
      const audio = getAudioElement();
      if (audio) audio.currentTime = time;
    },

    skipForward: (seconds = 10) => {
      const { currentTime, duration } = get();
      const newTime = Math.min(currentTime + seconds, duration);
      get().seekTo(newTime);
    },

    skipBackward: (seconds = 10) => {
      const { currentTime } = get();
      const newTime = Math.max(currentTime - seconds, 0);
      get().seekTo(newTime);
    },

    // Volume and speed actions
    setVolume: (volume) => {
      const clamped = Math.max(0, Math.min(1, volume));
      set({ volume: clamped });
      const audio = getAudioElement();
      if (audio) audio.volume = clamped;
    },

    toggleMute: () => {
      const { volume } = get();
      const newVolume = volume > 0 ? 0 : 0.7;
      set({ volume: newVolume });
      const audio = getAudioElement();
      if (audio) audio.volume = newVolume;
    },

    setPlaybackRate: (rate) => {
      const clamped = Math.max(0.5, Math.min(2, rate));
      set({ playbackRate: clamped });
      const audio = getAudioElement();
      if (audio) audio.playbackRate = clamped;
    },

    // Playlist actions
    setPlaylist: (tracks) => {
      set({ playlist: tracks });
      if (tracks.length > 0) {
        set({ currentTrackIndex: 0, currentTrack: tracks[0] });
      }
    },

    addToPlaylist: (track) => {
      const { playlist } = get();
      const newPlaylist = [...playlist, track];
      set({ playlist: newPlaylist });
      // If it was the first track, set it as current
      if (playlist.length === 0) {
        set({ currentTrackIndex: 0, currentTrack: track });
      }
    },

    removeFromPlaylist: (index) => {
      const { playlist, currentTrackIndex } = get();
      const newPlaylist = playlist.filter((_, i) => i !== index);
      set({ playlist: newPlaylist });

      // Adjust current index if needed
      if (currentTrackIndex >= index) {
        const newIndex = Math.max(0, currentTrackIndex - 1);
        set({ currentTrackIndex: newIndex });
        if (newPlaylist.length > 0) {
          set({ currentTrack: newPlaylist[newIndex] });
        }
      }
    },

    // Configuration actions
    setRepeatMode: (mode) => set({ repeatMode: mode }),

    toggleShuffle: () => {
      const { shuffle } = get();
      set({ shuffle: !shuffle });
    },

    // Utility actions
    setBuffering: (buffering) => set({ isBuffering: buffering }),
    clearSeek: () => set({ seekTime: null }),

    reset: () => {
      get()._stopProgressTimer();
      const audio = getAudioElement();
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      set({
        currentTrack: null,
        currentTrackTitle: null,
        currentTrackId: null,
        isPlaying: false,
        isBuffering: false,
        currentTime: 0,
        duration: 180,
        volume: 1,
        seekTime: null,
        playbackRate: 1,
        playlist: [],
        currentTrackIndex: -1,
        repeatMode: "off",
        shuffle: false,
      });
    },
  })),
);
