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

import '@fontsource/fira-code/index.css';
import '@fontsource/jetbrains-mono/index.css';
import '@fontsource/inter/index.css';

import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Navbar from 'src/components/Navbar';
import Footer from 'src/components/Footer';
import apollo from '../lib/apollo';
import theme from '../theme';

// Import FontAwesome icons here
import '../lib/fa';

export default function FubukiApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={apollo}>
        {/* @ts-ignore */}
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </ApolloProvider>
    </ChakraProvider>
  );
}
