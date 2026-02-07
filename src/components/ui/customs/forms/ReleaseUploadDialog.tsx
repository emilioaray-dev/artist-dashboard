"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/core/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/core/dialog";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/select";
import { Switch } from "@/components/ui/core/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/core/tabs";
import { Textarea } from "@/components/ui/core/textarea";
import { MUSIC_GENRES } from "@/lib/constants";
import { TrackListEditor, Track } from "./TrackListEditor";
import { CheckCircle } from "lucide-react";

interface ReleaseUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialTracks: Track[] = [
  { order: 1, name: "", duration: "", priceUsd: "" },
];

export function ReleaseUploadDialog({
  open,
  onOpenChange,
}: ReleaseUploadDialogProps) {
  const t = useTranslations("ReleaseUpload");

  const [releaseType, setReleaseType] = useState<"single" | "album_ep">(
    "single",
  );
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [explicitContent, setExplicitContent] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [featuringArtists, setFeaturingArtists] = useState("");
  const [writers, setWriters] = useState("");
  const [producers, setProducers] = useState("");
  const [isExclusive, setIsExclusive] = useState(false);
  const [isPreSale, setIsPreSale] = useState(false);
  const [isBundle, setIsBundle] = useState(false);
  const [artistNotes, setArtistNotes] = useState("");
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setReleaseType("single");
    setTitle("");
    setGenre("");
    setExplicitContent(false);
    setReleaseDate("");
    setPriceUsd("");
    setFeaturingArtists("");
    setWriters("");
    setProducers("");
    setIsExclusive(false);
    setIsPreSale(false);
    setIsBundle(false);
    setArtistNotes("");
    setTracks([{ order: 1, name: "", duration: "", priceUsd: "" }]);
    setShowSuccess(false);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!title.trim() || !genre || !priceUsd) return;
    if (releaseType === "album_ep" && tracks.every((t) => !t.name.trim()))
      return;

    setShowSuccess(true);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="bg-success/10 rounded-full p-4">
              <CheckCircle className="text-success size-12" />
            </div>
            <h2 className="text-xl font-semibold">{t("congratulations")}</h2>
            <p className="text-muted-foreground">
              {t("congratulationsMessage")}
            </p>
            <Button onClick={handleClose} className="mt-2">
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("addRelease")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Release Type */}
          <Tabs
            value={releaseType}
            onValueChange={(v) => setReleaseType(v as "single" | "album_ep")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">{t("single")}</TabsTrigger>
              <TabsTrigger value="album_ep">{t("albumEp")}</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="release-title">{t("title")} *</Label>
              <Input
                id="release-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("title")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="release-genre">{t("genre")} *</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger id="release-genre">
                  <SelectValue placeholder={t("selectGenre")} />
                </SelectTrigger>
                <SelectContent>
                  {MUSIC_GENRES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="release-price">{t("priceUsd")} *</Label>
              <Input
                id="release-price"
                type="number"
                step="0.01"
                min="0"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="9.99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="release-date">{t("releaseDate")}</Label>
              <Input
                id="release-date"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 self-end">
              <Switch
                id="explicit-content"
                checked={explicitContent}
                onCheckedChange={setExplicitContent}
              />
              <Label htmlFor="explicit-content">{t("explicitContent")}</Label>
            </div>
          </div>

          {/* Credits */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t("credits")}</h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="featuring">{t("featuringArtists")}</Label>
                <Input
                  id="featuring"
                  value={featuringArtists}
                  onChange={(e) => setFeaturingArtists(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="writers">{t("writers")}</Label>
                <Input
                  id="writers"
                  value={writers}
                  onChange={(e) => setWriters(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producers">{t("producers")}</Label>
                <Input
                  id="producers"
                  value={producers}
                  onChange={(e) => setProducers(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Direct-to-Fan Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("exclusive")}</p>
                <p className="text-muted-foreground text-xs">
                  {t("exclusiveDescription")}
                </p>
              </div>
              <Switch checked={isExclusive} onCheckedChange={setIsExclusive} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("preSale")}</p>
                <p className="text-muted-foreground text-xs">
                  {t("preSaleDescription")}
                </p>
              </div>
              <Switch checked={isPreSale} onCheckedChange={setIsPreSale} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("bundle")}</p>
                <p className="text-muted-foreground text-xs">
                  {t("bundleDescription")}
                </p>
              </div>
              <Switch checked={isBundle} onCheckedChange={setIsBundle} />
            </div>
          </div>

          {/* Track List (Album/EP only) */}
          {releaseType === "album_ep" && (
            <TrackListEditor tracks={tracks} onChange={setTracks} />
          )}

          {/* Artist Notes */}
          <div className="space-y-2">
            <Label htmlFor="artist-notes">{t("artistNotes")}</Label>
            <Textarea
              id="artist-notes"
              value={artistNotes}
              onChange={(e) => setArtistNotes(e.target.value)}
              placeholder={t("artistNotesPlaceholder")}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !genre || !priceUsd}
          >
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
