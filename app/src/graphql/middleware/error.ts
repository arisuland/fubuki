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

import type { MiddlewareFn } from 'type-graphql';
import type { ArisuContext } from '..';
import { Logger } from 'tslog';
import formatArgValue from '~/util/graphql/formatArgValue';
import formatSelectionSet from '~/util/graphql/formatSelectionSet';

const mod: MiddlewareFn<ArisuContext> = async ({ context, info }, next) => {
  const logger: Logger = context.container.$ref(Logger);
  try {
    return await next();
  } catch (ex) {
    let pointedAt = '';
    if (info.fieldNodes.length > 0) {
      for (const field of info.fieldNodes) {
        pointedAt += field.name.value;

        if (field.arguments !== undefined) {
          pointedAt += '(';
          for (const arg of field.arguments) pointedAt += `${arg.name.value}: ${formatArgValue(arg.value)}`;

          pointedAt += ')';
        }

        if (field.selectionSet !== undefined) {
          pointedAt += ' {';
          for (const select of field.selectionSet.selections) {
            const formatted = formatSelectionSet(select);
            pointedAt += `\n    ${formatted}`;
          }

          pointedAt += '\n  }';
        }

        pointedAt += '\n';
      }
    }

    let actualOperation = '';
    switch (info.operation.operation) {
      case 'query':
        actualOperation += 'query {\n';
        break;

      case 'mutation':
        actualOperation += `mutation${info.operation.name !== undefined ? ` ${info.operation.name} {\n` : ' {\n'}`;
        break;

      case 'subscription':
        actualOperation += `subscription${info.operation.name !== undefined ? ` ${info.operation.name} {\n` : ' {\n'}`;
        break;
    }

    actualOperation += `  ${pointedAt}`;
    actualOperation += '}';

    logger.fatal(`Unable to run GraphQL query:`, '\n', actualOperation, ex);
    throw ex;
  }
};

export default mod;
