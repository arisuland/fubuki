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

/* eslint-disable camelcase */

import { FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { Container } from '@augu/lilith';
import { User } from '.prisma/client';

declare global {
  /**
   * Returns the current container running on.
   */
  const container: Container;

  namespace NodeJS {
    interface Global {
      /**
       * Returns the current container running on.
       */
      container: Container;
    }
  }

  //#region Redis Information
  interface RedisInfo {
    total_connections_received: number;
    total_commands_processed: number;
    instantaneous_ops_per_sec: number;
    total_net_input_bytes: number;
    total_net_output_bytes: number;
    instantaneous_input_kbps: number;
    instantaneous_output_kbps: number;
    rejected_connections: number;
    sync_full: number;
    sync_partial_ok: number;
    sync_partial_err: number;
    expired_keys: number;
    expired_stale_perc: number;
    expired_time_cap_reached_count: number;
    evicted_keys: number;
    keyspace_hits: number;
    keyspace_misses: number;
    pubsub_channels: number;
    pubsub_patterns: number;
    latest_fork_usec: number;
    migrate_cached_sockets: number;
    slave_expires_tracked_keys: number;
    active_defrag_hits: number;
    active_defrag_misses: number;
    active_defrag_key_hits: number;
    active_defrag_key_misses: number;
  }

  interface RedisServerInfo {
    redis_version: string;
    redis_git_sha1: string;
    redis_git_dirty: string;
    redis_build_id: string;
    redis_mode: string;
    os: string;
    arch_bits: string;
    multiplexing_api: string;
    atomicvar_api: string;
    gcc_version: string;
    process_id: string;
    process_supervised: string;
    run_id: string;
    tcp_port: string;
    server_time_usec: string;
    uptime_in_seconds: string;
    uptime_in_days: string;
    hz: string;
    configured_hz: string;
    lru_clock: string;
    executable: string;
    config_file: string;
    io_threads_active: string;
  }
  //#endregion

  interface ArisuContext {
    /**
     * Returns the current request embedded in the current resolver.
     */
    req: FastifyRequest;

    /**
     * Returns the current Prisma client attached. The container
     * can be reached using the `container` global variable.
     */
    prisma: PrismaClient;
  }

  interface SessionDetails {
    /**
     * Returns the current user details this session is attached to. Sessions are only
     * responsible for every action within `localStorage`, access tokens can operate
     * CRUD updates using [access tokens](https://docs.arisu.land/api/access-tokens)
     * and never with session tokens.
     */
    user: Omit<User, 'email' | 'password'>;

    /**
     * Returns the date that this session expires at, roughly Date.now() + 2 days is
     * the estimated time. If the backend relaunches, it'll restore the session with the same
     * key but minus how long it has been, if it's been +2 days since relaunch, it'll cancel
     * the sessions from that period.
     */
    expiredAt: Date;
  }
}
