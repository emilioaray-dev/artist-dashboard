"use client";

import { Button } from "@/components/ui/core/button";
import { useSidebar } from "@/hooks/useSidebar";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "bg-surface fixed inset-y-0 left-0 z-10 hidden border-r transition-all duration-300 md:flex md:flex-col",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-sm font-bold">
                E
              </span>
            </div>
            <span className="text-foreground text-lg font-semibold">
              Backstage
            </span>
          </div>
        )}
        {collapsed && (
          <div className="bg-primary mx-auto flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-bold">E</span>
          </div>
        )}
      </div>
      <nav className="flex-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-accent/50",
              )}
            >
              <Icon className="size-5" />
              {!collapsed && <span>{item.title}</span>}
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
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
