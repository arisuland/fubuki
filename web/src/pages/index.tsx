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

import { chakra } from '@chakra-ui/react';
import { GetServerSidePropsResult } from 'next';
import { useUser } from '~/hooks/useUser';
import Head from 'next/head';
import http from '~/lib/http.server';

interface MainServerSideProps {
  isFirstInit: boolean;
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<MainServerSideProps>> {
  const firstInit = await http.request({
    url: '/api/v1/init',
    method: 'GET',
  });

  return {
    props: {
      // /api/v1/init will return a 200 status code if the
      // administrator account is still in the database,
      // if not, it'll return a 404.
      isFirstInit: firstInit.statusCode === 200,
    },
  };
}

export default function MainPage({ isFirstInit }: MainServerSideProps) {
  // If it's the first initialization page, return a "Login as Admin prompt"
  return <chakra.p>first init: {isFirstInit ? 'yes' : 'no'}</chakra.p>;
}
