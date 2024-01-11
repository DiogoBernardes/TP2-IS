/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    reactServerComponents: true,
  },
  pages: {
    "app/top_teams/page.js": {
      reactServerComponents: false,
    },
  },
};

module.exports = nextConfig;
