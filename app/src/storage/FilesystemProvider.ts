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

import { lstat, mkdir, readFile, rm, writeFile } from 'fs/promises';
import type { StorageProvider, IStorageConfig } from '.';
import { existsSync } from 'fs';
import { Inject } from '@augu/lilith';
import { Logger } from 'winston';
import { join } from 'path';

/**
 * Represents the configuration details for using the filesystem
 * for storaging project details. If the directory doesn't exist,
 * Arisu will attempt to create it and add a `arisu.lock` lockfile,
 * which holds specific metadata.
 */
export interface FilesystemStorageConfig extends IStorageConfig {
  /**
   * Returns the directory to store project details.
   */
  directory: string;
}

export default class FilesystemStorageProvider implements StorageProvider<FilesystemStorageConfig> {
  @Inject
  private readonly logger!: Logger;

  public config: FilesystemStorageConfig;

  constructor() {
    // provide a default config for now
    this.config = {
      directory: join(process.cwd(), '..', '.arisu'),
    };
  }

  async init() {
    this.logger.info('Initializing filesystem provider...', { provider: 'fs' });
    if (!existsSync(this.config.directory)) await mkdir(this.config.directory, { recursive: true });

    const stats = await lstat(this.config.directory);
    if (!stats.isDirectory()) {
      this.logger.error(
        `Path "${this.config.directory}" is not a directory! Please make it a directory before continuing.`,
        { provider: 'fs' }
      );

      return;
    }

    const LOCKFILE = join(this.config.directory, 'arisu.lock');
    if (!existsSync(LOCKFILE))
      await writeFile(LOCKFILE, '-- This file is not meant to be edited. This is just for validation. --');

    const lockfile = await readFile(LOCKFILE, 'utf-8');
    if (lockfile !== '-- This file is not meant to be edited. This is just for validation. --') {
      this.logger.warn(`Lockfile in path ${lockfile} is corrupted.`, { provider: 'fs' });
      await rm(LOCKFILE, { force: true });
      await writeFile(LOCKFILE, '-- This file is not meant to be edited. This is just for validation. --');

      this.logger.warn('Lockfile is no longer corrupted. :3', { provider: 'fs' });
    }
  }

  async handle(files: any[]) {
    this.logger.info(`Told to handle ${files.length} files to upload.`, { provider: 'fs' });

    // TODO: this :3
  }
}
