"use client";

import AccessibilityChecker from "@/components/AccessibilityChecker";
import { DynamicAudioPlayer } from "@/components/audio/DynamicAudioPlayer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainLayout } from "@/components/layout/MainLayout";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SidebarProvider } from "@/hooks/useSidebar";
import { SWRProvider } from "@/lib/swr-provider";
import { ReactNode, Suspense } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SWRProvider>
      <MotionProvider>
        <SidebarProvider>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>
            <MainLayout>
              <>
                {children}
                <DynamicAudioPlayer />
              </>
            </MainLayout>
          </div>
          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
          <AccessibilityChecker />
        </SidebarProvider>
      </MotionProvider>
    </SWRProvider>
  );
}
