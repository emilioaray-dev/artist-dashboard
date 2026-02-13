"use client";

import { useWebMCPContext } from "@mcp-b/react-webmcp";
import { useLocale } from "next-intl";
import { ReleasesTool } from "./tools/ReleasesTool";
import { SalesTool } from "./tools/SalesTool";
import { EngagementTool } from "./tools/EngagementTool";
import { PlayerTool } from "./tools/PlayerTool";

export function WebMCPProvider() {
  const locale = useLocale();

  useWebMCPContext(
    "get_user_locale",
    "Get the user's current locale/language. Use this to respond in the correct language. Returns locale code (en, es, fr, pt) and display name.",
    () => ({
      locale,
      languages: { en: "English", es: "Spanish", fr: "French", pt: "Portuguese" },
      displayName: { en: "English", es: "Español", fr: "Français", pt: "Português" }[locale] ?? locale,
    }),
  );

  return (
    <>
      <ReleasesTool />
      <SalesTool />
      <EngagementTool />
      <PlayerTool />
    </>
  );
}
