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

import { isObject } from '@augu/utils';

const NOT_FOUND_SYMBOL = Symbol.for('$interpolation::unknown');

/**
 * Represents a base class for interpolating a regex subsitute to interpolate
 * using the {@link InterpolatedVariables.interpolate} function.
 */
export default class InterpolatedVariables<Schema extends {}> {
  constructor(private regex: RegExp, private schema: Schema) {}

  /**
   * Interpolate the {@link variables} inside of this container and
   * returns the result or a {@link CannotInterpolateError} will throw.
   *
   * @param key The key to interpolate
   * @param vars Any extra variables to use
   */
  interpolate<
    Obj extends ObjectKeysWithSeperator<Schema> = ObjectKeysWithSeperator<Schema>,
    TReturn = KeyToPropType<Schema, Obj>
  >(key: Obj, vars: Record<string, any> = {}): TReturn extends string[] ? string : string {
    const nodes = key.split('.');
    let value: any = this.schema;

    for (const node of nodes) {
      try {
        value = value[node];
      } catch (ex) {
        if (ex instanceof Error && ex.message.includes('of undefined')) {
          value = NOT_FOUND_SYMBOL;
          break;
        }

        value = null;
        break;
      }
    }

    if (value === null || value === NOT_FOUND_SYMBOL)
      throw new CannotInterpolateError(key, 'Key was missing in schema.');

    if (isObject(value)) throw new CannotInterpolateError(key, 'Value was a object, cannot return objects.');

    const reviver = (val: any) => {
      if (!vars) return val;
      return String(val).replace(this.regex, (_, key) => (String(vars[key]) === '' ? '?' : String(vars[key]) || '?'));
    };

    return Array.isArray(value) ? value.map(reviver) : reviver(value);
  }
}

export class CannotInterpolateError extends Error {
  constructor(key: string, cause: string) {
    super(`Cannot interpolate ${key}: ${cause}`);

    this.name = 'CannotInterpolateException';
  }
}
