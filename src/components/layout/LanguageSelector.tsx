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
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const t = useTranslations("Languages");

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
          "border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-0",
          compact && "w-auto",
          isPending && "pointer-events-none opacity-60",
          className,
        )}
        size="sm"
      >
        <Globe className="size-4 shrink-0" />
        <SelectValue>
          {compact ? locale.toUpperCase() : t(locale)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {t(loc)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
