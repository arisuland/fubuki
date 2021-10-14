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

import 'source-map-support/register';

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import consola from 'consola';

(require('@augu/dotenv') as typeof import('@augu/dotenv')).parse({
  file: (require('path') as typeof import('path')).join(process.cwd(), '..', '.env'),
  populate: true,
  schema: {
    NODE_ENV: {
      default: 'development',
      oneOf: ['development', 'production'],
      type: 'string',
    },

    GITHUB_APP_ID: 'string',
    GITHUB_APP_SECRET: 'string',
    GITHUB_APP_PEM_LOCATION: 'string',
  },
});

const logger = consola.withScope('arisu:github');
