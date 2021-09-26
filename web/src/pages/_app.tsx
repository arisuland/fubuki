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

// Import fonts
import '@fontsource/cantarell';
import '@fontsource/jetbrains-mono';
import '@fontsource/noto-sans';

// Import stuffs
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { UserProvider } from '~/hooks/useUser';
import theme from '../theme';
import Head from 'next/head';

// Arisu is just "Alice" translated from Japanese :shrug:
export default function AliceApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Arisu</title>
      </Head>

      <UserProvider>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </UserProvider>
    </>
  );
}
