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

const { Months, omitZero } = require('@augu/utils');
const { execSync } = require('child_process');
const { version } = require('./package.json');
const isDocker = require('is-docker');
const isKube = require('is-kubernetes');

// const withPWA = require('next-pwa');

const commitHash = () => execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
const getDate = () => {
  const current = new Date();
  const hours = omitZero(current.getHours());
  const minutes = omitZero(current.getMinutes());
  const seconds = omitZero(current.getSeconds());
  const tz = process.env.TZ !== undefined ? process.env.TZ : 'UTC';

  return `${
    Months[current.getMonth()]
  } ${current.getDate()}, ${current.getFullYear()} @ ${hours}:${minutes}:${seconds} ${tz}`;
};

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
  generateBuildId: () => {
    const date = getDate();
    return `v${version} (commit: ${commitHash()}, build date: ${date})`;
  },
  env: {
    version,
    commit: commitHash(),
    buildDate: getDate(),
    // docker: isDocker() ? 'true' : 'false',
    // kube: isKube() ? 'true' : 'false',
    docker: 'true',
    kube: 'true',
  },
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
