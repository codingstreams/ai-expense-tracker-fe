import type { NextConfig } from "next";
import { IS_PROD } from "./config";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: IS_PROD,
  },
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth?mode=login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth?mode=register',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
