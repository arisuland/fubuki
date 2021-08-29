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

import { URL } from 'url';

/**
 * Returns the encoding for a {@link Dsn DSN}. Use {@link Dsn.encoding} to return
 * the encoding.
 */
export enum DsnEncoding {
  Json = 'json',
  Etf = 'etf',
  MessagePack = 'msgpack',
}

/**
 * Represents a 신경 DSN to connect to a 신경 server.
 */
export default class Dsn {
  private static readonly DSN_REGEX: RegExp =
    /s?singyeong:\/\/.+(:.+)?@[\w-]+(:\d{1,5})?\/?(\?encoding=(json|etf|msgpack))?/;

  /**
   * Returns the {@link DsnEncoding encoding} to (de)serialize packets.
   */
  public encoding: DsnEncoding;

  /**
   * Returns if the DSN is SSL.
   */
  public isSsl: boolean;

  /**
   * Parses a string to return a {@link Dsn}.
   * @param url The URL to check for.
   */
  public static parse(url: string): Dsn {
    if (!this.DSN_REGEX.test(url)) throw new Error(`DSN didn't follow regex: ${this.DSN_REGEX}`);

    return new Dsn(new URL(url));
  }

  private constructor(private raw: URL) {
    if (!['singyeong:', 'ssingyeong:'].includes(raw.protocol)) throw new Error(`Invalid protocol: ${raw.protocol}.`);
    if (!raw.username)
      throw new Error("Username was not present in DSN. Please use it since it'll be your application ID.");

    this.encoding = (raw.searchParams.get('encoding') as DsnEncoding) ?? DsnEncoding.Json;
    this.isSsl = raw.protocol === 'ssingyeong:';
  }

  toUrl() {
    return this.raw;
  }
}
