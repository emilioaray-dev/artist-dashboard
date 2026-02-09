"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { usePlayerStore } from "@/store/player-store";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: Readonly<MainLayoutProps>) {
  const { collapsed } = useSidebar();
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  return (
    <main
      tabIndex={0}
      className={`relative flex-1 overflow-x-hidden overflow-y-auto pr-4 pl-4 transition-all duration-300 md:pr-6 md:pb-12 md:pl-6 ${collapsed ? "md:ml-16" : "md:ml-60"} ${
        isPlaying
          ? "pb-[calc(var(--mobile-nav-height)+var(--audio-player-height)+1rem)]"
          : "pb-[calc(var(--mobile-nav-height)+1rem)]"
      } md:!pb-[78px]`}
    >
      {children}
    </main>
  );
}
