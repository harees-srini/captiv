import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  async rewrites() {
    return [{ source: "/@:username", destination: "/u/:username" }];
  },
};

export default nextConfig;