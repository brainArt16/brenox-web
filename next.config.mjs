/** @type {import('next').NextConfig} */
const nextConfig = {
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
