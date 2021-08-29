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

import { Inject, Service, ServiceAPI } from '@augu/lilith';
import { Logger } from 'tslog';
import { join } from 'path';
import Sentry from '@sentry/node';
import Bree from 'bree';

// https://github.com/breejs/bree/issues/24
function createTypescriptWorker() {
  const path = require('path') as typeof import('path'); // i would like my intellisense kthnx <3
  const tsNode = require('ts-node') as typeof import('ts-node'); // uwu intellisense <3
  const { workerData } = require('worker_threads') as typeof import('worker_threads'); // god i wish require() was more type-safe :')

  tsNode.register({
    files: true,
    project: path.join(process.cwd(), '..', 'tsconfig.json'),
  });

  require(path.resolve(__dirname, workerData.fileName));
}

@Service({
  priority: 0,
  name: 'jobs',
})
export default class JobService {
  @Inject
  private readonly logger!: Logger;
  private bree!: Bree;

  api!: ServiceAPI;

  async load() {
    this.logger.info('Initializing jobs...');
    this.bree = new Bree({
      root: false,
      logger: this.logger,
      // @ts-ignore
      outputWorkerMetadata: true, // they mispelled it.
      jobs: [
        {
          name: 'verify:dns:records',
          cron: '*/5 * * * *', // 5 minutes
          path: createTypescriptWorker,
          worker: {
            workerData: {
              fileName: join(process.cwd(), 'jobs', 'verifyDnsRecords.ts'),
            },
          },
        },
      ],

      errorHandler: (error, metadata) => {
        this.logger.error(
          `Unable to run job ${metadata.name} on thread #${metadata.workerId}${
            metadata.isMainThreads ? ' (main)' : ''
          }:`
        );
        this.logger.error(error);

        // capture to sentry if we can :3
        Sentry.captureException(error);
      },
    });
  }

  dispose() {
    this.bree.stop();
  }
}
