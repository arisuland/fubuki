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

import { Component, Inject } from '@augu/lilith';
import { Stopwatch } from '@augu/utils';
import { Logger } from 'tslog';
import IORedis from 'ioredis';
import Config from './Config';

@Component({
  priority: 4,
  name: 'redis',
})
export default class Redis {
  public client!: IORedis.Redis;

  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly config!: Config;

  async load() {
    this.logger.info('Connecting to Redis...');

    const sentinels = this.config.getProperty('redis.sentinels');
    const password = this.config.getProperty('redis.password');
    const masterName = this.config.getProperty('redis.master');
    const index = this.config.getProperty('redis.index') ?? 4;
    const host = this.config.getProperty('redis.host');
    const port = this.config.getProperty('redis.port');

    const config =
      (sentinels ?? []).length > 0
        ? {
            enableReadyCheck: true,
            connectionName: 'Arisu',
            lazyConnect: true,
            sentinels,
            password: password,
            name: masterName,
            db: index,
          }
        : {
            enableReadyCheck: true,
            connectionName: 'Arisu',
            lazyConnect: true,
            password: password,
            host: host,
            port: port,
            db: index,
          };

    this.client = new IORedis(config);

    await this.client.client('SETNAME', 'Arisu');
    this.client.on('ready', () => this.logger.info('Connected to Redis!'));
    this.client.on('error', this.logger.error);

    return Promise.resolve();
  }

  dispose() {
    return this.client.disconnect();
  }

  async getStatistics() {
    const stopwatch = new Stopwatch();
    stopwatch.start();
    await this.client.ping('Ice is cute as FUCK');

    const ping = stopwatch.end();

    // stole this from donny
    // Credit: https://github.com/FurryBotCo/FurryBot/blob/master/src/commands/information/stats-cmd.ts#L22
    const [stats, server] = await Promise.all([
      this.client.info('stats').then(
        (info) =>
          info
            .split(/\n\r?/)
            .slice(1, -1)
            .map((item) => ({
              [item.split(':')[0]]: item.split(':')[1].trim(),
            }))
            .reduce((a, b) => ({ ...a, ...b })) as unknown as RedisInfo
      ),

      this.client.info('server').then(
        (info) =>
          info
            .split(/\n\r?/)
            .slice(1, -1)
            .map((item) => ({
              [item.split(':')[0]]: item.split(':')[1].trim(),
            }))
            .reduce((a, b) => ({ ...a, ...b })) as unknown as RedisServerInfo
      ),
    ]);

    return {
      server,
      stats,
      ping,
    };
  }
}
