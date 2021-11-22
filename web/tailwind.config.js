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

/**
 * Tailwind configuration for arisu.land
 */
module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['src/components/*.{ts,tsx}', 'src/pages/*.{ts,tsx}'],
  },
  darkMode: 'media', // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        discord: '#7289DA',
        github: '#333333',
        twitter: '#1DA1F2',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
