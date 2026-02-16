"use client";

import { useWebMCP } from "@mcp-b/react-webmcp";
import { routing } from "@/i18n/routing";
import { patchModelContextRegistration } from "@/lib/webmcp-patch";
import { useLocale, useTranslations } from "next-intl";

patchModelContextRegistration();
import { z } from "zod";

const READ_ONLY = { readOnlyHint: true } as const;

const searchReleaseInput = {
  title: z.string().describe("Title of the release to search for"),
};

const navigateAndPlayInput = {
  releaseId: z.string().describe("Release ID (e.g., rel_001)"),
};

export function LandingWebMCP() {
  const t = useTranslations("WebMCP");
  const locale = useLocale();
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  useWebMCP({
    name: "search_release",
    description:
      "Search for a music release by title. Returns release details if found.",
    inputSchema: searchReleaseInput,
    annotations: READ_ONLY,
    handler: async ({ title }) => {
      const res = await fetch("/api/releases");
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);

      const release = json.data?.find((r: { title: string }) =>
        r.title.toLowerCase().includes(title.toLowerCase()),
      );

      if (!release) throw new Error(t("releaseNotFound", { title }));
      return release;
    },
  });

  useWebMCP({
    name: "navigate_and_play",
    description:
      "Navigate to the dashboard and play a music track.",
    inputSchema: navigateAndPlayInput,
    annotations: { readOnlyHint: false },
    handler: async ({ releaseId }) => {
      const res = await fetch("/api/releases");
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);

      const release = json.data?.find(
        (r: { id: string }) => r.id === releaseId,
      );
      if (!release) throw new Error(t("releaseNotFound", { title: releaseId }));
      if (!release.audioUrl)
        throw new Error(t("noAudioAvailable", { title: release.title }));

      const destination = `${localePrefix}/releases/${releaseId}`;
      globalThis.open(destination, "_self");

      return {
        action: "navigated",
        title: release.title,
        releaseId,
        destination,
      };
    },
  });

  useWebMCP({
    name: "get_available_locales",
    description:
      "Get the list of available locales/languages for the application. Returns locale codes and display names.",
    annotations: READ_ONLY,
    handler: () => {
      return {
        locales: [
          { code: "en", name: "English" },
          { code: "es", name: "Español" },
          { code: "fr", name: "Français" },
          { code: "pt", name: "Português" },
        ],
        default: routing.defaultLocale,
        current: locale
      };
    },
  });

  useWebMCP({
    name: "get_locale_change_info",
    description:
      "Get information about how to change the application language/locale. Returns instruction with available URLs.",
    annotations: READ_ONLY,
    handler: () => {
      const urls = ["/en/", "/es/", "/fr/", "/pt/"].join(", ");
      return {
        instruction: `To change the language, navigate to one of these URLs: ${urls}. Example: Navigate to /es/ to switch to Spanish.`,
        availableUrls: ["/en/", "/es/", "/fr/", "/pt/"]
      };
    },
  });

  return null;
}
