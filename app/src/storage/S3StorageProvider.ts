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

import { S3Client, ListBucketsCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import type { StorageProvider, IStorageConfig } from '.';
import type { Credentials } from '@aws-sdk/types';
import { Inject } from '@augu/lilith';
import { Logger } from 'winston';

/**
 * Represents the provider for the {@link S3StorageProvider}.
 */
export enum S3Provider {
  /**
   * Uses [Wasabi](https://wasabi.com) instead of Amazon S3, which Arisu
   * uses in production.
   */
  Wasabi = 'wasabi',

  /**
   * Uses the default Amazon S3 servers instead.
   */
  Amazon = 'amazon',
  // TODO: support Linode(?)
}

/**
 * Represents the configuration for the {@link S3StorageProvider}.
 */
export interface S3StorageConfig extends IStorageConfig {
  /**
   * Returns the bucket name to use when storing files. If the bucket doesn't
   * exist, it'll create it on it's own. If the bucket name isn't provided,
   * it'll use `arisu` as the name.
   */
  bucket?: string;

  /**
   * Returns the provider to use when connecting to S3.
   *
   * The available servers for S3 is:
   *
   * - {@link S3Provider.Wasabi Wasabi}
   * - {@link S3Provider.Amazon Amazon}
   */
  provider?: S3Provider;

  /**
   * Returns the access key for authenticating. If this isn't provided,
   * it'll auto-use your credentials stored in `~/.aws`. This is recommended
   * if you're using Docker and don't feel like using a volume to store your
   * credentials, which is a security hazard on it's own.
   */
  accessKey?: string;

  /**
   * Returns the secret key for authenticating. If this isn't provided,
   * it'll auto-use your credentials stored in `~/.aws`. This is recommended
   * if you're using Docker and don't feel like using a volume to store your
   * credentials, which is a security hazard on it's own.
   */
  secretKey?: string;

  /**
   * Returns the region of the bucket in which it's located. If this isn't provided,
   * it'll use `us-east1` as the default region.
   */
  region?: string;
}

export default class S3StorageProvider implements StorageProvider<S3StorageConfig> {
  @Inject
  private readonly logger!: Logger;

  public config: S3StorageConfig;
  private s3!: S3Client;

  constructor() {
    this.config = {
      bucket: 'arisu',
      provider: S3Provider.Amazon,
      region: 'us-east1',
    };
  }

  async init() {
    this.logger.info('Initializing S3 client...', { provider: 's3' });

    const endpoint = this.config.provider === S3Provider.Wasabi ? 'https://s3.wasabisys.com' : undefined;
    this.s3 = new S3Client({
      endpoint,
      region: this.config.region ?? 'us-east1',

      // s3 i fucking hate you
      credentialDefaultProvider:
        this.config.accessKey !== undefined && this.config.secretKey !== undefined
          ? () => () =>
              new Promise<Credentials>((resolve) =>
                resolve({
                  accessKeyId: this.config.accessKey!,
                  secretAccessKey: this.config.secretKey!,
                })
              )
          : undefined,
    });

    this.logger.info('Initialized S3 client!', { provider: 's3' });
    const result = await this.s3.send(new ListBucketsCommand({}));

    if (!result.Buckets) {
      this.logger.error('Malformed response when receiving buckets.', { provider: 's3' });
      return;
    }

    this.logger.info(`Found buckets - ${result.Buckets.map((s) => s.Name!).join(', ')}`, { provider: 's3' });
    if (!result.Buckets.find((s) => s.Name! === this.config.bucket ?? 'arisu')) {
      this.logger.warn("Bucket for repositories doesn't exist, creating...", { provider: 's3' });
      await this.s3.send(
        new CreateBucketCommand({
          Bucket: this.config.bucket ?? 'arisu',
          ACL: 'public-read',
          CreateBucketConfiguration: {
            LocationConstraint: this.config.region ?? 'us-east1',
          },
        })
      );

      // imagine if i went "still creating" <3
      this.logger.info('Created S3 bucket!', { provider: 's3' });
    }
  }

  async handle(files: any[]) {
    this.logger.info(`Told to handle ${files.length} files to upload.`, { provider: 's3' });

    // TODO: this :3
  }
}
