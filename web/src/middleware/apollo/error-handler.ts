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

import type { ServerParseError } from '@apollo/client/link/http';
import type { ErrorResponse } from '@apollo/client/link/error';
import type { ServerError } from '@apollo/client/link/utils';
import type { ApolloError } from '@apollo/client';

const isErrorResponse = (val: any): val is ErrorResponse => val.operation !== undefined && val.forward !== undefined;
const isServerParseError = (val: any): val is ServerParseError =>
  val.statusCode !== undefined && val.response !== undefined;

const isServerError = (val: any): val is ServerError => val.statusCode !== undefined && val.result !== undefined;

export default (error: ApolloError | ErrorResponse) => {
  console.error(
    '%c[Apollo Error]%c An exception has occured while querying:',
    'font-weight:bold;color:#F99393;',
    'color:white;'
  );

  if (isErrorResponse(error)) {
    console.error(
      `> %cOperation: %c${error.operation.operationName}`,
      'font-weight:bold;color:#D18DB0;',
      'color:white;'
    );
  }

  if (error.networkError !== undefined || error.networkError !== null) {
    let content = `%c${error.networkError!.name}: ${error.networkError!.message}%c`;

    if (isServerError(error.networkError!))
      content += ` (${error.networkError!.response.status} ${error.networkError!.response.statusText})`;

    if (isServerParseError(error.networkError!))
      content += ` (${error.networkError!.statusCode} - ${error.networkError!.bodyText})`;

    console.error(content, 'font-weight:bold;color:#F99393;', 'color:white;');
  }
};
