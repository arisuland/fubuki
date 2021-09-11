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

import type { FastifyRequest, FastifyReply } from 'fastify';
import type { NonEmptyArray } from 'type-graphql';
import type { Container } from '@augu/lilith';
import { PrismaClient } from '@prisma/client';

// Resolvers
import TestResolver from './resolvers/TestResolver';
import UserResolver from './resolvers/UserResolver';
import LoginResolver from './resolvers/LoginResolver';
import ProjectResolver from './resolvers/ProjectResolver';

export interface ArisuContext {
  req: FastifyRequest;
  reply: FastifyReply;
  container: Container;
  prisma: PrismaClient;
}

// eslint-disable-next-line
export const resolvers = [TestResolver, UserResolver, LoginResolver, ProjectResolver] as NonEmptyArray<Function>;
