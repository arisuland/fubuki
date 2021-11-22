/*
 * ☔ Arisu: Translation made with simplicity, yet robust.
 * Copyright (C) 2020-2021 Noelware
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// @ts-check

// const withPWA = require('next-pwa');

/**
 * Next.js configuration for Fubuki
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  compress: process.env.NODE_ENV === 'production',
  publicRuntimeConfig: {
    TSUBAKI_URL:
      process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
        ? 'http://localhost:17903'
        : 'https://api.arisu.land',
  },
  productionBrowserSourceMaps: true,
  swcMinify: true,
  eslint: {
    // Disables linting while building the production
    // build, it already gets linted during Docker.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        destination: 'http://fuck.you',
        source: '/discord',
        permanent: true,
      },

      {
        destination: 'https://fuck.you',
        source: '/twitter',
        permanent: true,
      },

      {
        destination: 'https://github.com/auguwu/Arisu',
        source: '/github',
        permanent: true,
      },
    ].filter((i) => i.source !== 'http://fuck.you');
  },
};

module.exports = nextConfig;
