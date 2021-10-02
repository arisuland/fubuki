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

import { Resolver, Subscription, UseMiddleware } from 'type-graphql';
import { ArisuProcess, GarbageCollectedType } from '../objects/AdminDashboard';
import { requireAdmin } from '../middleware';
import type { Stats } from 'gc-stats';
import { sleep } from '@augu/utils';
import isDocker from 'is-docker';
import isK8s from 'is-kubernetes';

let gcEmitter: ReturnType<typeof import('gc-stats')> | null = null;

@Resolver()
export default class AdminDashboardSubscriber {
  @Subscription(() => ArisuProcess, {
    topics: ['ADMIN_DASHBOARD'],
  })
  @UseMiddleware(requireAdmin)
  async adminSubscriber() {
    console.log('called');

    // Check if `--expose-gc` is in the node flags
    if (global.gc !== undefined && gcEmitter === null) gcEmitter = require('gc-stats')();

    // Let's do the garbage collecting!
    const memory = process.memoryUsage();
    const proc = {
      k8s: isK8s(),
      docker: isDocker(),
      gc: null as Record<string, any> | null,
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      rss: memory.rss,
      pid: process.pid,
    };

    if (gcEmitter !== null) {
      const callback = (stats: Stats) => {
        proc.gc = {
          startedAt: stats.startTime,
          endedAt: stats.endTime,
          type:
            stats.gctype === 1
              ? GarbageCollectedType.Scavenge
              : stats.gctype === 2
              ? GarbageCollectedType.MarkSweepCompact
              : stats.gctype === 4
              ? GarbageCollectedType.Incremental
              : stats.gctype === 8
              ? GarbageCollectedType.WeakPhantomCb
              : GarbageCollectedType.All,

          before: stats.before,
          after: stats.after,
        };
      };

      global.gc!();
      gcEmitter.on('stats', callback);
      await sleep(5000);
    }

    return proc;
  }
}
