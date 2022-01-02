/*
 * ☔ Arisu: Translation made with simplicity, yet robust.
 * Copyright (C) 2020-2022 Noelware
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

import type { GetStaticProps } from 'next';
import ErrorScreen from 'src/components/Error';
import InitScreen from 'src/components/init/InitalizationScreen';
import { Box } from '@chakra-ui/react';
import Navbar from 'src/components/Navbar';
import Footer from 'src/components/Footer';
import { ReactElement } from 'react';

interface MainIndexProps {
  initScreen: boolean;
  error?: Error;
  url: string;
}

export const getStaticProps: GetStaticProps<MainIndexProps> = async () => {
  let data: any;
  let error: Error | null = null;

  try {
    data = await fetch(`${process.env.TSUBAKI_URL}/api/v1/init`);
  } catch (ex) {
    data = null;
    error = ex as Error;
  }

  if (error !== null) {
    return {
      props: {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },

        url: process.env.TSUBAKI_URL!,
        initScreen: false,
      },
    };
  } else {
    return {
      props: {
        initScreen: data.status === 204,
        url: process.env.TSUBAKI_URL!,
      },
    };
  }
};

const IndexPage = ({ initScreen, error, url }: MainIndexProps) => {
  if (error !== undefined) return <ErrorScreen {...error} />;

  return initScreen ? (
    <InitScreen url={url} />
  ) : (
    <>
      <Navbar />
      <Box>hallo</Box>
      <Footer />
    </>
  );
};

IndexPage.getLayout = (page: ReactElement) => page;
export default IndexPage;
