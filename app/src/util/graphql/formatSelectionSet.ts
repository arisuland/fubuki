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

import { SelectionNode } from 'graphql';

const formatSelectionSet = (value: SelectionNode) => {
  let formatted = '';
  switch (value.kind) {
    case 'Field':
      formatted += value.name.value;
      break;

    case 'InlineFragment':
      {
        formatted += `...${value.typeCondition !== undefined ? ` on ${value.typeCondition.name.value}` : ''} {`;
        for (const select of value.selectionSet.selections) {
          const f = formatSelectionSet(select);
          formatted += `\n    ${f}`;
        }

        formatted += '}';
      }
      break;

    case 'FragmentSpread':
      formatted += `...${value.name.value}`;
      break;

    default:
      return 'unknown';
  }

  return formatted;
};

export default formatSelectionSet;
