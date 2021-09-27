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
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Endpoint, Route } from '~/core';

@Endpoint('/')
export default class MainEndpoint {
  @Route('/', 'GET')
  hello(_: FastifyRequest, res: FastifyReply) {
    return res.type('application/json').status(200).send({
      hello: 'world',
      docs_url: 'https://docs.arisu.land',
    });
  }

  @Route('/favicon.ico', 'GET')
  favicon(_: FastifyRequest, reply: FastifyReply) {
    return reply.status(404).send('Cannot GET /favicon.ico');
  }
}
