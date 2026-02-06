"use client";

import { useState, useEffect } from "react";
import { ReleasesGrid } from "@/components/releases/ReleasesGrid";
import { fetchReleases } from "@/lib/api";
import { Release } from "@/types";
import { motion } from "motion/react";

export default function ReleasesPageClient() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetchReleases();
        if (response.data) {
          setReleases(response.data);
        } else {
          setError(response.error?.message || "Failed to fetch releases");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Releases</h1>
          <p className="mt-1 text-muted-foreground">
            Loading releases...
          </p>
        </motion.div>
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Releases</h1>
          <p className="mt-1 text-muted-foreground">
            Error loading releases
          </p>
        </motion.div>
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Releases</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and track your exclusive drops
        </p>
      </motion.div>

      <ReleasesGrid releases={releases} />
    </div>
  );
}