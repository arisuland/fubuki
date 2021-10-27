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

import './util/patches/RequirePatch';
import 'reflect-metadata';

(require('@augu/dotenv') as typeof import('@augu/dotenv')).parse({
  file: (require('path') as typeof import('path')).join(process.cwd(), '..', '.env'),
  populate: true,
  schema: {
    NODE_ENV: {
      type: 'string',
      oneOf: ['development', 'production'],
      default: 'development',
    },

    DATABASE_URL: 'string',
    JWT_SECRET: 'string',
  },
});

import { registry, registerStuff, usersRegistered } from '~/core/registry/PrometheusRegistry';
import { collectDefaultMetrics } from 'prom-client';
import { init, configureScope } from '@sentry/node';
import { version, commitHash } from '~/util/Constants';
import { PrismaClient } from '@prisma/client';
import updateNotifier from './util/UpdateNotifier';
import { colors } from 'leeks.js';
import container from '~/container';
import Logger from '~/core/singletons/logger';
import isRoot from 'is-root';
import Config from './core/components/Config';
import ts from 'typescript';

const log = Logger.getChildLogger({ name: 'Arisu: bootstrap' });
const main = async () => {
  await updateNotifier();
  if (isRoot()) log.warn('Running Arisu as root is not recommended, you have been warned.');

  registerStuff();
  collectDefaultMetrics({
    prefix: 'arisu_',
    register: registry,
  });

  log.info(`Launching Arisu v${version} (${commitHash ?? 'unknown'})`);
  log.info(`-> TypeScript: ${ts.version}`);
  log.info(`->    Node.js: ${process.version}`);

  if (process.env.NODE !== undefined) {
    log.info(`-> Dedi Node: ${process.env.NODE}`);
  }

  try {
    await container.load();
  } catch (ex) {
    log.fatal('Unable to initialize DI container:', ex);
    process.exit(1);
  }

  log.info('✔ Arisu was launched successfully. :3');
  const client = container.$ref<PrismaClient>(PrismaClient);
  const config = container.$ref<Config>(Config);

  const sentryDsn = config.getProperty('sentryDsn');
  if (process.env.NODE_ENV === 'production' && sentryDsn !== undefined) {
    log.info(
      `Environment is set to ${colors.cyan('production')} and ${colors.cyan(
        '`sentryDsn`'
      )} is available, initializing...`
    );

    init({
      dsn: sentryDsn,
    });

    configureScope((scope) => {
      scope.setTags({
        'server.environment': process.env.NODE_ENV,
        'telemetry.enabled': process.env.TELEMETRY_SERVER_URL !== undefined,
        'arisu.version': require('~/package.json').version,
      });
    });

    log.info(`Installed Sentry using DSN: ${colors.cyan(sentryDsn)}`);
  }

  // get users for metrics
  const users = await client.users.findMany();
  usersRegistered.set(users.length);

  process.on('SIGINT', () => {
    log.warn('Received CTRL+C call!');

    container.dispose();
    process.exit(0);
  });
};

main().catch((ex) => {
  log.fatal('Unable to launch Arisu:', ex);
  process.exit(1);
});
