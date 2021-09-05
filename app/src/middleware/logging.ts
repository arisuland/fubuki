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

import type { FastifyPluginAsync } from 'fastify';
import { calculateHRTime } from '@augu/utils';
import { STATUS_CODES } from 'http';
import { Container } from '@augu/lilith';
import { version } from '~/util/Constants';
import { Logger } from 'tslog';
import { colors } from 'leeks.js';
import fp from 'fastify-plugin';

const logger: Logger = Container.instance.$ref(Logger);
const pings: number[] = [];
let lastPing!: [number, number];

const middleware: FastifyPluginAsync<any> = async (server, _) => {
  logger.info('Initialized logging middleware!');

  server.addHook('onRequest', (_, res, done) => {
    res.headers({
      'Cache-Control': 'public, max-age=7776000',
      'X-Powered-By': `Arisu (+https://github.com/auguwu/Arisu; v${version})`,
    });

    lastPing = process.hrtime();
    done();
  });

  server.addHook('onResponse', (req, res, done) => {
    const duration = calculateHRTime(lastPing);
    pings.push(duration);

    // don't even log it (since it'll get spammy in development)
    const isGraphQL = req.method === 'POST' && req.url === '/graphql';
    if (isGraphQL) {
      done();
      return;
    }

    const averageLatency = getAvgLatency();
    const dur =
      duration < 0.5
        ? colors.magenta(`+${duration.toFixed(2)}ms`)
        : duration >= 1.2 // ~1.2ms seems about right?
        ? colors.yellow(`+${duration.toFixed(2)}ms`)
        : colors.green(`+${duration.toFixed(2)}ms`);

    logger.info(
      `[${req.ip === '::1' || req.ip === '::ffff:127.0.0.1' ? 'localhost' : req.ip}] ${res.statusCode} (${
        STATUS_CODES[res.statusCode]
      }): ${req.method.toUpperCase()} ${req.url} (${dur}; avg: ~${averageLatency.toFixed(2)}ms)`
    );

    done();
  });
};

export const getAvgLatency = () => pings.reduce((acc, curr) => acc + curr, 0) / pings.length;

export default fp(middleware, {
  fastify: '>=3.0',
});
