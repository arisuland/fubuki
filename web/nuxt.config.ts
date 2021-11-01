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

/// <reference types='../node_modules/@nuxtjs/apollo/types/nuxt' />
/// <reference types='../node_modules/@nuxtjs/i18n/types/vue' />
/// <reference types='../node_modules/@nuxtjs/pwa/dist/pwa' />
/// <reference types='../node_modules/@nuxtjs/sentry/types' />

/* eslint-disable camelcase */

import type { NuxtConfig } from '@nuxt/types';
import { existsSync } from 'fs';
import { parse } from '@augu/dotenv';
import { join } from 'path';

if (existsSync(join(process.cwd(), '.env'))) {
  parse({
    populate: true,
    file: join(process.cwd(), '.env'),
    schema: {
      NUXT_HOST: {
        type: 'string',
        default: undefined,
      },

      NUXT_PORT: {
        type: 'int',
        default: 17903,
      },

      PORT: {
        type: 'int',
        default: 17903,
      },

      HOST: {
        type: 'string',
        default: undefined,
      },

      TSUBAKI_URL: 'string',
      NODE_ENV: {
        type: 'string',
        oneOf: ['development', 'production'],
        default: 'development',
      },
    },
  });
} else {
  process.env.PORT = '17903';
  process.env.NODE_ENV = 'development';
  process.env.TSUBAKI_URL = 'http://localhost:28093';
}

const nuxtConfig: NuxtConfig = {
  srcDir: 'src',
  target: 'server',
  modern: process.env.NODE_ENV === 'production' && 'client',
  dev: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  dir: {
    pages: 'views',
  },

  head: {
    title: '☔ Arisu | Translation made with simplicity.',
    meta: [
      {
        charset: 'utf-8',
      },

      {
        hid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },

      {
        name: 'robots',
        content: 'index, follow',
      },
    ],

    htmlAttrs: {
      lang: 'en',
    },
  },

  serverMiddleware: [
    '~/middleware/log',
    '~/middleware/headers',
    '~/middleware/redirects',
    {
      path: '/api/process',
      handler: '~/middleware/api/process',
    },
  ],

  server: {
    port:
      process.env.PORT !== undefined && !Number.isNaN(process.env.PORT)
        ? Number(process.env.PORT)
        : process.env.NUXT_PORT !== undefined && !Number.isNaN(process.env.NUXT_PORT)
        ? Number(process.env.NUXT_PORT)
        : 17903,
  },

  plugins: ['~/plugins/twemoji', '~/plugins/highlighter'],
  generate: {
    fallback: true,
    subFolders: false,
    interval: 2000, // allow async funcs to resolve (issue with @nuxtjs/composition-api ~ https://composition-api.nuxtjs.org/getting-started/setup)
  },

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxt/http',
    '@nuxtjs/pwa',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sentry',
    '@nuxtjs/apollo',
  ],

  sentry: {
    dsn: process.env.SENTRY_DSN,
    publishRelease: {
      setCommits: { auto: true },
      dryRun: true,
    },
  },

  pwa: {
    manifest: {
      theme_color: '',
      description: '☔ Translation made with simplicity.',
      icons: [],
      publicPath: '/',
      short_name: 'Arisu',
      name: '@arisu/web',
    },
    meta: {
      author: 'Noel <cutie@floofy.dev>, Arisu Team <team@arisu.land>',
      background_color: '',
      icons: [],
      nativeUI: true,
      ogDescription: '☔ Translation made with simplicity.',
      ogImage: 'https://cdn.arisu.land/lotus.png',
      ogTitle: 'Arisu',
      ogSiteName: 'Arisu',
      twitterCard: 'summary',
      twitterCreator: '@rainyynoel',
      twitterSite: '@arisu_land',
    },
  },

  tailwindcss: {
    configPath: '~/../tailwind.config.js',
    exposeConfig: true,
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.TSUBAKI_URL!,
      },
    },

    includeNodeModules: false,
    tokenName: 'arisu-session-token',
    defaultOptions: {
      // disallow subscriptions (since Tsubaki doesn't implement subscriptions)
      $skipAllSubscriptions: true,
    },
  },

  vue: {
    config: {
      productionTip: false,
      devtools: process.env.NODE_ENV === 'development',
      performance: process.env.NODE_ENV === 'production', // enable prefs in prod
    },
  },

  i18n: {
    defaultLocale: 'en_us',
    locales: [
      {
        code: 'en_us',
        file: join(process.cwd(), 'locales', 'en_US.json'),
      },
    ],
  },

  build: {
    postcss: {
      plugins: {
        autoprefixer: {},
        'postcss-reporter': {},
      },
    },
  },
};

export default nuxtConfig;
