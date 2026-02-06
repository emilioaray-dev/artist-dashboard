"use client";

import { useTranslations } from "next-intl";

export function LandingFooter() {
  const t = useTranslations("Landing");

  return (
    <footer className="border-t border-border/40 py-8">
      <div className="text-muted-foreground mx-auto max-w-7xl px-6 text-center text-sm">
        {t("footerText")}
      </div>
    </footer>
  );
}
