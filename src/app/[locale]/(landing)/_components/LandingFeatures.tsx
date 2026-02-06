"use client";

import { ChartColumn, DollarSign, Music, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface FeatureCard {
  id: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

const FEATURES: FeatureCard[] = [
  { id: "release", titleKey: "featureReleaseTitle", descKey: "featureReleaseDesc", icon: Music },
  { id: "paid", titleKey: "featurePaidTitle", descKey: "featurePaidDesc", icon: DollarSign },
  { id: "charts", titleKey: "featureChartsTitle", descKey: "featureChartsDesc", icon: ChartColumn },
  { id: "community", titleKey: "featureCommunityTitle", descKey: "featureCommunityDesc", icon: Users },
];

export function LandingFeatures() {
  const t = useTranslations("Landing");

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
              className="group rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card"
            >
              <Icon className="text-primary mb-4 h-6 w-6" />
              <h3 className="text-lg font-semibold">{t(feature.titleKey)}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {t(feature.descKey)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
