import { Disc3, LayoutDashboard, Settings, Users } from "lucide-react";
import { ROUTES } from "./routes";

/**
 * Navigation items for the sidebar
 */
export const NAV_ITEMS = [
  {
    title: "Overview",
    href: ROUTES.overview,
    icon: LayoutDashboard,
  },
  {
    title: "Releases",
    href: ROUTES.releases,
    icon: Disc3,
  },
  {
    title: "Fans",
    href: ROUTES.fans,
    icon: Users,
  },
  {
    title: "Settings",
    href: ROUTES.settings,
    icon: Settings,
  },
];
