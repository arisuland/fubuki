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

import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';

export enum GarbageCollectedType {
  Scavenge = 1,
  MarkSweepCompact = 2,
  Incremental = 4,
  WeakPhantomCb = 8,
  All = 15,
}

registerEnumType(GarbageCollectedType, {
  description: 'Returns the garbage collected type for the `GarbageCollected` object.',
  name: 'GarbageCollectedType',
  valuesConfig: {
    WeakPhantomCb: {
      description: 'Weak/Phantom Callback processing',
    },

    Incremental: {
      description: 'Incremental marking',
    },

    MarkSweepCompact: {
      description: 'Mark/Sweep/Compact (major GC)',
    },

    Scavenge: {
      description: 'Scavenge (minor GC)',
    },
  },
});

@ObjectType({
  description: 'Returns the information about the garbage collected information',
})
export class GarbageCollectedInfo {
  @Field(() => Int)
  totalHeapSize!: number;

  @Field(() => Int)
  usedHeapSize!: number;
}

@ObjectType({
  description:
    'Returns the object referring to the garbage collection. Read more here: https://medium.com/voodoo-engineering/nodejs-internals-v8-garbage-collector-a6eca82540ec',
})
export class GarbageCollected {
  @Field(() => Int, {
    description: 'Returns the time it started at in milliseconds',
  })
  startedAt!: number;

  @Field(() => Int, {
    description: 'Returns the time it has ended at in milliseconds.',
  })
  endedAt!: number;

  @Field({
    description: 'Returns the type of this garbage collected statistics.',
  })
  type!: GarbageCollectedType;

  @Field()
  before!: GarbageCollectedInfo;

  @Field()
  after!: GarbageCollectedInfo;
}

@ObjectType({
  description: "Returns this process' information, this cannot collect statistics about the frontend process.",
})
export class ArisuProcess {
  @Field({ description: 'If the process is running in a Kubernetes pod.' })
  k8s!: boolean;

  @Field({ description: 'If the process is running in a Docker container.' })
  docker!: boolean;

  @Field(() => GarbageCollected, {
    description:
      'Returns the garbage collected statistics, returns `null` if Arisu is not running with the `--expose-gc` flag.',

    nullable: true,
  })
  gc!: GarbageCollected | null;

  @Field({ description: 'Returns the used memory in the V8 memory heap.' })
  heapUsed!: number;

  @Field({ description: 'Returns the total memory in the V8 memory heap.' })
  heapTotal!: number;

  @Field({
    description:
      'Resident Set Size or "rss" is the amount of space occupied in the main memory device for this process, which includes all C++ / JS objects and code.',
  })
  rss!: number;

  @Field({ description: 'The process ID' })
  pid!: number;
}
