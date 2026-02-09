"use client";

import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { Button } from "@/components/ui/core/button";
import { Link } from "@/i18n/navigation";
import { BRAND_NAME, ROUTES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function LandingHeader() {
  const t = useTranslations("Landing");

  return (
    <header className="border-border/40 bg-background/80 fixed top-0 z-50 w-full flex-1 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 md:px-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 min-w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-bold">
              {BRAND_NAME[0]}
            </span>
          </div>
          <span className="text-lg leading-none font-semibold tracking-wide">
            {BRAND_NAME}{" "}
            <span className="text-muted-foreground font-normal">BACKSTAGE</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <Link href={ROUTES.overview}>
            <Button
              variant="ghost"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors"
            >
              {t("tryDemo")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
