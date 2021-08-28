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

export { default as InterpolatedVariables, CannotInterpolateError } from './InterpolatedVariables';
export { default as Snowflake } from './Snowflake';
export { default as Security } from './Security';
export * as Constants from './Constants';
export * from './proxy/ProxyUtil';

import { isObject } from '@augu/utils';
import * as leeks from 'leeks.js';

/**
 * Traverse through an array with a tuple of `[index, item]`.
 *
 * @param array The array to traverse from
 * @returns A sync {@link Generator} to use in for-of loops.
 * @example ```ts
 * import { withIndex } from '~/util';
 *
 * const arr = ['a', 'b', 'c'];
 * for (const [index, item] of withIndex(arr)) console.log(`#${index + 1}: ${item}`);
 *
 * //=> #1: a
 * //=> #2: b
 * //=> #3: c
 * ```
 */
export function* withIndex<T extends any[]>(array: T): Generator<[index: number, item: T[any]]> {
  for (let i = 0; i < array.length; i++) {
    yield [i, array[i]];
  }
}

/**
 * Returns the {@link NodeJS.CallSite call sites} of a empty error.
 * @returns Returns the call sites available.
 */
export function getCallSites(_of?: Error): NodeJS.CallSite[] {
  const _prepare = Error.prepareStackTrace;

  Error.prepareStackTrace = (_, stack) => stack;
  const stack = _of
    ? (_of.stack!.slice(1) as unknown as NodeJS.CallSite[])
    : (new Error().stack!.slice(1) as unknown as NodeJS.CallSite[]);

  Error.prepareStackTrace = _prepare;

  return stack;
}
