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

  done();
};

export default fp(authentication, {
  fastify: '>=3.0',
});
