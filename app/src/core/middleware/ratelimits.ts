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

import type { FastifyPluginAsync } from 'fastify';
import { Collection } from '@augu/collections';
import { Container } from '@augu/lilith';
import { Logger } from 'tslog';
import fp from 'fastify-plugin';

interface Ratelimit {
  limit: number;
  remaining: number;
  resetAt: Date;

  consume(): Ratelimit;
  exceeded(): boolean;
  expired(): boolean;
}

const logger: Logger = Container.instance.$ref(Logger);
const ratelimits = new Collection<string, Ratelimit>();
let lastPurge = new Date();

const newRatelimit = (): Ratelimit => {
  const now = new Date();
  now.setHours(now.getHours() + 1);

  return {
    limit: 1000,
    remaining: 1000,
    resetAt: now,
    expired() {
      return this.resetAt.getTime() < Date.now();
    },

    consume() {
      this.remaining--;
      return this;
    },

    exceeded() {
      return !this.expired() && this.remaining === 0;
    },
  };
};

const cleanup = () => {
  if (lastPurge.getTime() < Date.now()) return;

  const shouldClean = ratelimits.filterKeys((rate) => rate.expired());
  if (shouldClean.length > 0) {
    logger.info(`Cleaning up ${shouldClean.length} records...`);
    for (const record of shouldClean) {
      ratelimits.delete(record);
    }
  }

  lastPurge = new Date();
};

const getRatelimit = (ip: string) => {
  const item = ratelimits.get(ip);
  if (item?.expired()) ratelimits.delete(ip);

  const packet = item ? item.consume() : newRatelimit();
  cleanup();

  ratelimits.set(ip, packet);
  return packet;
};

const middleware: FastifyPluginAsync<any> = async (server, _) => {
  logger.info('Initialized ratelimits middleware!');

  server.addHook('onRequest', (req, res, done) => {
    // localhost doesn't have to consume ratelimits.
    if (req.ip === '::1') {
      done();
      return;
    }

    const ratelimit = getRatelimit(req.ip);
    res.headers({
      'x-ratelimit-limit': ratelimit.limit,
      'x-ratelimit-remaining': ratelimit.remaining,
      'x-ratelimit-reset': Math.ceil(ratelimit.resetAt.getTime() / 1000),
      date: ratelimit.resetAt.toUTCString(), // fixes with incorrect clocks
    });

    if (ratelimit.exceeded()) {
      const retryAfter = ratelimit.resetAt.getTime() - Date.now();
      res
        .header('Retry-After', retryAfter)
        .type('application/json')
        .status(429)
        .send({
          message: `IP ${req.ip} has exceeded ratelimits. Try again later >:3`,
          retry_after: retryAfter / 1000,
        });

      done();
      return;
    }

    // we can proceed owo
    done();
  });
};

export default fp(middleware);
