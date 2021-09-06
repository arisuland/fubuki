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

/**
 * Debounces a certain action until the amount of time defined until the next execution is called.
 * @param func The function to call
 * @param wait The amount of time to wait
 * @param immediate If this function should be immediately called after it's done.
 */
export default function debounce<F extends (...args: any[]) => any>(func: F, wait = 2500, immediate = false) {
  let timeout: any;
  return function (this: any, ...args: any[]) {
    const shouldCall = immediate && !timeout;
    if (timeout) window.clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = undefined;
      if (!immediate) func.call(this, ...args);
    }, wait);

    if (shouldCall) func.call(this, ...args);
  };
}
