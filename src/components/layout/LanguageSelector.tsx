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
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

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
    // Persist locale in cookie so middleware respects it on every request
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
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
          "border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:ring-0",
          compact && "w-auto",
          isPending && "pointer-events-none opacity-60",
          className,
        )}
        size="sm"
      >
        <Globe className="hidden size-4 shrink-0 md:block" />
        <SelectValue>{compact ? locale.toUpperCase() : t(locale)}</SelectValue>
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
