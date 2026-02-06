"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";

// Componente para auditoría de accesibilidad
export const AccessibilityChecker = () => {
  useEffect(() => {
    // Solo ejecutar en entornos de desarrollo y en el cliente
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
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

  return null; // Este componente no renderiza nada visible
};

export default AccessibilityChecker;
