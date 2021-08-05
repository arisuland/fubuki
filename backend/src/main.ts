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
import 'reflect-metadata';

// parse .env in ../.env to process.env :3
(require('@augu/dotenv') as typeof import('@augu/dotenv')).parse({
  file: require('path').join(process.cwd(), '..', '.env'),
  populate: true,
  delimiter: ',',
});

import * as constants from './utils/constants';
import showBanner from './utils/banner';
import container from './container';
import log from './singletons/logger';
import ts from 'typescript';

const main = async () => {
  showBanner();

  log.info(`Loading Arisu Backend v${constants.version} ${constants.commitHash ?? '(unknown)'}!~`);
  log.info(`-> TypeScript: ${ts.version}`);
  log.info(`->    Node.js: ${process.version}`);
  if (process.env.REGION !== undefined) log.info(`->     Region: ${process.env.REGION}`);

  try {
    await container.load();
  } catch (ex) {
    log.fatal('Unable to initialise container:', container);
    process.exit(1);
  }

  log.info(
    `✔ Arisu has launched!${
      process.env.NODE_ENV === 'development' ? ' Preview the playground here: http://localhost:28093/graphql' : ''
    }`
  );
  process.on('SIGINT', () => {
    log.warn('Told to disconnect from the world. :(');

    container.dispose();
    process.exit(0);
  });
};

main();
