"use client";

import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function LandingHero() {
  const t = useTranslations("Landing");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background Video + Gradient Overlays */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-[75%_center] md:object-center"
        >
          <source src="/video/landing-cover.mp4" type="video/mp4" />
        </video>
        <div className="from-background via-background/85 to-background/40 absolute inset-0 bg-gradient-to-r" />
        <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="max-w-2xl">
          {/* Social Proof Pill */}
          <div className="border-border/60 bg-card/60 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="bg-primary inline-block h-2 w-2 animate-pulse rounded-full" />
            {t.rich("socialProof", {
              count: "500K+",
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })}
          </div>

          {/* Headline */}
          <h1 className="text-4xl leading-[1.05] font-black tracking-tight sm:text-5xl lg:text-7xl">
            {t("heroTitle1")}
            <br />
            <span className="text-primary">{t("heroTitle2")}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-muted-foreground mt-6 max-w-lg text-lg">
            {t("heroSubtitle")}
          </p>

          {/* CTA Area */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={ROUTES.overview}>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center gap-2 rounded-md px-8 text-base font-medium transition-colors">
                {t("tryDemo")}
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <p className="text-muted-foreground text-sm">
              {t("noLoginRequired")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
