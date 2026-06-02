/** @type {import('next').NextConfig} */
const assetsBaseUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL;

if (!assetsBaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_ASSETS_BASE_URL environment variable");
}

const assetHostname = new URL(assetsBaseUrl).hostname;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: assetHostname,
      },
    ],
  },
};

module.exports = nextConfig;
