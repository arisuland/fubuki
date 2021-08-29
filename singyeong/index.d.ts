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

import WebSocket from 'ws';

/** */
declare namespace singyeong {
  /**
   * Returns the current build of `@arisuland/singyeong`.
   */
  export const version: string;

  /**
   * Represents a **신경** client, this is where the connections
   * are managed withing a 신경 server.
   */
  export class Client {}

  /**
   * Represents a 신경 DSN to connect to a 신경 server.
   */
  export class Dsn {}

  enum ConnectionState {
    /**
     * When the {@link Connection connection} is first initialized using `new Connection`,
     * this will be the default state.
     */
    Unknown = 'unknown',

    /**
     * The connection is currently being established with 신경
     */
    Connecting = 'connecting',

    /**
     * We have established with 신경! We can send WS messages
     * if we need to.
     */
    Connected = 'connected',

    /**
     * Dang, we lost connection with 신경. Maybe we can reconnect, if it's not
     * letal.
     */
    Disconnected = 'disconnected',

    /**
     * The connection with 신경 was outright dead. This happens
     * when {@link Connection.destroy the destroy function} is called.
     */
    Dead = 'dead',
  }

  /**
   * Represents the current **신경** connection between a {@link Client}.
   */
  class Connection {
    private socket: WebSocket;
  }
}

export = singyeong;
export as namespace singyeong;
