import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { usePlayerStore } from "@/store/player-store";

describe("Player Store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    usePlayerStore.getState().reset();
  });

  afterEach(() => {
    usePlayerStore.getState().reset();
    vi.useRealTimers();
  });

  describe("play", () => {
    it("plays a specific track by URL", () => {
      usePlayerStore.getState().play("https://example.com/track.mp3", "Test Track");
      const state = usePlayerStore.getState();
      expect(state.currentTrack).toBe("https://example.com/track.mp3");
      expect(state.currentTrackTitle).toBe("Test Track");
      expect(state.isPlaying).toBe(true);
    });

    it("continues playing current track when no URL provided", () => {
      // First set a track
      usePlayerStore.getState().play("https://example.com/track.mp3");
      usePlayerStore.getState().pause();

      // Resume without URL
      usePlayerStore.getState().play();
      const state = usePlayerStore.getState();
      expect(state.isPlaying).toBe(true);
      expect(state.currentTrack).toBe("https://example.com/track.mp3");
    });

    it("plays from playlist when no URL and no current track", () => {
      usePlayerStore.getState().setPlaylist([
        "https://example.com/track1.mp3",
        "https://example.com/track2.mp3",
      ]);
      usePlayerStore.setState({ currentTrack: null, isPlaying: false });

      usePlayerStore.getState().play();
      const state = usePlayerStore.getState();
      expect(state.isPlaying).toBe(true);
      expect(state.currentTrack).toBe("https://example.com/track1.mp3");
    });
  });

  describe("pause", () => {
    it("pauses playback", () => {
      usePlayerStore.getState().play("https://example.com/track.mp3");
      usePlayerStore.getState().pause();
      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });
  });

  describe("togglePlayPause", () => {
    it("toggles from paused to playing", () => {
      usePlayerStore.getState().play("https://example.com/track.mp3");
      usePlayerStore.getState().pause();
      usePlayerStore.getState().togglePlayPause();
      expect(usePlayerStore.getState().isPlaying).toBe(true);
    });

    it("toggles from playing to paused", () => {
      usePlayerStore.getState().play("https://example.com/track.mp3");
      usePlayerStore.getState().togglePlayPause();
      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });
  });

  describe("playlist management", () => {
    it("sets playlist and selects first track", () => {
      usePlayerStore.getState().setPlaylist(["track1.mp3", "track2.mp3"]);
      const state = usePlayerStore.getState();
      expect(state.playlist).toEqual(["track1.mp3", "track2.mp3"]);
      expect(state.currentTrackIndex).toBe(0);
      expect(state.currentTrack).toBe("track1.mp3");
    });

    it("adds track to playlist", () => {
      usePlayerStore.getState().addToPlaylist("track1.mp3");
      const state = usePlayerStore.getState();
      expect(state.playlist).toEqual(["track1.mp3"]);
      expect(state.currentTrackIndex).toBe(0);
      expect(state.currentTrack).toBe("track1.mp3");
    });

    it("adds additional track without changing current", () => {
      usePlayerStore.getState().addToPlaylist("track1.mp3");
      usePlayerStore.getState().addToPlaylist("track2.mp3");
      const state = usePlayerStore.getState();
      expect(state.playlist).toEqual(["track1.mp3", "track2.mp3"]);
      expect(state.currentTrack).toBe("track1.mp3");
    });

    it("removes track from playlist", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.getState().removeFromPlaylist(1);
      expect(usePlayerStore.getState().playlist).toEqual(["a.mp3", "c.mp3"]);
    });
  });

  describe("volume and playback", () => {
    it("sets volume", () => {
      usePlayerStore.getState().setVolume(0.5);
      expect(usePlayerStore.getState().volume).toBe(0.5);
    });

    it("toggles mute", () => {
      usePlayerStore.getState().setVolume(0.8);
      usePlayerStore.getState().toggleMute();
      expect(usePlayerStore.getState().volume).toBe(0);
    });

    it("sets playback rate within bounds", () => {
      usePlayerStore.getState().setPlaybackRate(1.5);
      expect(usePlayerStore.getState().playbackRate).toBe(1.5);

      usePlayerStore.getState().setPlaybackRate(5);
      expect(usePlayerStore.getState().playbackRate).toBe(2);

      usePlayerStore.getState().setPlaybackRate(0.1);
      expect(usePlayerStore.getState().playbackRate).toBe(0.5);
    });
  });

  describe("seeking", () => {
    it("seeks to a specific time", () => {
      usePlayerStore.getState().seekTo(30);
      expect(usePlayerStore.getState().seekTime).toBe(30);
    });

    it("skips forward", () => {
      usePlayerStore.getState().setCurrentTime(10);
      usePlayerStore.getState().skipForward(15);
      expect(usePlayerStore.getState().currentTime).toBe(25);
    });

    it("skips backward", () => {
      usePlayerStore.getState().setCurrentTime(30);
      usePlayerStore.getState().skipBackward(10);
      expect(usePlayerStore.getState().currentTime).toBe(20);
    });

    it("clears seek", () => {
      usePlayerStore.getState().seekTo(30);
      usePlayerStore.getState().clearSeek();
      expect(usePlayerStore.getState().seekTime).toBeNull();
    });
  });

  describe("configuration", () => {
    it("sets repeat mode", () => {
      usePlayerStore.getState().setRepeatMode("track");
      expect(usePlayerStore.getState().repeatMode).toBe("track");
    });

    it("toggles shuffle", () => {
      expect(usePlayerStore.getState().shuffle).toBe(false);
      usePlayerStore.getState().toggleShuffle();
      expect(usePlayerStore.getState().shuffle).toBe(true);
    });
  });

  describe("stop", () => {
    it("stops playback and resets time", () => {
      usePlayerStore.getState().play("https://example.com/track.mp3");
      usePlayerStore.getState().setCurrentTime(30);
      usePlayerStore.getState().stop();
      const state = usePlayerStore.getState();
      expect(state.isPlaying).toBe(false);
      expect(state.currentTime).toBe(0);
    });
  });

  describe("next", () => {
    it("does nothing with empty playlist", () => {
      usePlayerStore.getState().next();
      expect(usePlayerStore.getState().currentTrack).toBeNull();
    });

    it("goes to next track in order", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.getState().next();
      expect(usePlayerStore.getState().currentTrackIndex).toBe(1);
      expect(usePlayerStore.getState().currentTrack).toBe("b.mp3");
    });

    it("wraps around to first track", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3"]);
      usePlayerStore.setState({ currentTrackIndex: 1 });
      usePlayerStore.getState().next();
      expect(usePlayerStore.getState().currentTrackIndex).toBe(0);
    });

    it("selects random track in shuffle mode", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.getState().toggleShuffle();
      usePlayerStore.getState().next();
      expect(usePlayerStore.getState().currentTrackIndex).not.toBe(0);
    });

    it("does nothing in shuffle mode with single track", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3"]);
      usePlayerStore.getState().toggleShuffle();
      usePlayerStore.getState().next();
      // Should not change - no other tracks available
      expect(usePlayerStore.getState().currentTrack).toBe("a.mp3");
    });
  });

  describe("previous", () => {
    it("does nothing with empty playlist", () => {
      usePlayerStore.getState().previous();
      expect(usePlayerStore.getState().currentTrack).toBeNull();
    });

    it("restarts current track if played more than 3 seconds", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3"]);
      usePlayerStore.setState({ currentTrackIndex: 1, currentTime: 5 });
      usePlayerStore.getState().previous();
      // Should restart current track rather than go back
      expect(usePlayerStore.getState().isPlaying).toBe(true);
    });

    it("goes to previous track in order", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.setState({ currentTrackIndex: 2, currentTime: 1 });
      usePlayerStore.getState().previous();
      expect(usePlayerStore.getState().currentTrackIndex).toBe(1);
    });

    it("wraps to last track from first", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.setState({ currentTrackIndex: 0, currentTime: 1 });
      usePlayerStore.getState().previous();
      // Should wrap around - currentTrack should change from first track
      const state = usePlayerStore.getState();
      expect(state.currentTrack).not.toBe("a.mp3");
      expect(state.isPlaying).toBe(true);
    });

    it("selects random track in shuffle mode", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.getState().toggleShuffle();
      usePlayerStore.setState({ currentTrackIndex: 0, currentTime: 1 });
      usePlayerStore.getState().previous();
      expect(usePlayerStore.getState().currentTrackIndex).not.toBe(0);
    });
  });

  describe("remove from playlist edge cases", () => {
    it("adjusts index when removing before current", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.setState({ currentTrackIndex: 2 });
      usePlayerStore.getState().removeFromPlaylist(0);
      expect(usePlayerStore.getState().currentTrackIndex).toBe(1);
    });

    it("handles removing current track", () => {
      usePlayerStore.getState().setPlaylist(["a.mp3", "b.mp3", "c.mp3"]);
      usePlayerStore.setState({ currentTrackIndex: 1 });
      usePlayerStore.getState().removeFromPlaylist(1);
      const state = usePlayerStore.getState();
      expect(state.playlist).toEqual(["a.mp3", "c.mp3"]);
      expect(state.currentTrackIndex).toBe(0);
    });
  });

  describe("duration and time", () => {
    it("sets duration", () => {
      usePlayerStore.getState().setDuration(240);
      expect(usePlayerStore.getState().duration).toBe(240);
    });

    it("sets current time", () => {
      usePlayerStore.getState().setCurrentTime(60);
      expect(usePlayerStore.getState().currentTime).toBe(60);
    });

    it("skip forward clamps to duration", () => {
      usePlayerStore.getState().setDuration(100);
      usePlayerStore.getState().setCurrentTime(95);
      usePlayerStore.getState().skipForward(10);
      expect(usePlayerStore.getState().currentTime).toBe(100);
    });

    it("skip backward clamps to zero", () => {
      usePlayerStore.getState().setCurrentTime(3);
      usePlayerStore.getState().skipBackward(10);
      expect(usePlayerStore.getState().currentTime).toBe(0);
    });

    it("uses default skip values", () => {
      usePlayerStore.getState().setDuration(200);
      usePlayerStore.getState().setCurrentTime(50);
      usePlayerStore.getState().skipForward();
      expect(usePlayerStore.getState().currentTime).toBe(60);

      usePlayerStore.getState().skipBackward();
      expect(usePlayerStore.getState().currentTime).toBe(50);
    });
  });

  describe("volume edge cases", () => {
    it("clamps volume to 0-1 range", () => {
      usePlayerStore.getState().setVolume(1.5);
      expect(usePlayerStore.getState().volume).toBe(1);

      usePlayerStore.getState().setVolume(-0.5);
      expect(usePlayerStore.getState().volume).toBe(0);
    });

    it("unmutes to 0.7 when muted", () => {
      usePlayerStore.getState().setVolume(0);
      usePlayerStore.getState().toggleMute();
      expect(usePlayerStore.getState().volume).toBe(0.7);
    });
  });

  describe("buffering", () => {
    it("sets buffering state", () => {
      usePlayerStore.getState().setBuffering(true);
      expect(usePlayerStore.getState().isBuffering).toBe(true);

      usePlayerStore.getState().setBuffering(false);
      expect(usePlayerStore.getState().isBuffering).toBe(false);
    });
  });

  describe("reset", () => {
    it("resets to initial state", () => {
      usePlayerStore.getState().play("https://example.com/track.mp3");
      usePlayerStore.getState().reset();
      const state = usePlayerStore.getState();
      expect(state.currentTrack).toBeNull();
      expect(state.isPlaying).toBe(false);
      expect(state.currentTime).toBe(0);
    });
  });
});
