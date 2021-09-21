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

import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType({
  description:
    'Returns the statistics about the current backend process. This is only used in the `ADMIN_DASHBOARD` subscription that administrators can subscribe to.',
})
export default class AdminDash {}

/*
  interface Stats {
    startTime: number;
    endTime: number;
    pause: number;
    pauseMS: number;
    gctype: 1 | 2 | 4 | 8 | 15;
    before: Info;
    after: Info;
    diff: Info;
  }

  interface Info {
    totalHeapSize: number;
    usedHeapSize: number;
    totalHeapExecutableSize: number;
    heapSizeLimit: number;
    totalPhysicalSize: number;
    totalAvailableSize: number;
    mallocedMemory: number;
    peakMallocedMemory: number;
    numberOfNativeContexts: number;
    numberOfDetachedContexts: number;
  }
*/

/**
 * Returns the type of this garbage collected statistics.
 * - `1`: Scavenge (minor GC)
 * - `2`: Mark/Sweep/Compact (major GC)
 * - `4`: Incremental marking
 * - `8`: Weak/Phantom Callback processing
 * - `15`: All
 */
