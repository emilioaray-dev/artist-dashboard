"use client";

import { m } from "motion/react";
import React from "react";
import { AnimationProps } from "@/types/component-types";

// Common animation types
type AnimationType = "fadeIn" | "slideIn" | "stagger" | "scaleIn";

// Extended props for custom animations
interface CustomMotionProps extends AnimationProps {
  animationType?: AnimationType;
}

/**
 * Utility component for common animations.
 * Provides consistent animations across the application.
 */
export const AnimatedElement: React.FC<CustomMotionProps> = ({
  animationType = "fadeIn",
  delay = 0,
  duration = 0.3,
  children,
  ...props
}) => {
  // Define animation variants
  const getVariants = () => {
    switch (animationType) {
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, delay },
          },
        };

      case "slideIn":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay },
          },
        };

      case "scaleIn":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration, delay },
          },
        };

      case "stagger":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: delay,
            },
          },
        };
    }
  };

  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={getVariants()}
      {...props}
    >
      {children}
    </m.div>
  );
};

// Convenience components for common animation types
export const FadeInAnimation: React.FC<
  Omit<CustomMotionProps, "animationType">
> = (props) => <AnimatedElement animationType="fadeIn" {...props} />;

export const SlideInAnimation: React.FC<
  Omit<CustomMotionProps, "animationType">
> = (props) => <AnimatedElement animationType="slideIn" {...props} />;

export const ScaleInAnimation: React.FC<
  Omit<CustomMotionProps, "animationType">
> = (props) => <AnimatedElement animationType="scaleIn" {...props} />;

export const StaggerAnimation: React.FC<
  Omit<CustomMotionProps, "animationType">
> = (props) => <AnimatedElement animationType="stagger" {...props} />;
