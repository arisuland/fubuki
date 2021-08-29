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

import { Component, ComponentAPI, Inject } from '@augu/lilith';
import { Nuxt, Builder } from 'nuxt'; // i wish nuxt gave us typings 3:
import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema } from 'type-graphql';
import nuxtConfig from '@/nuxt.config';
import { Logger } from 'tslog';
import fastify from 'fastify';
import Config from './Config';

// Fastify plugins
import ratelimitsPlugin from '~/middleware/ratelimits';
import authPlugin from '~/middleware/authentication';
import logPlugin from '~/middleware/logging';

// Resolvers
import type { ArisuContext } from '~/graphql';
import TestResolver from '~/graphql/resolvers/TestResolver';

@Component({ priority: 0, name: 'http' })
export default class HttpServer {
  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly config!: Config;
  api!: ComponentAPI;

  #server!: ReturnType<typeof fastify>;
  #apollo!: ApolloServer;

  async load() {
    this.logger.info('Launching website...');

    const schema = await buildSchema({
      resolvers: [TestResolver],
    });

    const apollo = new ApolloServer({
      schema,
      context: (a) => {
        console.log(a);
        return {
          container: this.api.container,
        } as ArisuContext;
      },
    });

    this.#server = fastify();
    this.#server.register(require('fastify-cors')).register(authPlugin).register(logPlugin).register(ratelimitsPlugin);

    // Start apollo
    await apollo.start();
    this.#apollo = apollo;
    this.#server.register(this.#apollo.createHandler());

    // Create a Nuxt instance
    const nuxt = new Nuxt(nuxtConfig);

    // If we are in development mode, use `Builder`
    if (process.env.NODE_ENV === 'development') {
      const builder = new Builder(nuxt);
      await builder.build(); // build the application shit
    }

    // Get the generated routes.json file
    const routes = require('@/.nuxt/routes.json');
    for (const route of routes) {
      // All the routes are GET requested only, so :shrug:
      this.#server.get(route.path, (req, reply) => {
        nuxt.render(req.raw, reply.raw);
        reply.sent = true;
      });
    }

    // Call .ready on fastify
    await this.#server.ready();
  }
}
