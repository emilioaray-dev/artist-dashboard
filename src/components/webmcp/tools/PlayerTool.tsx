"use client";

import { useWebMCP } from "@mcp-b/react-webmcp";
import { usePlayerStore } from "@/store/player-store";
import { useTranslations } from "next-intl";
import { z } from "zod";

const READ_ONLY = { readOnlyHint: true } as const;

const playTrackInput = {
  releaseId: z.string().describe("Release ID (e.g., rel_001)"),
};

const controlPlayerInput = {
  action: z
    .enum(["play", "pause", "next", "previous", "stop", "toggle_shuffle"])
    .describe("Player action to execute"),
  volume: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("Volume level 0-1 (optional, only applied if provided)"),
};

export function PlayerTool() {
  const t = useTranslations("WebMCP");

  useWebMCP({
    name: "get_player_state",
    description:
      "Get current state of the audio player. Returns current track, playback status, volume, position, duration, playlist info, repeat mode, and shuffle state.",
    annotations: READ_ONLY,
    handler: () => {
      const state = usePlayerStore.getState();
      return {
        currentTrack: state.currentTrack,
        currentTrackTitle: state.currentTrackTitle,
        isPlaying: state.isPlaying,
        isBuffering: state.isBuffering,
        currentTime: state.currentTime,
        duration: state.duration,
        volume: state.volume,
        playbackRate: state.playbackRate,
        playlist: state.playlist,
        currentTrackIndex: state.currentTrackIndex,
        repeatMode: state.repeatMode,
        shuffle: state.shuffle,
      };
    },
  });

  useWebMCP({
    name: "play_track",
    description:
      "Play a music track from the dashboard audio player.",
    inputSchema: playTrackInput,
    annotations: { readOnlyHint: false },
    handler: async ({ releaseId }) => {
      const res = await fetch("/api/releases");
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);

      const release = json.data?.find(
        (r: { id: string }) => r.id === releaseId,
      );
      if (!release) throw new Error(t("trackNotFound", { id: releaseId }));
      if (!release.audioUrl) throw new Error(t("noAudioAvailable", { title: release.title }));

      usePlayerStore.getState().play(release.audioUrl, release.title, releaseId);
      return { played: true, title: release.title, releaseId };
    },
  });

  useWebMCP({
    name: "control_player",
    description:
      "Control the audio player. Available actions: play, pause, next, previous, stop, toggle_shuffle. Optionally set volume (0-1).",
    inputSchema: controlPlayerInput,
    annotations: { readOnlyHint: false },
    handler: ({ action, volume }) => {
      const store = usePlayerStore.getState();

      switch (action) {
        case "play":
          store.play();
          break;
        case "pause":
          store.pause();
          break;
        case "next":
          store.next();
          break;
        case "previous":
          store.previous();
          break;
        case "stop":
          store.stop();
          break;
        case "toggle_shuffle":
          store.toggleShuffle();
          break;
      }

      if (volume !== undefined) {
        store.setVolume(volume);
      }

      return { action, success: true, volume: volume ?? store.volume };
    },
  });

  return null;
}
