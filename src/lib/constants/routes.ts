/**
 * Application routes
 */
export const ROUTES = {
  home: "/",
  overview: "/overview",
  releases: "/releases",
  releaseDetail: (id: string) => `/releases/${id}` as const,
  fans: "/fans",
  settings: "/settings",
} as const;
