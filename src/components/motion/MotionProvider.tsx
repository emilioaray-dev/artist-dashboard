"use client";

import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

type MotionProviderProps = {
  children: React.ReactNode;
};

/**
 * Provides motion context for the entire application
 * Wraps children with LazyMotion for bundle optimization and MotionConfig for accessibility
 */
export function MotionProvider({ children }: Readonly<MotionProviderProps>) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
