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

import type { ClientOptions as WebSocketClientOptions } from 'ws';
import Connection, { ConnectionOptions, ConnectionEvents } from './internal/Connection';
import { EventBus } from '@augu/utils';
import Dsn from './Dsn';

/**
 * Represents the {@link Client client} options.
 */
export interface ClientOptions {
  /**
   * Returns the DSN url to use.
   */
  dsn: string;

  /**
   * Returns the {@link WebSocketClientOptions ws client options} to extend the client.
   * If you wish to do so, you must edit [singyeong.websocket.options](https://docs.arisu.land/self-hosting/configuration#singyeong).
   *
   * Only parameters that won't be used is:
   * - {@link WebSocketClientOptions.protocol} - The DSN should provide the protocol itself.
   * - {@link WebSocketClientOptions.perMessageDeflate} - You are allowed to provide a boolean, but using
   * the deflate options will probably not work.
   *
   * - {@link WebSocketClientOptions.agent} - Classes won't be parsed in `js-yaml`.
   * - {@link WebSocketClientOptions.checkServerIdentity} - Functions won't be parsed in `js-yaml`.
   */
  ws?: WebSocketClientOptions;

  /**
   * Returns the connection options for this {@link Client}.
   */
  connection?: ConnectionOptions;
}

/**
 * Represents a **신경** client, this is where the connections
 * are managed withing a 신경 server.
 */
export default class Client extends EventBus<ConnectionEvents> {
  /**
   * Represents the current **신경** websocket connection.
   */
  connection: Connection | null;

  /**
   * Represents the options.
   */
  options: ClientOptions;

  constructor(options: ClientOptions) {
    super();

    this.connection = null;
    this.options = options;

    for (const keys of ['protocol', 'agent', 'checkServerIdentify']) delete this.options.ws?.[keys];
    if (this.options.ws?.perMessageDeflate !== undefined && typeof this.options.ws.perMessageDeflate !== 'boolean')
      delete this.options.ws!.perMessageDeflate;
  }

  /**
   * Connects to a **신경** server from it's DSN.
   * @returns This {@link Client}.
   */
  async connect() {
    let dsn!: Dsn;
    try {
      dsn = Dsn.parse(this.options.dsn);
    } catch (ex) {
      if (ex instanceof Error) {
        throw ex;
      }
    }

    this.connection = new Connection(dsn, this.options, this.options.connection ?? {});
    this.connection
      .on('close', (code, reason) => this.emit('close', code, reason))
      .on('error', (error) => this.emit('error', error))
      .on('ready', () => this.emit('ready'))
      .on('debug', (message) => this.emit('debug', message));

    await this.connection.connect();
    return this;
  }

  /**
   * Disconnects this **신경** client.
   */
  destroy() {
    // return this.connection.destroy();
  }
}
