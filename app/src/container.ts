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
import Logger from './singletons/logger';
import Http from './singletons/http';

const logger = Logger.getChildLogger({ name: 'Arisu: lilith' });
const container = new Container({
  componentsDir: join(process.cwd(), 'components'),
  servicesDir: join(process.cwd(), 'services'),
  singletons: [Logger, Http, () => import('./singletons/prisma')],
});

container.on('onBeforeChildInit', (cls, child) =>
  logger.debug(`>> ${cls.name}->${child.constructor.name}: initializing...`)
);

container.on('onAfterChildInit', (cls, child) =>
  logger.debug(`>> ✔ ${cls.name}->${child.constructor.name}: initialized`)
);

container.on('onBeforeInit', (cls) => logger.debug(`>> ${cls.name}: initializing...`));
container.on('onAfterInit', (cls) => logger.debug(`>> ✔ ${cls.name}: initialized`));
container.on('debug', (message) => logger.debug(`lilith: ${message}`));

container.on('initError', console.error);
container.on('childInitError', console.error);

export = container;
