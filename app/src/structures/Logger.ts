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

import * as leeks from 'leeks.js';

function getCallSites(): NodeJS.CallSite[] {
  const _prepare = Error.prepareStackTrace;

  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack!.slice(1) as unknown as NodeJS.CallSite[];
  Error.prepareStackTrace = _prepare;

  return stack;
}
