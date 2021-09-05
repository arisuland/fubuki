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

import { StorageProvider, S3StorageProvider, FilesystemProvider, GoogleCloudProvider } from '~/storage';
import { Service, Inject, ServiceAPI } from '@augu/lilith';
import { Logger } from 'tslog';
import isDocker from 'is-docker';
import Config from '~/components/Config';

@Service({
  priority: 0,
  name: 'storage:provider',
})
export default class StorageProviderService {
  private provider!: StorageProvider<any>;

  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly config!: Config;
  api!: ServiceAPI;

  async load() {
    this.logger.info('Detecting storage provider...');

    const fs = this.config.getProperty('storage.filesystem') ?? this.config.getProperty('storage.fs');
    const s3 = this.config.getProperty('storage.s3');
    const gcs = this.config.getProperty('storage.gcs');

    if (fs !== undefined) {
      this.logger.info(`Found configuration for filesystem storage with directory ${fs.directory}`);

      const directory = fs.directory.replace('./', process.cwd()).replace('~/', process.cwd());
      if (isDocker()) this.logger.warn('Remember to have a volume set in place since your data might be destroyed.');

      this.provider = new FilesystemProvider({ directory });
    }

    if (s3 !== undefined) {
      this.logger.info('Found configuration for Amazon S3!');
      this.provider = new S3StorageProvider(s3);
    }

    if (gcs !== undefined) {
      this.logger.info('Found configuration for Google Cloud Storage!');
      this.logger.warn("GCS has not been tested, so don't use it in production until it is stablized.");
      this.provider = new GoogleCloudProvider(gcs);
    }

    if (this.provider === undefined) {
      this.logger.fatal('Unable to initialize provider: no provider was set.');
      return Promise.reject();
    }

    this.api.container.addInjections(this.provider);
    await this.provider.init?.();
  }

  dispose() {
    return this.provider.dispose?.();
  }

  async handle(...args: Parameters<StorageProvider<any>['handle']>) {
    return await this.provider.handle(...args);
  }
}
