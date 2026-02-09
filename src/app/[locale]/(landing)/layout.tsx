"use client";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { useLocale } from "next-intl";
import { ReactNode, useEffect } from "react";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: Readonly<LandingLayoutProps>) {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <MotionProvider>{children}</MotionProvider>;
}
