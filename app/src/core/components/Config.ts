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

/**
 * Represents the configuration portion for running Tsubaki. Read more
 * [here](https://docs.arisu.land/self-hosting/config) for more information
 * on all possible values.
 */
interface Configuration {
  /**
   * If registrations should be enabled on the server. If not, no one
   * is allowed to register on this instance, unless explicity registered
   * by an administator on the admin dashboard.
   */
  registrations?: boolean;

  /**
   * Returns the DSN for Sentry, this will output logs to Sentry related to Tsubaki.
   */
  sentryDsn?: string;

  /**
   * Returns the sitename to embed when running your instance.
   */
  siteName?: string;

  /**
   * Returns the site icon to use when displayed on the website.
   */
  siteIcon?: string;

  /**
   * Returns the object for using an optional storage bucket
   * or the filesystem.
   */
  storage: StorageConfig;

  /**
   * Returns the configuration for creating a Kafka broker for Tsubaki. This is
   * primarily used for communication between the GitHub bot and Tsubaki.
   */
  kafka?: KafkaConfig;

  /**
   * Returns the configuration for using Redis for caching user sessions.
   */
  redis: RedisConfig;

  /**
   * Custom host to use when launching the HTTP server. This can be masked
   * using the `HOST` or `TSUBAKI_HOST` environment variable. The default is
   * `'0.0.0.0'`, so anyone on the network can visit it.
   */
  host?: string;

  /**
   * Returns the port to listen to the HTTP server. If the port is taken,
   * Tsubaki will try to find an available port round-robin style and use
   * that.
   */
  port?: number;

  /**
   * Returns the timezone to use for date objects. If this is not set,
   * it'll not do time conversion based on the timezone.
   */
  tz?: string;
}

interface RedisConfig {
  /**
   * Sets the sentinel servers to use when using **Redis Sentinel** instead
   * of **Redis Standalone**. The {@link RedisConfig.master master name} is required
   * to be set if this is defined.
   */
  sentinels?: RedisSentinelConfig[];

  /**
   * Sets the password for basic authentication.
   */
  password?: string;

  /**
   * Returns the master name for connecting to any redis sentinel servers.
   */
  master?: string;

  /**
   * Returns the database ID to use
   */
  index?: number;

  /**
   * Returns the host for connecting to Redis. This defaults to `'localhost'`
   * if nothing was put here.
   */
  host: string;

  /**
   * Returns the port to use when connecting to Redis.
   */
  port: number;
}

// eslint-disable-next-line
interface RedisSentinelConfig extends Pick<RedisConfig, 'host' | 'port'> {}

interface StorageConfig {
  /**
   * Uses the file-system for storing projects. If you do use this,
   * it is required to setup a proper volume if you're using Docker or using
   * a **VolumePersistentClaim** if using Kubernetes.
   *
   * Read more [here](https://docs.arisu.land/self-hosting/docker#volume-management) and
   * [here](https://docs.arisu.land/self-hosting/on-kubernetes#vpc) for more information.
   */
  filesystem?: FilesystemStorageConfig;

  /**
   * Uses Google Cloud Storage to store projects. This is still alpha
   * testing since Arisu uses **S3** in production.
   */
  gcs?: GoogleCloudStorageConfig;

  /**
   * Uses Amazon S3 to store projects. This is recommended to be using
   * in production environments, but you can choose whatever.
   */
  s3?: S3StorageConfig;

  /**
   * Alias for {@link StorageConfig.filesystem}.
   */
  fs?: FilesystemStorageConfig; // add fs as an alias
}

interface KafkaConfig {
  /**
   * If the producer should auto-create the {@link KafkaConfig.topic topic} for you.
   */
  autoCreateTopics?: boolean;

  /**
   * Returns a record of the brokers to connect to
   */
  brokers: {
    host: string;
    port?: number;
  }[];

  /**
   * Returns the topic to send messages towards.
   *
   * > {{warn}}
   * > **This must be the SAME as the one you set when using the GitHub bot microservice or it will not produce messages.**
   * > {{/warn}}
   */
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
    registrations: z.boolean().default(true).optional(),
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

  #path: string;
  #config!: Configuration;

  constructor() {
    // argv.config is default to TSUBAKI/build/config.yml if not set.
    this.#path = process.env.TSUBAKI_CONFIG_FILE ?? argv.config;
  }

  async load() {
    if (!existsSync(this.#path)) {
      const config = yaml.dump(
        {
          redis: {
            host: 'localhost',
            port: 6379,
          },
          storage: {
            fs: {
              directory: './.arisu',
            },
          },
        },
        {
          indent: 2,
          noArrayIndent: false,
        }
      );

      await writeFile(this.#path, config);
      return Promise.reject(
        new SyntaxError(
          "Weird, you didn't have a configuration file... So, I may have provided you a default one, if you don't mind... >W<"
        )
      );
    }

    this.logger.info('Loading configuration...');
    const contents = await readFile(this.#path, 'utf8');
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
