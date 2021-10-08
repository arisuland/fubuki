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

import type { FastifyPluginCallback } from 'fastify';
import type { Users } from '.prisma/client';
import fp from 'fastify-plugin';
import { useContainer } from '@augu/lilith';
import { PrismaClient } from '@prisma/client';
import SessionTokenService from '~/core/services/SessionTokenStore';
import { Security } from '~/util';

declare module 'fastify' {
  interface FastifyRequest {
    user: Users | null;
    sessionToken?: string;
  }
}

const authentication: FastifyPluginCallback<any> = (server, _, done) => {
  // type-graphql will type this for us, so...
  server.decorateRequest('user', null);
  server.decorateRequest('sessionToken', undefined);

  server.addHook('onRequest', async (req, reply) => {
    // type-graphql does the job for GraphQL
    if (req.url === '/graphql' && req.method === 'POST') return done();

    // Now we fetch! But first, the container is not visible by request
    // or server, so...
    const container = useContainer();
    const prisma = container.$ref<PrismaClient>(PrismaClient);

    if (req.headers.authorization !== undefined) {
      const [prefix, token] = req.headers.authorization.split(' ', 2);
      if (!prefix) {
        reply.status(401).send({
          message: 'Missing `Bearer` token.',
        });

        return;
      }

      if (!token) {
        reply.status(401).send({
          message: 'Missing token to use.',
        });

        return;
      }

      if (prefix !== 'Bearer') {
        reply.status(401).send({
          message: 'Token prefix was not prefixed with `Bearer`',
        });

        return;
      }

      const validated = Security.validate(token);
      if (validated === null) {
        reply.status(404).send({
          message: 'Invalid token or token was expired.',
        });

        return;
      }

      const user = await prisma.users.findUnique({
        where: {
          id: validated.user,
        },
      });

      if (user === null) {
        reply.status(404).send({
          message: 'User with token was not found.',
        });

        return;
      }

      req.user = user;
      req.sessionToken = token;
    }
  });

  done();
};

export default fp(authentication, {
  fastify: '>=3.0',
});
