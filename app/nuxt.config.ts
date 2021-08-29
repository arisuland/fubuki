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

/* eslint-disable camelcase */

import type { NuxtConfig } from '@nuxt/types';

const nuxtConfig: NuxtConfig = {
  target: 'server',
  modern: process.env.NODE_ENV === 'production' && 'client',
  srcDir: 'src/frontend',
  dir: {
    pages: 'views',
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

  plugins: ['~/plugins/logger'],

  generate: {
    fallback: true,
    subFolders: false,
    interval: 2000, // allow async funcs to resolve (issue with @nuxtjs/composition-api ~ https://composition-api.nuxtjs.org/getting-started/setup)
  },

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/fontawesome',
    '@nuxtjs/pwa',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/storybook',
    '@nuxt/postcss8',
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
    description: 'Translation made with simplicity.',
    theme_color: '#361E36',
    ogDescription: 'Translation made with simplicity.',
    ogTitle: 'Arisu ☔',
    ogImage: true,
    ogSiteName: 'Arisu',
    twitterCard: 'summary',
    twitterSite: '@arisu_land', // not available :)
  },

  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['faHeart', 'faLaptop'],
      brands: ['faDiscord', 'faGitHub', 'faTelegram', 'faSteam', 'faTwitter'],
    },
  },

  build: {
    postcss: {
      plugins: {
        autoprefixer: {},
      },
    },
  },
};

export default nuxtConfig;
