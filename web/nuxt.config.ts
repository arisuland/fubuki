/**
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

import type { NuxtConfig } from '@nuxt/types';
import chakraTheme from './theme/arisu';
import fs from 'fs';

if (fs.existsSync('.env')) {
  (require('@augu/dotenv') as typeof import('@augu/dotenv')).parse({
    file: require('path').join(process.cwd(), '.env'),
    populate: true,
  });
}

const nuxtConfig: NuxtConfig = {
  ssr: true,
  srcDir: 'src',
  target: 'server',
  modern: process.env.NODE_ENV === 'production' && 'client',
  dev: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined, // if no node env is placed, use dev builds as the default
  dir: {
    pages: 'views',
  },

  publicRuntimeConfig: {
    ARISU_BACKEND_URL: process.env.ARISU_BACKEND_URL ?? process.env.BACKEND_URL, // TODO: environment variable?
  },

  head: {
    title: 'Arisu ☔',
    meta: [
      { charset: 'utf-8' },
      { hid: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'index, follow' },
    ],
    htmlAttrs: {
      lang: 'en',
    },
  },

  serverMiddleware: ['~/middleware/log', '~/middleware/headers'],
  server: {
    port: 17093,
    host: process.env.NUXT_HOST,
  },

  plugins: ['~/plugins/log'],
  generate: {
    fallback: true,
    subFolders: false,
    interval: 2000, // allow async funcs to resolve (issue with @nuxtjs/composition-api ~ https://composition-api.nuxtjs.org/getting-started/setup)
  },

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/pwa',
    '@nuxtjs/composition-api/module',
    '@chakra-ui/nuxt',
    '@nuxtjs/emotion',
  ],

  sitemap: {
    hostname: 'arisu.land',
    exclude: [],
    defaults: {
      lastmod: new Date(),
    },
  },

  tailwindcss: {
    exposeConfig: true,
  },

  pwa: {
    description: '☔ Translation made with simplicity.',
    theme_color: '#361E36', // eslint-disable-line
    ogDescription: '☔ Translation made with simplicity.',
    ogTitle: 'Arisu',
    ogImage: true,
    ogSiteName: 'Arisu',
    twitterCard: 'summary',
    twitterSite: '@arisu_land', // not available :)
  },

  build: {
    postcss: {
      plugins: {
        autoprefixer: {},
      },
    },
  },

  cli: {
    bannerColor: 'bgMagenta',
    badgeMessages: [],
  },

  chakra: {
    extendTheme: chakraTheme,
  },
};

export default nuxtConfig;
