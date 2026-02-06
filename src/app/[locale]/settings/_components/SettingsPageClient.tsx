"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import { Switch } from "@/components/ui/core/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/core/select";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

const localeNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
};

export default function SettingsPageClient() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");

  function onLocaleChange(newLocale: string) {
    startTransition(() => {
      router.replace(
        { pathname },
        { locale: newLocale as (typeof routing.locales)[number] },
      );
    });
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("accountInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" defaultValue="artist@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t("displayName")}</Label>
              <Input id="name" defaultValue="Music Artist" />
            </div>
            <Button>{tCommon("saveChanges")}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("preferences")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">{t("emailNotifications")}</Label>
              <Switch id="notifications" />
            </div>
            <div className="space-y-2">
              <Label>{t("theme")}</Label>
              <Select defaultValue="dark">
                <SelectTrigger aria-label={t("selectTheme")}>
                  <SelectValue placeholder={t("selectTheme")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t("themeLight")}</SelectItem>
                  <SelectItem value="dark">{t("themeDark")}</SelectItem>
                  <SelectItem value="system">{t("themeSystem")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("language")}</Label>
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
            </div>
            <Button>{tCommon("savePreferences")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
