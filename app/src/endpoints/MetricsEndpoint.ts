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

import { FastifyReply, FastifyRequest } from 'fastify';
import { Endpoint, Route } from '~/core';
import { registry } from '~/core/registry/PrometheusRegistry';

@Endpoint('/metrics')
export default class MetricsEndpoint {
  @Route('/', 'GET')
  async metrics(req: FastifyRequest<{ Querystring: { format?: 'json' | 'normal' } }>, reply: FastifyReply) {
    if (req.query.format !== undefined && !['json', 'normal'].includes(req.query.format!))
      return reply.status(404).send({
        message: `Invalid format \`?format=${req.query.format}\`, options are: "json" or "normal"`,
      });

    const methodName =
      req.query.format === undefined ? 'metrics' : req.query.format === 'json' ? 'getMetricsAsJSON' : 'metrics';

    const data = await registry[methodName]();
    return reply.status(200).send(data);
  }
}
