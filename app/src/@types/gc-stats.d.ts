/*
 * TypeScript typings for the `gc-stats` module
 *
 * Project: https://github.com/dainis/node-gcstats
 * Declarations by:
 *    - Noel <cutie@floofy.dev>
 */

declare module 'gc-stats' {
  import { EventBus } from '@augu/utils';

  interface GCStatsEvents {
    data(stats: Stats): void;
    stats(stats: Stats): void;
  }

  export interface Stats {
    startTime: number;
    endTime: number;
    pause: number;
    pauseMS: number;

    /**
     * Returns the type of this garbage collected statistics.
     * - `1`: Scavenge (minor GC)
     * - `2`: Mark/Sweep/Compact (major GC)
     * - `4`: Incremental marking
     * - `8`: Weak/Phantom Callback processing
     * - `15`: All
     */
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

  // eslint-disable-next-line
  interface GCStats extends EventBus<GCStatsEvents> {}

  const gcStats: () => GCStats;
  export = gcStats;
}
