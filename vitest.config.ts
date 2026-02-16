import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    teardownTimeout: 5000,
    include: ["__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.d.ts",
        "**/types/**",
        "**/__tests__/**",
        "**/test-utils/**",
        "**/coverage/**",
        "**/vite.config.ts",
        "**/vitest.config.ts",
        "**/vitest.setup.ts",
        "**/playwright.config.ts",
        "**/eslint.config.mjs",
        "**/postcss.config.mjs",
        "**/tailwind.config.ts",
        "**/components.json",
        "**/package*.json",
        "**/README.md",
        "**/TODO.md",
        "**/CLAUDE.md",
        "**/QWEN.md",
      ],
    },
  },
  resolve: {
    alias: {
      "@": __dirname + "/src",
    },
  },
});
