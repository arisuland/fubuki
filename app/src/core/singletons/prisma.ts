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

import { Container, useContainer } from '@augu/lilith';
import { calculateHRTime } from '@augu/utils';
import { colors, styles } from 'leeks.js';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { PrismaClient } from '@prisma/client';
import { Logger } from 'tslog';

const highlighter = new SqlHighlighter();
export async function teardown(this: Container, prisma: PrismaClient) {
  const logger: Logger = this.$ref(Logger);
  logger.warn('Tearing down Prisma client...');

  await prisma.$disconnect();
}

const client = new PrismaClient({
  errorFormat: 'pretty',
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

client.$on('query', (event) => {
  const container = useContainer();
  const logger: Logger = container.$ref(Logger);

  logger.debug(`SQL query executed:\n${highlighter.highlight(event.query)}`);
});

client.$use(async (params, next) => {
  const container = useContainer();
  const logger: Logger = container.$ref(Logger);

  const before = process.hrtime();
  const result = await next(params);
  const after = calculateHRTime(before);
  logger.debug(
    `${styles.bold(
      colors.cyan(`${params.model ?? '<unknown>'}${colors.white('->')}${styles.bold(colors.cyan(params.action))}`)
    )} - Executed operation in ${after.toFixed(2)}ms`
  );

  return result;
});

export default client;
