import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { MainLayout } from "@/components/layout/client/MainLayout";
import { AudioPlayer } from "@/components/audio/AudioPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVEN Backstage | Artist Dashboard",
  description: "Track your releases, direct-to-fan sales, and fan engagement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <MotionProvider>
          <SidebarProvider>
            <div className="flex min-h-screen flex-col">
              <div className="flex flex-1">
                <Sidebar />
                <MainLayout>{children}</MainLayout>
              </div>
              <AudioPlayer />
            </div>
          </SidebarProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
