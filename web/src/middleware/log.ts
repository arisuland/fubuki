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

import type { ServerMiddleware } from '@nuxt/types';
import * as leeks from 'leeks.js';
import consola from 'consola';

const calculateHrTime = (now: [number, number]) => {
  const difference = process.hrtime(now);
  return (difference[0] * 1e9 + difference[1]) / 1e6;
};

const mod: ServerMiddleware = (req, res, next) => {
  // Skip `/_nuxt` requests
  if (req.url!.includes('/_nuxt')) return next();

  const now = process.hrtime();
  res.once('finish', () => {
    const endTime = calculateHrTime(now);

    consola.success(
      `[ ${leeks.colors.cyan(new Date().toLocaleString('en-US'))} | ${leeks.colors.magenta(
        ` ${req.method!.toUpperCase()} ${req.url} `
      )} ] ${leeks.styles.bold(`${res.statusCode} (${res.statusMessage})`)} ${leeks.colors.cyan(
        '('
      )}${leeks.styles.bold(leeks.hex('#FFC0DC', `~${endTime.toFixed(2)}ms`))}${leeks.colors.cyan(')')}`
    );
  });

  next();
};

export default mod;
