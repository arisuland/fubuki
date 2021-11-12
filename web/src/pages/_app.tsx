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

import { nextHydration, nextRenderTime, webVitals } from './api/metrics';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import Head from 'next/head';

import '../styles/styles.scss';

export const reportWebMetric = (vital: NextWebVitalsMetric) => {
  if (vital.label === 'web-vital') {
    const gauge = webVitals[vital.name];
    gauge.set(vital.value);
  }

  if (vital.label === 'custom') {
    switch (vital.name) {
      case 'Next.js-hydration':
        nextHydration.set(vital.value);
        break;

      case 'Next.js-render':
        nextRenderTime.set(vital.value);
        break;
    }
  }
};

export default function FubukiApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Arisu</title>
      </Head>

      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}
