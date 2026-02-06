// src/providers/SWRProvider.tsx
"use client";

import { SWRConfig } from "swr";
import React from "react";

// Configuración global de SWR para toda la aplicación
const swrGlobalConfig = {
  // Opciones de revalidación
  revalidateOnFocus: false, // No revalidar cuando la ventana gana foco
  revalidateOnReconnect: true, // Revalidar cuando se reconecta a internet
  refreshInterval: 0, // Desactivar actualización automática

  // Opciones de reintento
  errorRetryCount: 3, // Reintentar 3 veces antes de mostrar error
  errorRetryInterval: 5000, // Esperar 5 segundos entre reintentos
  fetcher: (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    }),

  // Opciones de caché
  dedupingInterval: 2000, // Evitar solicitudes duplicadas dentro de 2 segundos
  focusThrottleInterval: 5000, // Limitar revalidaciones por foco cada 5 segundos
  loadingTimeout: 3000, // Timeout de 3 segundos para cargas lentas

  // Opciones de comportamiento
  shouldRetryOnError: true, // Reintentar en caso de error
  suspense: false, // No usar suspense por defecto (manejado localmente)
};

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return <SWRConfig value={swrGlobalConfig}>{children}</SWRConfig>;
}
