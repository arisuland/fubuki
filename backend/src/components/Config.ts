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

import { readFile, writeFile } from 'fs/promises';
import { Component, Inject } from '@augu/lilith';
import { randomBytes } from 'crypto';
import { existsSync } from 'fs';
import { Logger } from 'tslog';
import { join } from 'path';
import yaml from 'js-yaml';

const NOT_FOUND_SYMBOL = Symbol('$arisu::config::404');

/**
 * Represents the current `config.yml` file provided by the user.
 */
interface Configuration {
  runPendingMigrations?: boolean;
  registration?: boolean;
  storage?: StorageConfig;
  metrics?: boolean;
  secret: string;
  master: string;
  redis: RedisConfig;
  host?: string;
}

/**
 * Represents the configuration details for storage (S3, GCP, filesystem)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StorageConfig {}

/**
 * Represents the configuration for Redis
 */
export interface RedisConfig {
  sentinels?: RedisSentinelConfig[];
  password?: string;
  master?: string;
  index?: number;
  host: string;
  port: number;
}

interface RedisSentinelConfig {
  host: string;
  port: number;
}

@Component({
  priority: 0,
  name: 'config',
})
export default class Config {
  @Inject
  private readonly logger!: Logger;
  #config!: Configuration;

  async load() {
    this.logger.info('loading configuration...');

    const configPath = join(process.cwd(), '..', 'config.yml');
    if (!existsSync(configPath)) {
      const secret = randomBytes(32).toString('hex');
      const master = randomBytes(16).toString('hex');

      const config = yaml.dump(
        {
          runPendingMigrations: true,
          registration: true,
          secret,
          redis: {
            host: 'localhost',
            port: 6379,
          },
          storage: {
            directory: join(process.cwd(), '..', 'data', 'tsubaki'),
          },
          master,
        },
        { indent: 2, noArrayIndent: true }
      );

      await writeFile(configPath, config);
      return Promise.reject(
        new SyntaxError(`No configuration was in path ${configPath}! I created a default config for you~`)
      );
    }

    const contents = await readFile(configPath, 'utf-8');
    this.#config = yaml.load(contents) as unknown as Configuration;

    this.logger.info('loaded configuration! :3');
  }

  get<K extends ObjectKeysWithSeperator<Omit<Configuration, 'storage'>>>(
    key: K
  ): KeyToPropType<Configuration, K> | null {
    const nodes = key.split('.');
    let value: any = this.#config;

    for (const frag of nodes) {
      try {
        value = value[frag];
      } catch {
        value = NOT_FOUND_SYMBOL;
      }
    }

    return value === NOT_FOUND_SYMBOL ? null : value;
  }

  getStorageConfig<T extends StorageConfig>(): T {
    return this.#config.storage as T;
  }
}
