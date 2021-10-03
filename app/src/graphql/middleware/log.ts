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

import { calculateHRTime, titleCase } from '@augu/utils';
import type { MiddlewareFn } from 'type-graphql';
import type { ArisuContext } from '..';
import { graphqlLatency } from '~/core/registry/PrometheusRegistry';
import { colors, styles } from 'leeks.js';
import GraphQLHighlighter from '~/util/graphql/highlighter';
import { Logger } from 'tslog';

const pings = [] as number[];
let lastPing: [number, number];
let timerHook: any;

// So Noel, what's the different between src/middleware/logging.ts
// and src/graphql/middleware/log.ts? Well, the difference is,
// this is on the GraphQL execution point while logging.ts is refered
// to the request execution.
const mod: MiddlewareFn<ArisuContext> = async ({ context, info }, next) => {
  console.log('a');

  const logger = context.container.$ref(Logger);
  const startedAt = process.hrtime();
  lastPing = startedAt;

  timerHook = graphqlLatency.startTimer();
  await next();

  const resolvedTime = calculateHRTime(startedAt);
  timerHook?.();
  pings.push(resolvedTime);

  const avg = pings.reduce((acc, curr) => acc + curr, 0) / pings.length;
  logger.debug(
    `${colors.cyan('graphql:query')} ~ ${titleCase(info.operation.operation)} was executed in ${resolvedTime.toFixed(
      2
    )}ms (avg: ${styles.bold(colors.magenta(`${avg.toFixed(2)}ms`))})`,
    '\n',
    GraphQLHighlighter.instance.highlight(info)
  );
};

export { lastPing, pings };
export default mod;
