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

import type { StorageProvider, IStorageConfig, File, FileMetadataLock } from '.';
import { lstat, mkdir, readFile, rm, writeFile } from 'fs/promises';
import { dirname, join, sep } from 'path';
import { existsSync } from 'fs';
import { withIndex } from '~/util';
import { Inject } from '@augu/lilith';
import { Logger } from 'tslog';
import mimeTypes from 'mime-types';
import defu from 'defu';

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

  constructor(config: FilesystemStorageConfig) {
    this.config = defu(config, {
      directory: join(process.cwd(), '..', '.arisu'),
    });
  }

  static get FORMAT_VERSION() {
    return 1;
  }

  async init() {
    this.logger.info('Initializing filesystem provider...');
    if (!existsSync(this.config.directory)) await mkdir(this.config.directory, { recursive: true });

    const stats = await lstat(this.config.directory);
    if (!stats.isDirectory()) {
      this.logger.error(
        `Path "${this.config.directory}" is not a directory! Please make it a directory before continuing.`
      );

      return;
    }

    const LOCKFILE = join(this.config.directory, 'arisu.lock');
    if (!existsSync(LOCKFILE))
      await writeFile(LOCKFILE, '-- This file is not meant to be edited. This is just for validation. --');

    const lockfile = await readFile(LOCKFILE, 'utf-8');
    if (lockfile !== '-- This file is not meant to be edited. This is just for validation. --') {
      this.logger.warn(`Lockfile in path ${lockfile} is corrupted.`);
      await rm(LOCKFILE, { force: true });
      await writeFile(LOCKFILE, '-- This file is not meant to be edited. This is just for validation. --');

      this.logger.warn('Lockfile is no longer corrupted. :3');
    }
  }

  async handle(files: File[]) {
    this.logger.info(`Told to handle ${files.length} files to upload.`);

    for (const [index, file] of withIndex(files)) {
      this.logger.debug(`Taking care of file ${file.name} for ${file.project[0]}/${file.project[1]}...`);

      const projectDir = join(this.config.directory, file.project[0], file.project[1]);
      if (!existsSync(projectDir)) {
        this.logger.info('New project I see? Creating directory...');
        await mkdir(projectDir, { recursive: true });
      }

      const metadataLockfile = join(this.config.directory, file.project[0], file.project[1], 'metadata.lock');
      if (!existsSync(metadataLockfile)) {
        this.logger.info("Metadata lock doesn't exist");
        const m: FileMetadataLock = {
          format_version: 1,
          project: `${file.project[0]}/${file.project[1]}`,
          directory: dirname(metadataLockfile),
          files: [],
        };

        await writeFile(metadataLockfile, JSON.stringify(m));
        this.logger.info('Metadata lockfile was created.');
      }

      const metadataJson = await readFile(metadataLockfile, 'utf-8');
      const metadata = JSON.parse(metadataJson) as FileMetadataLock;
      if (metadata.format_version > FilesystemStorageProvider.FORMAT_VERSION) {
        this.logger.info(
          `Metadata format version was greater than the current format version (v${FilesystemStorageProvider.FORMAT_VERSION}), editing lockfile...`
        );

        metadata.format_version = FilesystemStorageProvider.FORMAT_VERSION as 1;
        await writeFile(metadataLockfile, JSON.stringify(metadata));

        this.logger.info('Edited format version.');
      }

      this.logger.info(`Using format version ${FilesystemStorageProvider.FORMAT_VERSION}!`);
      let extension = mimeTypes.extension(file.metadata.contentType);
      if (!extension) {
        extension = '';
        file.metadata.contentType = 'text/html';
      }

      this.logger.info(`File ${file.name} has extension ${extension} for content type ${file.metadata.contentType}`);
      const filePath = file.name.split(sep);
      if (extension !== '') {
        const fileName = filePath.pop()!.split('.').shift()!;
        filePath[filePath.length - 1] = `${fileName}.${extension}`;
      }

      await writeFile(join(this.config.directory, file.project[0], file.project[1], filePath.join(sep)), file.contents);
      const hasFile = metadata.files.find((i) => i.path === file.name);
      if (hasFile) {
        const index = metadata.files.findIndex((i) => i.path === file.name);
        if (index !== -1) {
          metadata.files[index] = {
            path: file.name,
            size: file.metadata.size,
            contentType: file.metadata.contentType,
          };
        }
      }

      if (index + 1 === files.length) {
        await writeFile(metadataLockfile, JSON.stringify(metadata));
        this.logger.info('Took care of all files (and re-wrote metadata.lock)');
      }
    }
  }

  async getMetadata(userProject: string) {
    const [user, project] = userProject.split('/');
    const metadataLockfile = join(this.config.directory, user, project, 'metadata.lock');

    const metadataJson = await readFile(metadataLockfile, 'utf-8');
    return JSON.parse(metadataJson);
  }
}
