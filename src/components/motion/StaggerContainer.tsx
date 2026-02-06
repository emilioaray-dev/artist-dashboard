"use client";

import { motion } from "motion/react";

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Parent motion.div with staggerChildren variant for configurable delay
 * Used to create staggered entrance animations for lists of items
 */
export function StaggerContainer({
  children,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
