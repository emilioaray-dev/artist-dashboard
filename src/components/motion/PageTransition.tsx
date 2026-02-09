"use client";

import { AnimatePresence } from "motion/react";

type PageTransitionProps = {
  children: React.ReactNode;
};

/**
 * Wrapper component for page transitions using AnimatePresence
 * Provides fade + slide-up animation on enter/exit
 */
export function PageTransition({ children }: Readonly<PageTransitionProps>) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
