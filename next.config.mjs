/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable error details in production for debugging
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  // Show detailed errors (remove after debugging)
  compiler: {
    removeConsole: false,
  },

  // Enable logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Webpack config for better error handling
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      // Better source maps for debugging
      config.devtool = "source-map";
    }
    return config;
  },
};

module.exports = nextConfig;
