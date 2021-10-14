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

import { App, createNodeMiddleware } from '@octokit/app';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export const createOctokitMiddleware = (app: App) => {
  const nodeMiddleware = createNodeMiddleware(app);

  const middleware: FastifyPluginCallback = (server, _, done) => {
    server.addHook('onRequest', (req, reply, done) => nodeMiddleware(req.raw, reply.raw, done));
    done();
  };

  return fp(middleware, {
    name: 'octokit:middleware',
    fastify: '>=3.x',
  });
};
