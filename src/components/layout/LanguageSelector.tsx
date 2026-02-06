"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const localeNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
};

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSelector({
  compact = false,
  className,
}: LanguageSelectorProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onLocaleChange(newLocale: string) {
    startTransition(() => {
      router.replace(
        { pathname },
        { locale: newLocale as (typeof routing.locales)[number] },
      );
    });
  }

  return (
    <Select value={locale} onValueChange={onLocaleChange}>
      <SelectTrigger
        aria-label="Select language"
        className={cn(
          "border-0 bg-transparent shadow-none",
          isPending && "pointer-events-none opacity-60",
          className,
        )}
        size="sm"
      >
        <Globe className="size-4" />
        <SelectValue>
          {compact ? locale.toUpperCase() : localeNames[locale]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
