"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = (): (() => void) => () => {};

/**
 * Returns `false` during SSR and `true` after hydration on the client.
 * Uses useSyncExternalStore for React Compiler compatibility (no setState in effects).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
