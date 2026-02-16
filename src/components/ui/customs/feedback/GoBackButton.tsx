"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function GoBackButton() {
  const router = useRouter();
  const t = useTranslations("Errors");

  return (
    <button
      onClick={() => router.back()}
      className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-md px-4 py-2 text-sm font-medium transition-colors"
    >
      {t("goBack")}
    </button>
  );
}
