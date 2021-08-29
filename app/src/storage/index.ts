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

export { default as GoogleCloudProvider } from './GoogleCloudProvider';
export { default as S3StorageProvider } from './S3StorageProvider';
export { default as FilesystemProvider } from './FilesystemProvider';

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
  handle?(files: any[]): void | Promise<void>;

  /**
   * Disposes the storage provider when the application closes.
   */
  dispose?(): void | Promise<void>;
}

// eslint-disable-next-line
export interface IStorageConfig {}
