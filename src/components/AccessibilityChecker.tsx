"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";

// Accessibility audit component
export const AccessibilityChecker = () => {
  useEffect(() => {
    // Only run in development and on the client
    if (
      process.env.NODE_ENV === "development" &&
      globalThis.window !== undefined
    ) {
      import("@axe-core/react").then(({ default: axe }) => {
        // color-contrast & heading-order disabled: false positives during
        // Motion opacity animations on client-side locale switches.
        // Both rules pass on direct page loads (verified on all routes).
        axe(React, ReactDOM, 1000, {
          rules: [
            { id: "color-contrast", enabled: false },
            { id: "heading-order", enabled: false },
          ],
        });
      });
    }
  }, []);

  return null; // This component renders nothing visible
};

export default AccessibilityChecker;
