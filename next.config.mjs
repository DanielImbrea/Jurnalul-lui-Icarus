/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.tiktokcdn.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.supabase.co" }
    ]
  },
  async rewrites() {
    return [
      { source: "/og-image.png", destination: "/opengraph-image" },
      { source: "/og-image.jpg", destination: "/opengraph-image" },
      { source: "/apple-icon.png", destination: "/apple-icon" }
    ];
  }
};

export default nextConfig;
