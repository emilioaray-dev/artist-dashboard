"use client";

import { useRef, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import { Textarea } from "@/components/ui/core/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/core/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Camera, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const localeNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
};

function SaveSuccessMessage({ show }: Readonly<{ show: boolean }>) {
  const t = useTranslations("Settings");
  if (!show) return null;
  return (
    <span className="text-success inline-flex items-center gap-1 text-sm">
      <CheckCircle className="size-4" />
      {t("changesSaved")}
    </span>
  );
}

export default function SettingsPageClient() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");

  // Profile state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // Payout state
  const [payoutSaved, setPayoutSaved] = useState(false);

  function onLocaleChange(newLocale: string) {
    startTransition(() => {
      router.replace(
        { pathname },
        { locale: newLocale as (typeof routing.locales)[number] },
      );
    });
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  }

  function handleProfileSave() {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  function handlePayoutSave() {
    setPayoutSaved(true);
    setTimeout(() => setPayoutSaved(false), 3000);
  }

  return (
    <div className="container mx-auto">
      <PageHeader title={t("title")} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Artist Profile */}
        <Card className="card-hover md:col-span-2">
          <CardHeader>
            <CardTitle>{t("artistProfile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="group relative"
              >
                <Avatar size="lg" className="size-16">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt={t("avatar")} />
                  ) : null}
                  <AvatarFallback className="text-lg">MA</AvatarFallback>
                </Avatar>
                <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="text-muted-foreground size-5" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div>
                <p className="text-sm font-medium">{t("avatar")}</p>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="text-primary text-xs hover:underline"
                >
                  {t("changeAvatar")}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display-name">{t("displayName")}</Label>
                <Input id="display-name" defaultValue="Music Artist" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" defaultValue="artist@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("bio")}</Label>
              <Textarea id="bio" placeholder={t("bioPlaceholder")} rows={3} />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleProfileSave}>{tCommon("save")}</Button>
              <SaveSuccessMessage show={profileSaved} />
            </div>
          </CardContent>
        </Card>

        {/* Payout & Revenue */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>{t("payoutRevenue")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t("currency")}</Label>
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                USD
              </span>
            </div>

            <div className="space-y-2">
              <Label>{t("paymentMethod")}</Label>
              <Select defaultValue="paypal">
                <SelectTrigger aria-label={t("paymentMethod")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">{t("paypal")}</SelectItem>
                  <SelectItem value="stripe">{t("stripe")}</SelectItem>
                  <SelectItem value="bank_transfer">
                    {t("bankTransfer")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>{t("bankInfo")}</Label>
              <span className="text-muted-foreground text-sm">****1234</span>
            </div>

            <div className="flex items-center justify-between">
              <Label>{t("totalEarnings")}</Label>
              <span className="text-lg font-semibold">$24,850.00</span>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handlePayoutSave}>{tCommon("save")}</Button>
              <SaveSuccessMessage show={payoutSaved} />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>{t("language")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={locale}
              onValueChange={onLocaleChange}
              disabled={isPending}
            >
              <SelectTrigger aria-label={t("language")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {routing.locales.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {localeNames[loc]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
