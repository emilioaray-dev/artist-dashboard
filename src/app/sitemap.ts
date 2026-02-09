import type { MetadataRoute } from "next";
import { SITE_PRODUCTION_URL } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { dataService } from "@/lib/data-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;
  const defaultLocale = routing.defaultLocale;

  const response = await dataService.getReleases();
  const releases = response.data ?? [];

  function localePrefix(locale: string) {
    return locale === defaultLocale ? "" : `/${locale}`;
  }

  function entry(
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
  ) {
    return locales.map((locale) => ({
      url: `${SITE_PRODUCTION_URL}${localePrefix(locale)}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }));
  }

  return [
    ...entry("/", 1, "monthly"),
    ...entry("/overview", 0.9, "daily"),
    ...entry("/releases", 0.8, "weekly"),
    ...entry("/fans", 0.8, "weekly"),
    ...entry("/settings", 0.3, "monthly"),
    ...releases.flatMap((release) =>
      entry(`/releases/${release.id}`, 0.6, "weekly"),
    ),
  ];
}
