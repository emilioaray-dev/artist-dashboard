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
        axe(React, ReactDOM, 1000, {});
      });
    }
  }, []);

  return null; // Este componente no renderiza nada visible
};

export default AccessibilityChecker;
