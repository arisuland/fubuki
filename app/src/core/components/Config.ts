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

import { writeFile, readFile } from 'fs/promises';
import { Component, Inject } from '@augu/lilith';
import { existsSync } from 'fs';
import { Logger } from 'tslog';
import { join } from 'path';
import * as z from 'zod';
import yaml from 'js-yaml';

import type { FilesystemStorageConfig } from '~/storage/FilesystemProvider';
import type { GoogleCloudStorageConfig } from '~/storage/GoogleCloudProvider';
import { S3StorageConfig, S3Provider } from '~/storage/S3StorageProvider';

const NOT_FOUND_SYMBOL = Symbol.for('$arisu::config::not.found');

interface Configuration {
  runPendingMigrations?: boolean;
  prometheusPort?: number;
  sentryDsn?: string;
  storage: StorageConfig;
  kafka?: KafkaConfig;
  redis: RedisConfig;
  host?: string;
}

interface RedisConfig {
  sentinels?: RedisSentinelConfig[];
  password?: string;
  master?: string;
  index?: number;
  host: string;
  port: number;
}

// eslint-disable-next-line
interface RedisSentinelConfig extends Pick<RedisConfig, 'host' | 'port'> {}

interface StorageConfig {
  filesystem?: FilesystemStorageConfig;
  gcs?: GoogleCloudStorageConfig;
  s3?: S3StorageConfig;
  fs?: FilesystemStorageConfig; // add fs as an alias
}

interface KafkaConfig {
  autoCreateTopics?: boolean;
  brokers: {
    host: string;
    port?: number;
  }[];

  groupId?: any;
  topic?: string;
}

const redisShape = z.object({
  sentinels: z
    .array(
      z.object({
        host: z.string(),
        port: z.string(),
      })
    )
    .optional(),

  password: z.string().optional(),
  master: z.string().optional(),
  index: z.number().min(1).max(16).optional(),
  host: z.string().default('localhost'),
  port: z.number().default(6379),
});

const zodSchema = z
  .object({
    runPendingMigrations: z.boolean().optional(),
    prometheusPort: z.number().min(1024).max(65535).optional(),
    sentryDsn: z.string().optional(),
    storage: z.object({
      filesystem: z
        .object({
          directory: z.string(),
        })
        .optional(),

      fs: z
        .object({
          directory: z.string(),
        })
        .optional(),

      s3: z
        .object({
          bucket: z.string().optional().default('arisu'),
          provider: z.enum(['wasabi', 'amazon']).optional().default(S3Provider.Amazon),
          accessKey: z.string().optional(),
          secretKey: z.string().optional(),
          region: z.string().optional().default('us-east1'),
        })
        .optional(),

      gcs: z
        .object({
          bucket: z.string().optional().default('arisu'),
          location: z.string().optional().default('US-EAST1'),
          storageClass: z.string().optional().default('COLDLINE'),
        })
        .optional(),
    }),

    redis: redisShape,
    kafka: z
      .object({
        autoCreateTopics: z.boolean().default(true).optional(),
        groupId: z.any().optional(), // TODO: what to do with this? owo
        topic: z.string().optional().default('arisu:tsubaki'),
        brokers: z.array(
          z.object({
            host: z.string(),
            port: z.number().optional().default(9092),
          })
        ),
      })
      .optional(),
  })
  .strict();

@Component({
  priority: 0,
  name: 'config',
})
export default class Config {
  @Inject
  private readonly logger!: Logger;
  #config!: Configuration;

  async load() {
    const configPath = join(process.cwd(), '..', 'config.yml');

    if (!existsSync(configPath)) {
      const config = yaml.dump(
        {
          runPendingMigrations: true,
          redis: {
            host: 'localhost',
            port: 6379,
          },
          storage: {
            fs: {
              directory: './.arisu',
            },
          },
          pubsub: {
            type: 'redis',
            redis: {
              host: 'localhost',
              port: 6379,
            },
          },
        },
        {
          indent: 2,
          noArrayIndent: false,
        }
      );

      await writeFile(configPath, config);
      return Promise.reject(
        new SyntaxError(
          "Weird, you didn't have a configuration file... So, I may have provided you a default one, if you don't mind... >W<"
        )
      );
    }

    this.logger.info('Loading configuration...');
    const contents = await readFile(configPath, 'utf8');
    const config = yaml.load(contents) as unknown as Configuration;

    try {
      zodSchema.parse(config);
    } catch (ex) {
      if (ex instanceof z.ZodError) {
        this.logger.error('An error occured while validating your config:', ex.format());
        return Promise.reject();
      }
    }

    this.#config = config;
  }

  getProperty<K extends ObjectKeysWithSeperator<Configuration>>(key: K): KeyToPropType<Configuration, K> | undefined {
    const nodes = key.split('.');
    let value: any = this.#config;

    for (const frag of nodes) {
      try {
        value = value[frag];
      } catch {
        value = NOT_FOUND_SYMBOL;
      }
    }

    return value === NOT_FOUND_SYMBOL ? undefined : value;
  }
}
