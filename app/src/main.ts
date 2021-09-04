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
import 'source-map-support/register';
import 'reflect-metadata';

(require('@augu/dotenv') as typeof import('@augu/dotenv')).parse({
  file: (require('path') as typeof import('path')).join(process.cwd(), '..', '.env'),
  populate: true,
});

import { version, commitHash } from '~/util/Constants';
import container from '~/container';
import Logger from '~/singletons/logger';
import ts from 'typescript';

const log = Logger.getChildLogger({ name: 'Arisu: bootstrap' });
const main = async () => {
  log.info(`Launching Arisu v${version} (${commitHash ?? 'unknown'})`);
  log.info(`-> TypeScript: ${ts.version}`);
  log.info(`->    Node.js: ${process.version}`);

  if (process.env.NODE !== undefined) {
    log.info(`-> Dedi Node: ${process.env.NODE}`);
  }

  try {
    await container.importSingleton(() => import('~/singletons/prisma') as any);
    await container.load();
  } catch (ex) {
    log.fatal('Unable to initialize DI container:', ex);
    process.exit(1);
  }

  log.info('✔ Arisu was launched successfully. :3');
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
