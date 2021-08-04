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

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const { version } = require('../../package.json');

const showBanner = () => {
  const path = join(process.cwd(), '..', 'assets', 'banner.txt');
  const contents = readFileSync(path, { encoding: 'utf-8' });
  const banner = contents
    .replace('$VERSION$', version)
    .replace('$COMMIT$', execSync('git rev-parse HEAD').toString().trim().slice(0, 8) ?? '... not from git ...')
    .replaceAll('$RESET$', '\x1b[0m')
    .replaceAll('$GREEN$', '\x1b[32m')
    .replaceAll('$MAGENTA$', '\x1b[95m')
    .replaceAll('$CYAN$', '\x1b[36m');

  console.log(banner);
};

export default showBanner;
