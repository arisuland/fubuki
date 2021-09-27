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

require('../util/patches/RequirePatch');

// DO NOT RUN THIS USING `node` SINCE THIS IS A WORKER

import { parentPort } from 'worker_threads';
import logger from '~/core/singletons/logger';

if (parentPort === null) {
  process.exit(1);
}

const log = logger.getChildLogger({ name: 'job: verify dns' });
const main = async () => {
  log.info('Verifying DNS records...');
};

(async () => {
  await main();
  parentPort.postMessage('done');
})();
