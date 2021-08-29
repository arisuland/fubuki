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

/**
 * Represents the current {@link Connection connection} state.
 */
export enum ConnectionState {
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

export default class Connection {
  private socket!: WebSocket;
}
