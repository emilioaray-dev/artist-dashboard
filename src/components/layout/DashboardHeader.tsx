"use client";

import { Bell, User, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BRAND_NAME, PLATFORM_NAME, ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/core/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/core/dropdown-menu";
import { useHydrated } from "@/hooks/useHydrated";
import { useSidebar } from "@/hooks/useSidebar";

export function DashboardHeader() {
  const t = useTranslations("Header");
  const { collapsed } = useSidebar();
  const hydrated = useHydrated();

  return (
    <header
      className={`bg-card/80 border-border sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur-sm transition-all duration-300 md:px-6 ${collapsed ? "md:ml-16" : "md:ml-60"}`}
    >
      {/* Brand - hidden on desktop since sidebar shows it, visible on mobile */}
      <Link
        href={ROUTES.overview}
        className="flex items-center gap-2 md:hidden"
      >
        <span className="text-primary text-lg font-bold">{BRAND_NAME}</span>
        <span className="text-muted-foreground text-sm">{PLATFORM_NAME}</span>
      </Link>
      <div className="hidden md:block" />

      {/* Right side: language + notifications + avatar */}
      <div className="flex items-center gap-2">
        {hydrated && <LanguageSelector compact />}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="sr-only">{t("notifications")}</span>
        </Button>

        {hydrated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar size="default">
                  <AvatarImage src="/avatars/user.jpg" alt="Marco Alvarez" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {t("artistName")}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {t("artistEmail")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.settings}>
                    <User className="mr-2 size-4" />
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.settings}>
                    <Settings className="mr-2 size-4" />
                    {t("settings")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.home}>
                  <LogOut className="mr-2 size-4" />
                  {t("signOut")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar size="default">
              <AvatarImage src="/avatars/user.jpg" alt="Marco Alvarez" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </div>
    </header>
  );
}
