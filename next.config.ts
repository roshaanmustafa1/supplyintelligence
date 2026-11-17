import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Ships native cwebp binaries; must be resolved at runtime, not bundled.
  serverExternalPackages: ["webp-converter"],
}

export default nextConfig
