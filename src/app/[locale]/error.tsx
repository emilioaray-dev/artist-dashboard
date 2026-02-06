"use client";

import { Button } from "@/components/ui/core/button";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-xl font-semibold">{t("somethingWrong")}</h2>
      <p className="text-muted-foreground text-sm">
        {error.message || t("unexpectedError")}
      </p>
      <Button onClick={reset}>{t("tryAgain")}</Button>
    </div>
  );
}
