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

const mod: ServerMiddleware = (_, res, next) => {
  if (res.headersSent) return next();

  res.setHeader('Access-Control-Allow-Methods', 'GET'); // only allow get requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=7776000');
  res.setHeader('X-Powered-By', 'cute furries doing cute things (https://floofy.dev)');
  res.setHeader('Server', `Noelware${process.env.NODE !== undefined ? ` (${process.env.NODE})` : ''}`);
  return next();
};

export default mod;
