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

import { lastPing as reqLastPing, getAvgLatency } from '~/middleware/logging';
import { Stopwatch, calculateHRTime, humanize } from '@augu/utils';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { lastPing as gqlLastPing, pings } from '~/graphql/middleware/log';
import { Inject } from '@augu/lilith';
import { Endpoint, Route } from '~/structures';
import { PrismaClient } from '@prisma/client';
import Redis from '~/components/Redis';

@Endpoint('/api/debug')
export default class DebugEndpoint {
  @Inject
  private readonly prisma!: PrismaClient;

  @Inject
  private readonly redis!: Redis;

  @Route('/', 'GET')
  async debug(_: FastifyRequest, reply: FastifyReply) {
    if (process.env.NODE_ENV !== 'development') return reply.status(404).send('Cannot GET /debug');

    // Retrieve all prisma documents for users to calculate ping
    const stopwatch = new Stopwatch();
    stopwatch.start();
    await this.prisma.$queryRaw`SELECT * FROM users`;

    const prismaPing = stopwatch.end();
    const redisStats = await this.redis.getStatistics();

    const requestLastPing = calculateHRTime(reqLastPing);
    const graphqlPing = calculateHRTime(gqlLastPing);
    const gqlAvgPing = pings.reduce((acc, curr) => acc + curr, 0) / pings.length;
    const reqAvgPing = getAvgLatency();

    return reply
      .type('application/json')
      .status(200)
      .send({
        uptime: humanize(Math.floor(process.uptime() * 1000), true),
        graphql: {
          last_ping: `${graphqlPing.toFixed(2)}ms`,
          avg_ping: gqlAvgPing.toFixed(2) === 'NaN' ? '0' : `${gqlAvgPing.toFixed(2)}ms`,
        },
        requests: {
          last_ping: `${requestLastPing.toFixed(2)}ms`,
          avg_ping: reqAvgPing.toFixed(2) === 'NaN' ? '0' : `${reqAvgPing.toFixed(2)}ms`,
        },
        database: {
          ping: prismaPing,
        },
        redis: {
          ping: redisStats.ping,
        },
      });
  }
}
