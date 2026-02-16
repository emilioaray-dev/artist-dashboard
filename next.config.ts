import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import packageJson from "./package.json" with { type: "json" };

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    PACKAGE_VERSION: packageJson.version,
  },
};

export default withNextIntl(nextConfig);
