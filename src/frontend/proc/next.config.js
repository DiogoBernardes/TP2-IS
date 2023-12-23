// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  reactServerComponents: true,
  experimental: {
    reactServerComponents: true,
  },
  pages: {
    "/app/top_teams/page.js": {
      reactServerComponents: false,
    },
  },
};
