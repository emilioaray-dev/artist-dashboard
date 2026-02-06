"use client";

import { usePlayerStore } from "@/store/player-store";
import dynamic from "next/dynamic";

const AudioPlayer = dynamic(
  () =>
    import("@/components/audio/AudioPlayer").then((mod) => ({
      default: mod.AudioPlayer,
    })),
  {
    ssr: false,
    loading: () => null, // Don't show anything while loading
  },
);

export function DynamicAudioPlayer() {
  const { currentTrack } = usePlayerStore();

  // Only render if there's a track to play
  if (!currentTrack) return null;

  return <AudioPlayer />;
}
