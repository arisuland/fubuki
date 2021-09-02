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
import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema } from 'type-graphql';
import { Logger } from 'tslog';
import { join } from 'path';
import fastify from 'fastify';
import Config from './Config';

// Fastify plugins
import ratelimitsPlugin from '~/middleware/ratelimits';
import authPlugin from '~/middleware/authentication';
import logPlugin from '~/middleware/logging';

// Resolvers
import type { ArisuContext } from '~/graphql';
import TestResolver from '~/graphql/resolvers/TestResolver';

@Component({ priority: 0, name: 'http', children: join(process.cwd(), 'endpoints') })
export default class HttpServer {
  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly config!: Config;
  api!: ComponentAPI;
  #server!: ReturnType<typeof fastify>;

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

    // Start apollo
    await apollo.start();

    this.#server = fastify();
    this.#server
      .register(require('fastify-cors'))
      .register(authPlugin)
      .register(logPlugin)
      .register(ratelimitsPlugin)
      .register(apollo.createHandler({ cors: true }));

    return new Promise<void>((resolve, reject) => {
      this.#server.listen(
        {
          port: 17093,
          host: this.config.getProperty('host'),
        },
        (error, address) => {
          if (error) {
            this.logger.error(error);
            return reject(error);
          }

          this.logger.info(`🚀✨ Arisu has launched at ${address.replace('[::]', 'localhost')}!`);
          resolve();
        }
      );
    });
  }

  dispose() {
    return this.#server.close();
  }

  onChildLoad(endpoint: any) {
    console.log(endpoint);
  }
}
