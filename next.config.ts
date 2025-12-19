import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/anatomy/:id",
        destination: "/learn/:id",
        permanent: false,
      },
      {
        source: "/guides/:id",
        destination: "/learn/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

