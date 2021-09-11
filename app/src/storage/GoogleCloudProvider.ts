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

import type { StorageProvider, IStorageConfig } from '.';
import { Storage } from '@google-cloud/storage';
import { Inject } from '@augu/lilith';
import { Logger } from 'tslog';
import defu from 'defu';

/**
 * Represents the configuration details for using Google Cloud
 * for holding project details.
 */
export interface GoogleCloudStorageConfig extends IStorageConfig {
  /**
   * The bucket to use when holding project details. If the bucket
   * doesn't exist or doesn't have a name, it'll use `arisu` as the
   * default bucket name.
   */
  bucket?: string;

  /**
   * Returns the location when creating the bucket, you can see
   * the values here: https://cloud.google.com/storage/docs/locations
   *
   * It'll use `US-EAST1` as the default location.
   */
  location?: string;

  /**
   * Returns the storage class when creating the bucket, you can
   * see the values here:
   *
   * It'll use `COLDLINE` as the default storage class.
   */
  storageClass?: string;
}

export default class GoogleCloudProvider implements StorageProvider<IStorageConfig> {
  @Inject
  private readonly logger!: Logger;
  private storage!: Storage;

  public config: GoogleCloudStorageConfig;

  constructor(config: GoogleCloudStorageConfig) {
    this.config = defu(config, {
      bucket: 'arisu',
      location: 'US-EAST1',
      storageClass: 'COLDLINE',
    });
  }

  async init() {
    this.logger.info('Loading Google Cloud Storage provider...');
    this.logger.warn(
      'GCS is in alpha mode, things will break. Report bugs at here: https://github.com/auguwu/Arisu/issues',
      { provider: 'gcs' }
    );

    this.storage = new Storage();
    const [buckets] = await this.storage.getBuckets();

    this.logger.info(`Found the following buckets: ${buckets.map((s) => s.name).join(', ')}`);
    if (!buckets.find((s) => s.name === this.config.bucket ?? 'arisu')) {
      this.logger.warn(`Bucket ${this.config.bucket ?? 'arisu'} doesn't exist, creating...`);
      await this.storage.createBucket(this.config.bucket ?? 'arisu', {
        location: this.config.location ?? 'US-EAST1',
        [this.config.storageClass?.toLowerCase() ?? 'coldline']: true,
      });

      this.logger.info('Created bucket!');
    }
  }

  async handle(files: any[]) {
    this.logger.info(`Told to handle ${files.length} files to upload.`);

    // TODO: this :3
  }

  addProject() {
    // no-op operation
    return Promise.resolve();
  }
}
