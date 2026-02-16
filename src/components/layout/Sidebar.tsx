"use client";

import { Button } from "@/components/ui/core/button";
import { useSidebar } from "@/hooks/useSidebar";
import { BRAND_NAME, NAV_ITEMS, PLATFORM_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");

  const navTranslationKeys: Record<string, string> = {
    Overview: "overview",
    Releases: "releases",
    Fans: "fans",
    Settings: "settings",
  };

  return (
    <aside
      className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-10 hidden border-r transition-all duration-300 md:flex md:flex-col",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href={ROUTES.overview} className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-sm font-bold">
                {BRAND_NAME[0]}
              </span>
            </div>
            <span className="text-foreground text-lg font-semibold">
              {PLATFORM_NAME}
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href={ROUTES.overview} className="mx-auto">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-sm font-bold">
                {BRAND_NAME[0]}
              </span>
            </div>
          </Link>
        )}
      </div>
      <nav className="flex-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <Icon className={cn("size-5", isActive && "text-primary")} />
              {!collapsed && <span>{t(navTranslationKeys[item.title])}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={cn(
            "text-foreground hover:bg-accent hover:text-accent-foreground w-full justify-center",
            !collapsed && "justify-start",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span>{tCommon("collapse")}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
