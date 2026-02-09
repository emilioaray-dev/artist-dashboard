"use client";

import { motion } from "motion/react";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Child motion.div with opacity + translateY animation
 * Designed to be used inside StaggerContainer for individual item animations
 */
export function FadeIn({ children, className }: Readonly<FadeInProps>) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
    >
      {children}
    </motion.div>
  );
}
