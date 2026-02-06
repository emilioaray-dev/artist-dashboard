import type { Metadata } from "next";
import SettingsPageClient from "./_components/SettingsPageClient";

export const metadata: Metadata = {
  title: "Settings | EVEN Backstage",
  description: "Manage your account settings and preferences",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
