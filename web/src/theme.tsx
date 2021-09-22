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

import { theme as defaultTheme, extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

// Tailwind's breakpoints are a good size <3
const breakpoints = createBreakpoints({
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
});

const fonts: typeof defaultTheme['fonts'] = {
  heading: 'Cantarell',
  mono: 'JetBrains Mono',
  body: 'Noto Sans',
};

const colors: Partial<typeof defaultTheme['colors']> & Record<string, any> = {
  brand: {
    '50': '#685068',
    '100': '#5e465e',
    '200': '#543c54',
    '300': '#4a324a',
    '400': '#402840',
    '500': '#361e36',
    '600': '#2c142c',
    '700': '#220a22',
    '800': '#180018',
    '900': '#0e000e',
  },
};

export default extendTheme(
  {
    breakpoints,
    fonts,
    colors,
  },
  defaultTheme
);
