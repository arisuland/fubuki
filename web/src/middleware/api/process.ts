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

import { version, dependencies } from '../../../package.json';
import type { ServerMiddleware } from '@nuxt/types';
import type { ServerResponse } from 'http';
import type { GraphQLError } from 'graphql';
import type { User } from '@arisu/typings';
import fetch from 'node-fetch';
import v8 from 'v8';

interface GetMeResult {
  errors?: readonly GraphQLError[];
  data: { me: User | null };
}

const hasFlag = (bits: number, value: number) => (bits & value) !== 0;
const send = (res: ServerResponse, statusCode: number, data: Record<string, any>) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  return res.end(JSON.stringify(data));
};

const checkAdmin = async (auth: string) => {
  // Get user information
  const res = await fetch(`${process.env.TSUBAKI_URL}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        {
          me {
            username
            flags
            id
          }
        }
      `,
    }),

    headers: {
      Authorization: `Session ${auth}`,
    },
  });

  const data = (await res.json()) as GetMeResult;
  if (data.errors !== undefined) throw new Error(data.errors[0].message);

  // check flags
  if (!hasFlag(data.data.me!.flags, 1 << 1)) {
    // Maybe they have `Owner` flag
    if (hasFlag(data.data.me!.flags, 1 << 0)) return true;

    throw new Error('Missing permissions.');
  }

  return true;
};

const mod: ServerMiddleware = async (req, res) => {
  if (!req.headers.authorization)
    return send(res, 400, {
      message: 'Missing `Authorization` header.',
    });

  const [, token] = req.headers.authorization.split(' ', 2);

  try {
    await checkAdmin(token);
  } catch (ex) {
    const e = ex as Error;
    return send(res, 400, {
      message: e.message,
    });
  }

  const memory = process.memoryUsage();
  const v8Stats = v8.getHeapStatistics();

  return send(res, 200, {
    pid: process.pid,
    memory: {
      v8: {
        computed: v8Stats.total_heap_size - v8Stats.used_heap_size,
        malloc: v8Stats.malloced_memory,
        zapped: v8Stats.does_zap_garbage === 1,
      },
      computed: memory.rss - (memory.heapTotal - memory.heapUsed),
    },
    versions: {
      node: process.version,
      arisu: version,
      nuxt: dependencies.nuxt,
      vue: require('vue/package.json').version,
    },
  });
};

export default mod;
