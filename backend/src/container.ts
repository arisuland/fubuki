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

import { Container } from '@augu/lilith';
import { join } from 'path';

import prisma from './singletons/prisma';
import http from './singletons/http';
import log from './singletons/logger';

const container = new Container({
  componentsDir: join(process.cwd(), 'components'),
  servicesDir: join(process.cwd(), 'services'),
  singletons: [
    prisma,
    http,
    log
  ]
});

container
  .on('onBeforeInit', cls => log.debug(`>> ${cls.name}: initializing...`))
  .on('onAfterInit',  cls => log.debug(`>> ${cls.name}: initialized successfully~`))
  .on('childInitError', log.fatal)
  .on('initError', log.fatal)
  .on('debug', log.debug);

export = container;
