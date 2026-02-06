"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <main
      className={`relative max-h-dvh overflow-y-auto pt-4 pr-4 pb-8 pl-4 transition-all duration-300 md:pt-6 md:pr-6 md:pb-12 md:pl-6 ${collapsed ? "md:ml-16" : "md:ml-60"}`}
    >
      {children}
    </main>
  );
}
