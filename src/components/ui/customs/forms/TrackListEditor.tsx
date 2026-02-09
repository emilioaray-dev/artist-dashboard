"use client";

import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export interface Track {
  order: number;
  name: string;
  duration: string;
  priceUsd: string;
}

interface TrackListEditorProps {
  tracks: Track[];
  onChange: (tracks: Track[]) => void;
}

export function TrackListEditor({
  tracks,
  onChange,
}: Readonly<TrackListEditorProps>) {
  const t = useTranslations("ReleaseUpload");

  const addTrack = () => {
    onChange([
      ...tracks,
      {
        order: tracks.length + 1,
        name: "",
        duration: "",
        priceUsd: "",
      },
    ]);
  };

  const removeTrack = (index: number) => {
    const updated = tracks
      .filter((_, i) => i !== index)
      .map((track, i) => ({ ...track, order: i + 1 }));
    onChange(updated);
  };

  const updateTrack = (index: number, field: keyof Track, value: string) => {
    const updated = tracks.map((track, i) =>
      i === index ? { ...track, [field]: value } : track,
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{t("trackList")}</h4>
        <Button type="button" variant="outline" size="sm" onClick={addTrack}>
          <Plus className="mr-1 size-4" />
          {t("addTrack")}
        </Button>
      </div>

      {tracks.map((track, index) => (
        <div
          key={track.order}
          className="bg-muted/30 flex items-center gap-2 rounded-md p-3"
        >
          <span className="text-muted-foreground w-6 text-center text-sm">
            {track.order}
          </span>
          <Input
            placeholder={t("trackName")}
            value={track.name}
            onChange={(e) => updateTrack(index, "name", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="MM:SS"
            value={track.duration}
            onChange={(e) => updateTrack(index, "duration", e.target.value)}
            className="w-20"
          />
          <Input
            placeholder="USD"
            type="number"
            step="0.01"
            min="0"
            value={track.priceUsd}
            onChange={(e) => updateTrack(index, "priceUsd", e.target.value)}
            className="w-24"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeTrack(index)}
            disabled={tracks.length <= 1}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">{t("removeTrack")}</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
