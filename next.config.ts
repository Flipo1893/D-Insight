import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 only serves qualities listed here and silently falls back to 75
     * for anything else. The portraits ask for 85 to stay sharp at the size
     * they are actually rendered at, so 85 has to be declared or that request
     * is dropped without a word.
     */
    qualities: [75, 85],
  },
};

export default nextConfig;
