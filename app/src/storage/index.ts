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

export { default as GoogleCloudProvider, GoogleCloudStorageConfig } from './GoogleCloudProvider';
export { default as S3StorageProvider, S3StorageConfig } from './S3StorageProvider';
export { default as FilesystemProvider, FilesystemStorageConfig } from './FilesystemProvider';

/**
 * Represents the storage provider.
 */
export interface StorageProvider<C extends IStorageConfig> {
  /**
   * Returns the configuration for this {@link StorageProvider}.
   */
  config: C;

  /**
   * Initializes this {@link StorageProvider}, this is called when `StorageService.load()`
   * is called.
   */
  init?(): void | Promise<void>;

  /**
   * Handles a list of files to upload.
   * @param files The files to upload.
   * @returns An (a)synchronous operation.
   */
  handle(files: File[]): void | Promise<void>;

  /**
   * Disposes the storage provider when the application closes.
   */
  dispose?(): void | Promise<void>;

  /**
   * Returns the file metadata lockfile from the storage provider.
   */
  getMetadata?(userProject: string): Promise<FileMetadataLock>;

  /**
   * Adds a project resource to this storage handler.
   */
  addProject(user: string, project: string): Promise<void>;
}

// eslint-disable-next-line
export interface IStorageConfig {}

/**
 * Represents a File to upload to a specific {@link StorageProvider}.
 */
export interface File {
  /**
   * The name of the file, you can split this by using `sep` from the
   * `path` library to create the directories (if using the {@link FilesystemProvider})
   */
  name: string;

  /**
   * The project owner / name by an Array.
   */
  project: [owner: string, name: string];

  /**
   * External metadata for {@link S3StorageProvider} or {@link GoogleCloudProvider}. Though,
   * if you're using the {@link FilesystemProvider}, it'll be saved as `owner/project/metadata.json`
   * that the `projectMetadata` query can pick up.
   */
  metadata: FileMetadata;

  /**
   * The file contents
   */
  contents: string;
}

/**
 * Represents the metadata for a {@link File}.
 */
export interface FileMetadata {
  /**
   * Returns the size in bytes of how big this file is.
   */
  size: number;

  /**
   * The content type of this file.
   */
  contentType: string;
}

/**
 * Represents the metadata lock for a specific project.
 */
export interface FileMetadataLock {
  /**
   * The format version it uses. This can differ, read [here](https://docs.arisu.land/selfhosting/storage#format-versions)
   * for more information.
   */
  format_version: 1;

  /**
   * Returns the project by `user/project`.
   */
  project: string;

  /**
   * Returns the directory if any.
   * @note This only applies in the filesystem provider. S3 and GCS will use
   * the {@link FileMetadataLock.storagePath __storagePath__} property.
   */
  directory?: string;

  /**
   * Returns the storage path, usually it is denoted as `bucket/user/project`.
   * @note This only applies in the S3 and GCS providers, the filesystem
   * provider will use the {@link FileMetadataLock.directory __directory__} property.
   */
  storagePath?: string;

  /**
   * Returns metadata between the files.
   */
  files: IFileMetadata[];
}

/**
 * Returns metadata about a specific file.
 */
export interface IFileMetadata {
  /**
   * The path to the file.
   */
  path: string;

  /**
   * The size of the file
   */
  size: number;

  /**
   * Returns the content type of this file, serving purpose
   * for the frontend to show colours of it.
   */
  contentType: string;
}
