/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow HMR when opening the app via 127.0.0.1 instead of localhost.
  allowedDevOrigins: ["127.0.0.1"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/app", destination: "/workspaces", permanent: false },
      { source: "/app/:path*", destination: "/workspaces", permanent: false },
      { source: "/developers", destination: "/docs", permanent: false },
      { source: "/pricing", destination: "/#pricing", permanent: false },
      { source: "/about", destination: "/login", permanent: false },
      { source: "/blog", destination: "/login", permanent: false },
      { source: "/ui-kit", destination: "/login", permanent: false },
      { source: "/forgot-password", destination: "/login", permanent: false },
    ]
  },
}

export default nextConfig
