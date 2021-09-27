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
import { Security } from '~/util';
import { Inject } from '@augu/lilith';

type CreateTokenRequest = FastifyRequest<{
  Body: {
    idOrName: string;
  };
}>;

type RecruitRequest = CreateTokenRequest;

@Endpoint('/api/v1/admin')
export default class AdminEndpoint {
  @Inject
  private readonly prisma!: PrismaClient;

  async #_checkAuth(req: FastifyRequest, reply: FastifyReply) {
    if (!req.headers.authorization) {
      reply.status(403).send({
        message: 'Missing `Authorization` header',
      });

      return false;
    }

    const [prefix, token] = req.headers.authorization.split(' ');
    if (!prefix || !token) {
      reply.status(403).send({
        message: 'Missing prefix or token.',
      });

      return false;
    }

    if (prefix !== 'Admin') {
      reply.status(403).send({
        message: 'The prefix of the header was not `Admin`.',
      });

      return false;
    }

    const _user = Security.validate(token);
    if (_user === null) {
      reply.status(403).send({
        message: 'Malformed token or the token is expired.',
      });

      return false;
    }

    const user = await this.prisma.users.findUnique({
      where: {
        id: _user.user,
      },
    });

    if (user === null) {
      reply.status(401).send({
        message: 'User was not found.',
      });

      return false;
    }

    const flags = new UserFlags(user.flags);
    if (!flags.has('Admin')) {
      // Check if host is `arisu.land` / `staging.arisu.land`
      // This can be easily spoofed but you can't apply `Cutie`, `Admin`, `Owner`, or `Founder`
      // on the official hosted versions.
      if (req.hostname !== undefined && ['arisu.land', 'staging.arisu.land'].includes(req.hostname)) {
        // Check if the user has `Cutie` or `Founder` flags
        if (flags.has('Cutie') || flags.has('Founder')) return true;
      }

      // Check if they have the owner flag
      if (flags.has(UserFlag.Owner)) return true;

      reply.status(401).send({
        message: "cheeky you... you don't have Admin flag >:3",
      });

      return false;
    }

    return true;
  }

  @Route('/', 'GET')
  get(_: FastifyRequest, reply: FastifyReply) {
    return reply.status(204).send();
  }

  @Route('/token', 'GET')
  getToken(_: FastifyRequest, reply: FastifyReply) {
    return reply.status(404).send('Cannot GET /api/v1/admin/token');
  }

  @Route('/list', 'GET')
  async getAdmins(req: FastifyRequest, reply: FastifyReply) {
    const success = await this.#_checkAuth(req, reply);
    if (!success) return;

    const admins = await this.prisma.users.findMany();
    return reply.status(200).send(
      admins.filter((user) => {
        const flags = new UserFlags(user.flags);
        return flags.has(UserFlag.Admin);
      })
    );
  }

  @Route('/recruit', 'GET')
  getRecruitment(_: FastifyRequest, reply: FastifyReply) {
    return reply.status(404).send('Cannot GET /api/v1/admin/recruit');
  }

  @Route('/token', 'POST')
  async createAdminToken(req: CreateTokenRequest, reply: FastifyReply) {
    const success = await this.#_checkAuth(req, reply);
    if (!success) return;

    // find user
    const user = await this.prisma.users.findFirst({
      where: {
        id: req.body.idOrName,
        OR: {
          name: req.body.idOrName,
        },
      },
    });

    if (user === null)
      return reply.status(400).send({
        message: `User with ID or name "${req.body.idOrName}" didn't exist`,
      });

    const checkAdmin = () => {
      const flags = new UserFlags(user.flags);
      if (!flags.has('Admin')) {
        // Check if host is `arisu.land` / `staging.arisu.land`
        // This can be easily spoofed but you can't apply `Cutie`, `Admin`, `Owner`, or `Founder`
        // on the official hosted versions.
        if (req.hostname !== undefined && ['arisu.land', 'staging.arisu.land'].includes(req.hostname)) {
          // Check if the user has `Cutie` or `Founder` flags
          if (flags.has('Cutie') || flags.has('Founder')) return true;
        }

        // Check if they have the owner flag
        if (flags.has(UserFlag.Owner)) return true;

        reply.status(401).send({
          message: "cheeky you... they don't have Admin flag >:3",
        });

        return false;
      }
    };

    if (!checkAdmin()) return;

    // Create token
    const token = Security.generate(user.id, 'admin');
    return reply.status(200).send({ token: token.token });
  }

  @Route('/recruit', 'POST')
  async recruit(req: RecruitRequest, reply: FastifyReply) {
    const success = await this.#_checkAuth(req, reply);
    if (!success) return;

    // find user
    const user = await this.prisma.users.findFirst({
      where: {
        id: req.body.idOrName,
        OR: {
          name: req.body.idOrName,
        },
      },
    });

    if (user === null)
      return reply.status(400).send({
        message: `User with ID or name "${req.body.idOrName}" didn't exist`,
      });

    // set flags
    const flags = new UserFlags(user.flags);
    flags.add(UserFlag.Admin);

    await this.prisma.users.update({
      where: { id: user.id },
      data: { flags: flags.bits },
    });

    return reply.status(204).send();
  }
}
