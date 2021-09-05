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

import type { ObjectFieldNode, ValueNode } from 'graphql';
import { withIndex } from '..';

const formatArgValue = (value: ValueNode) => {
  let formatted = '';
  switch (value.kind) {
    case 'StringValue':
      formatted += `"${value.value}"`;
      break;

    case 'NullValue':
      formatted += 'null';
      break;

    case 'IntValue':
    case 'FloatValue':
      formatted += value.value;
      break;

    case 'BooleanValue':
      formatted += value.value ? 'true' : 'false';
      break;

    case 'EnumValue':
      formatted += value.value;
      break;

    case 'ObjectValue':
      {
        formatted += '{ ';
        for (const [index, innerArg] of withIndex(value.fields as any)) {
          const arg = innerArg as ObjectFieldNode;
          const result = formatArgValue(arg.value);
          formatted += `"${innerArg.name.value}": ${result}${index + 1 === value.fields.length ? ' ' : ', '}`;
        }

        formatted += '}';
      }
      break;

    case 'ListValue': {
      formatted += '[';
      for (const [index, innerArg] of withIndex(value.values as any)) {
        const arg = innerArg as ValueNode;
        const result = formatArgValue(innerArg);
        formatted += `${result}${index + 1 === value.values.length ? '' : ', '}`;
      }

      formatted += ']';
    }
  }

  return formatted;
};

export default formatArgValue;
