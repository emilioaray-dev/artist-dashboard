// src/providers/SWRProvider.tsx
"use client";

import { SWRConfig } from "swr";
import React from "react";

// Global SWR configuration for the entire application
const swrGlobalConfig = {
  // Revalidation options
  revalidateOnFocus: false, // Don't revalidate when window gains focus
  revalidateOnReconnect: true, // Revalidate when internet reconnects
  refreshInterval: 0, // Disable automatic refresh

  // Retry options
  errorRetryCount: 3, // Retry 3 times before showing error
  errorRetryInterval: 5000, // Wait 5 seconds between retries
  fetcher: (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    }),

  // Cache options
  dedupingInterval: 2000, // Prevent duplicate requests within 2 seconds
  focusThrottleInterval: 5000, // Throttle focus revalidations every 5 seconds
  loadingTimeout: 3000, // 3-second timeout for slow loads

  // Behavior options
  shouldRetryOnError: true, // Retry on error
  suspense: false, // Don't use suspense by default (handled locally)
};

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: Readonly<SWRProviderProps>) {
  return <SWRConfig value={swrGlobalConfig}>{children}</SWRConfig>;
}
