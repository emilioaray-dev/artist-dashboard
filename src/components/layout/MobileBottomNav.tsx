"use client";

import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/core/button";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="bg-surface/80 fixed right-0 bottom-0 left-0 border-t p-2 backdrop-blur-xl md:hidden">
      <div className="flex justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center"
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex h-12 w-16 flex-col gap-0.5 rounded-lg px-2 py-1.5 text-xs",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-accent/50",
                )}
              >
                <Icon className="size-4" />
                <span>{item.title}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
