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

import type { NextApiHandler } from 'next';
import type { GraphQLError } from 'graphql';
import type { User } from '@arisu/typings';
import isDocker from 'is-docker';
import isKube from 'is-kubernetes';
import centra from '@aero/centra';
import os from 'os';

interface GetSelfResponse {
  errors?: readonly GraphQLError[];
  data: {
    me: User | null;
  };
}

const hasBit = (bitfield: number, flag: number) => !!(bitfield & flag);
const hasAdmin = async (auth: string) => {
  if (!process.env.TSUBAKI_URL) throw new Error('No `TSUBAKI_URL` environment is set. Did you properly setup Fubuki?');

  const data = await centra(process.env.TSUBAKI_URL, 'POST')
    .header('Authorization', `Session ${auth}`)
    .body({
      query: `
        query {
          me {
            flags
          }
        }
      `,
    })
    .json<GetSelfResponse>();

  if (data.errors !== undefined) throw new Error(data.errors[0].message);
  if (!hasBit(data.data.me!.flags, 1 << 1)) {
    // Check if they have the Owner flag
    if (hasBit(data.data.me!.flags, 1 << 0)) return true;

    throw new Error('Missing Admin bitfield.');
  }

  return true;
};

const handler: NextApiHandler = async (req, res) => {
  if (!req.headers.authorization)
    return res.status(400).json({
      message: 'Missing `Authorization` header',
    });

  const [, token] = req.headers.authorization.split(' ', 2);
  try {
    await hasAdmin(token);
  } catch (ex) {
    return res.status(400).json({
      message: (ex as Error).message,
    });
  }

  const memory = process.memoryUsage();
  return res.status(200).json({
    pid: process.pid,
    memory: memory.rss - (memory.heapTotal - memory.heapUsed),
    docker: isDocker(),
    kubernetes: isKube(),
    versions: {
      node: process.version,
      v8: process.versions.v8,
      fubuki: '1.0.0',
      react: require('react/package.json').version,
      next: require('next/package.json').version,
    },
    os: {
      platform: os.platform(),
      version: os.version(),
      arch: os.arch(),
      cpus: os.cpus().length,
    },
  });
};

export default handler;
