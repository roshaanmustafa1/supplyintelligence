import type { NextConfig } from "next"

// Fallback to local SQLite database if DATABASE_URL is not set in environment (e.g. during build)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db"
}

const nextConfig: NextConfig = {}

export default nextConfig

