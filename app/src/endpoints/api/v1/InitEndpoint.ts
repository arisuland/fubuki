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

import type { FastifyReply, FastifyRequest } from 'fastify';
import UserFlags, { UserFlag } from '~/util/bitfields/UserFlags';
import { Endpoint, Route } from '~/core';
import { PrismaClient } from '@prisma/client';
import { Inject } from '@augu/lilith';
import { Snowflake } from '~/util';

type InitRequest = FastifyRequest<{
  Body: {
    username: string;
    password: string;
    email: string;
  };
}>;

/**
 * Represents the initialization endpoint. The frontend is ***only*** allowed
 * to call this endpoint and start the initialization process of Arisu. This creates
 * the master account (UserFlags.Owner)
 */
@Endpoint('/api/v1/init')
export default class InitEndpoint {
  @Inject
  private readonly prisma!: PrismaClient;

  @Route('/', 'GET')
  // british moment
  async getInit(_: FastifyRequest, reply: FastifyReply) {
    // check if admin account exists
    const admin = await this.prisma.users.findUnique({
      where: {
        username: 'admin',
      },
    });

    if (admin === null) return reply.status(404).send('Cannot GET /api/v1/init');
    return reply.status(204).send();
  }

  @Route('/', 'POST')
  async init(req: InitRequest, reply: FastifyReply) {
    // check if admin account exists
    const admin = await this.prisma.users.findUnique({
      where: {
        username: 'admin',
      },
    });

    if (admin === null) return reply.status(404).send('Cannot POST /api/v1/init');

    const flags = new UserFlags();
    flags.add(UserFlag.Owner);

    await this.prisma.$transaction([
      this.prisma.users.delete({
        where: { username: 'admin' },
      }),

      this.prisma.users.create({
        data: {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
          flags: flags.bits,
          id: Snowflake.generate(),
        },
      }),
    ]);

    return reply.status(204).send();
  }
}
