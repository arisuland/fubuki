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

import { Subscribe, Inject } from '@augu/lilith';
import Bree from 'bree';
import { Logger } from 'tslog';

export default class BreeListener {
  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly bree!: Bree;

  @Subscribe('worker created')
  onWorkerCreate(name: string) {
    this.logger.info(`Worker with name ${name} has been created.`);
    this.bree.workers[name].on('message', (msg: any) => {
      if (msg === 'done') {
        this.logger.debug(`Worker ${name} has completed it's job.`);
      }
    });
  }

  @Subscribe('worker deleted')
  onWorkerDeleted(name: string) {
    this.logger.warn(`Worker ${name} has been destroyed.`);
    this.bree.workers[name].removeAllListeners();
  }
}
