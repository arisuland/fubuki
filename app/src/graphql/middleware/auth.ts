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

import type { ArisuContext } from '..';
import type { MiddlewareFn } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { Security } from '~/util';
import SessionTokenService from '~/services/SessionTokenStore';

const mod: MiddlewareFn<ArisuContext> = async ({ context }, next) => {
  const prisma: PrismaClient = context.container.$ref(PrismaClient);
  const sessions: SessionTokenService = context.container.$ref(SessionTokenService);

  if (!context.req.headers.authorization) throw new Error('Missing `Authorization` header.');

  const [prefix, token] = context.req.headers.authorization.split(' ');
  if (!prefix) throw new Error('Missing `Bearer` prefix.');
  if (!token) throw new Error('Missing token to validate.');
  if (!['Bearer', 'Session'].includes(prefix)) throw new Error('Token prefix must start with `Bearer ` or `Session `');

  const validated = Security.validate(token);
  if (validated === null) throw new Error("Token doesn't exist");

  const user = await prisma.users.findUnique({
    where: {
      id: validated.user,
    },
  });

  if (user === null) throw new Error("Access token from user doesn't exist.");
  if (prefix === 'Session') {
    if (!(await sessions.hasSession(user.id))) throw new Error('Please login to make this query.');
  }

  context.req.user = user;
  context.req.sessionToken = token;

  return next();
};

export default mod;
