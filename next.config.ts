import type { NextConfig } from "next";

// basePath = nom du dépôt GitHub (pour GitHub Pages Project sites).
// Pour un site utilisateur (username.github.io) ou un domaine custom,
// laissez BASE_PATH vide.
// En local (dev), pas de basePath nécessaire.
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai", "*.chatglm.cn"],
};

export default nextConfig;
