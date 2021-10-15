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

import 'source-map-support/register';

import { createOctokitMiddleware } from './middleware/octokit';
import { createAppAuth } from '@octokit/auth-app';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import * as kafka from './kafka';
import { client } from './prisma';
import consola from 'consola';
import fastify from 'fastify';
import { App } from '@octokit/app';

(require('@augu/dotenv') as typeof import('@augu/dotenv')).parse({
  file: (require('path') as typeof import('path')).join(process.cwd(), '..', '.env'),
  populate: true,
  schema: {
    NODE_ENV: {
      default: 'development',
      oneOf: ['development', 'production'],
      type: 'string',
    },

    HOST: {
      default: '0.0.0.0',
      type: 'string',
    },

    PORT: {
      type: 'int',
      default: 8890,
    },

    DATABASE_URL: 'string',
    TSUBAKI_URL: 'string',
    WEBHOOK_SECRET: 'string',
    GITHUB_APP_ID: 'string',
    GITHUB_APP_SECRET: 'string',
    GITHUB_APP_PEM_LOCATION: 'string',
    KAFKA_CONSUMER_TOPIC: 'string',
    KAFKA_CONSUMER_BROKERS: 'string',
    GITHUB_APP_INSTALLATION_ID: 'int',
    KAFKA_CONSUMER_GROUP_ID: {
      default: undefined,
      type: 'string',
    },
  },
});

const logger = consola.withScope('arisu:github');

const main = async () => {
  if (!existsSync(process.env.GITHUB_APP_PEM_LOCATION))
    throw new Error(
      `Missing \`GITHUB_APP_PEM_LOCATION\` location. It was not found on ${process.env.GITHUB_APP_PEM_LOCATION}`
    );

  logger.info('Launching Kafka consumer...');
  await kafka.connect();

  logger.info('Launching Prisma client...');
  await client.$connect();

  logger.info('Creating GitHub app and server...');
  const privateKey = await readFile(process.env.GITHUB_APP_PEM_LOCATION, 'utf-8');
  const app = new App({
    appId: process.env.GITHUB_APP_INSTALLATION_ID,
    privateKey,
    webhooks: {
      secret: process.env.WEBHOOK_SECRET,
    },
    oauth: {
      allowSignup: false,
      clientId: process.env.GITHUB_APP_ID,
      clientSecret: process.env.GITHUB_APP_SECRET,
    },
  });

  const installation = await app.getInstallationOctokit(parseInt(process.env.GITHUB_APP_INSTALLATION_ID));
  const info = await installation.request('GET /app');
  logger.info(`Authenticated as application ${info.data.name} (${info.data.id})`);

  const server = fastify();
  server.register(require('fastify-no-icon')).register(createOctokitMiddleware(app));

  process.on('SIGINT', async () => {
    logger.info('Told to disconnect... (CTRL+C action)');

    await client.$disconnect();
    await kafka.disconnect();
    server.close(() => {
      // noop
    });
  });

  return server.listen(
    {
      port: parseInt(process.env.PORT ?? '8890'),
      host: process.env.HOST ?? '0.0.0.0',
    },
    (error, address) => {
      if (error) {
        logger.error('Unable to start server:', error);
        process.exit(1);
      }

      logger.info(`GitHub bot has launched in ${address}!`);
    }
  );
};

main().catch((ex) => {
  logger.fatal('Unable to start GitHub Bot:', ex);
  process.exit(1);
});
