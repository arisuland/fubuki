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

import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';

import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { AbstractRoute, EndpointKey, RouteKey } from '~/core';
import { Component, ComponentAPI, Inject } from '@augu/lilith';
import { ApolloServer } from 'apollo-server-fastify';
import { PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';
import { Logger } from 'tslog';
import { join } from 'path';
import Config from './Config';
import Route from '~/core/Route';

// Fastify plugins
import ratelimitsPlugin from '~/core/middleware/ratelimits';
import authPlugin from '~/core/middleware/authentication';
import logPlugin from '~/core/middleware/logging';

// Resolvers / Global Middleware
import { ArisuContext, resolvers } from '~/graphql';
import { error, log } from '~/graphql/middleware';
import { requestsHit } from '../registry/PrometheusRegistry';

const mergePrefixes = (prefix: string, other: string) => (prefix === '/' ? other : `${prefix}${other}`);

@Component({ priority: 0, name: 'http', children: join(process.cwd(), 'endpoints') })
export default class HttpServer {
  @Inject
  private readonly prisma!: PrismaClient;

  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly config!: Config;

  api!: ComponentAPI;
  #server!: ReturnType<typeof fastify>;

  async load() {
    this.logger.info('Launching website...');

    const schema = await buildSchema({
      resolvers,
      globalMiddlewares: [log, error],
    });

    const apollo = new ApolloServer({
      schema,
      context: ({ request: req, reply }: { request: FastifyRequest; reply: FastifyReply }): ArisuContext => ({
        container: this.api.container,
        req,
        reply,
        prisma: this.prisma,
      }),

      plugins: [
        process.env.NODE_ENV === 'development'
          ? ApolloServerPluginLandingPageGraphQLPlayground({
              faviconUrl: 'https://cdn.floofy.dev/images/trans.png',
            })
          : ApolloServerPluginLandingPageDisabled(),
      ],
    });

    this.#server = fastify();
    await apollo.start();

    this.#server
      .register(require('fastify-multipart'))
      .register(require('fastify-no-icon'))
      .register(authPlugin)
      .register(logPlugin)
      .register(ratelimitsPlugin)
      .register(apollo.createHandler());

    return this.#server.listen(
      {
        port: 17903,
        host: this.config.getProperty('host') ?? '0.0.0.0',
      },
      (error, address) => {
        if (error) {
          this.logger.error(error);
          return;
        }

        this.logger.info(`🚀✨ Arisu has launched at ${address.replace('[::]', 'localhost')}!`);
      }
    );
  }

  async dispose() {
    this.logger.info('Closing server...');
    return this.#server.close();
  }

  onChildLoad(endpoint: any) {
    const endpointMeta = Reflect.getMetadata<{ prefix: string }>(EndpointKey, endpoint.constructor);
    if (!endpointMeta) {
      this.logger.warn(`Endpoint class ${endpoint.constructor.name} didn't include a @Endpoint decorator.`);
      return;
    }

    this.logger.info(`Implementing route ${endpointMeta.prefix}`);
    const routes = Reflect.getMetadata<AbstractRoute<any>[]>(RouteKey, endpoint);
    if (!routes) {
      this.logger.warn(`Endpoint ${endpointMeta.prefix} is missing routes.`);
      return;
    }

    this.logger.info(`Found ${routes.length} routes to implement!`);
    for (const route of routes) {
      this.logger.debug(`${route.method} ${mergePrefixes(endpointMeta.prefix, route.path)}`);

      const r = new Route<any>(endpoint, route);

      let merged = mergePrefixes(endpointMeta.prefix, route.path);
      if (merged !== '/' && merged.endsWith('/')) merged = merged.slice(0, merged.length - 1);

      this.#server[route.method.toLowerCase()](merged, async (req: FastifyRequest, reply: FastifyReply) => {
        try {
          requestsHit.inc({ method: req.method, endpoint: req.url });
          return await r.run(req, reply);
        } catch (ex) {
          this.logger.fatal(
            `Unable to run route ${route.method} ${mergePrefixes(endpointMeta.prefix, route.path)}:`,
            ex
          );
          return reply
            .type('application/json')
            .status(500)
            .send({
              message: `Unable to run route ${route.method} ${mergePrefixes(endpointMeta.prefix, route.path)}!`,
            });
        }
      });
    }
  }
}
