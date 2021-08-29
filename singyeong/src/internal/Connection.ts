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

import type { ClientOptions } from '../Client';
import { randomBytes } from 'crypto';
import { EventBus } from '@augu/utils';
import WebSocket from 'ws';
import Dsn from '../Dsn';

import { HelloPayload, OPCode, Payload } from './payloads';

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

/**
 * Represents the connection options for a {@link Connection}.
 */
export interface ConnectionOptions {
  /**
   * If the connection should re-connect **if** the close
   * code isn't letal.
   */
  reconnect?: boolean;

  /**
   * The namespace to use, this'll default to `'arisu'` if none is provided.
   */
  namespace?: string;

  /**
   * Returns the client ID of this {@link Connection}. If none is provided,
   * it'll do `<namespace>:<random string>`.
   */
  clientId?: string;
}

export interface ConnectionEvents {
  close(code: number, reason: string): void;
  debug(message: string): void;
  error(error: Error): void;
  ready(): void;
}

export default class Connection extends EventBus<ConnectionEvents> {
  private _resolveConnection?: {
    resolve(connection: Connection | PromiseLike<Connection>): void;
    reject(error?: Error): void;
  };

  private _heartbeatTimer?: NodeJS.Timer;
  private acked: boolean = true;
  private pings: number[] = [];
  private socket!: WebSocket;

  /**
   * Returns the client options
   */
  clientOptions: ClientOptions;

  /**
   * Returns the options for this {@link Connection}.
   */
  options: ConnectionOptions;

  /**
   * Returns the current state of this {@link Connection}.
   */
  state: ConnectionState = ConnectionState.Unknown;

  /**
   * Returns the DSN when connecting to this {@link Connection}.
   */
  readonly dsn: Dsn;

  constructor(dsn: Dsn, clientOptions: ClientOptions, options: ConnectionOptions) {
    super();

    this.clientOptions = clientOptions;
    this.options = {
      namespace: 'arisu',
      clientId: `arisu:${randomBytes(4).toString('hex')}`,
      ...options,
    };

    this.dsn = dsn;
  }

  /**
   * Returns the latency of the websocket connection.
   */
  get latency() {
    if (this.state !== ConnectionState.Connected) return -1;

    return this.pings.reduce((acc, curr) => acc + curr) / this.pings.length;
  }

  async connect() {
    return new Promise<Connection>((resolve, reject) => {
      this.emit('debug', `Starting the connection with singyeong with DSN ${this.dsn.toUrl()}!`);

      // keep the promise details
      this._resolveConnection = { resolve, reject };

      const asDsnUrl = this.dsn.toUrl();
      const dsn = `${asDsnUrl.protocol === 'ssingyeong://' ? 'wss://' : 'ws://'}${asDsnUrl.hostname}:${
        asDsnUrl.port || '80'
      }/gateway/websocket?encoding=json`;

      this.emit('debug', `Using DSN ${dsn} to connect...`);
      this.socket = new WebSocket(dsn, this.clientOptions.ws);
      this.socket
        .on('open', this._onOpen.bind(this))
        .on('close', this._onClose.bind(this))
        .on('error', this._onError.bind(this))
        .on('message', this._onMessage.bind(this));
    });
  }

  private _onOpen() {
    this.emit('debug', 'Established a connection!');
    this._resolveConnection?.resolve(this);
  }

  private _onClose(code: number, reason: string) {
    // todo: this
  }

  private _onError(error: Error) {
    this.emit('error', error);
  }

  private _onMessage(message: WebSocket.Data) {
    if (Buffer.isBuffer(message)) message = message.toString('utf-8');

    if (typeof message !== 'string') {
      this.emit('debug', "Skipping ws message, wasn't a string.");
      return;
    }

    let msg!: Payload<any>;
    try {
      msg = JSON.parse(message);
    } catch (ex) {
      this.emit('error', ex as Error);
    }

    this.pings.push(Date.now() - msg.ts);
    switch (msg.op) {
      case OPCode.Hello:
        {
          const packet = msg as HelloPayload;
          this.emit('debug', 'Received HELLO from server. Starting heartbeat + identifying...');

          this._heartbeatTimer = setInterval(() => this.ackHeartbeat(), packet.d!.heartbeat_interval);
          this.identify();
        }
        break;

      case OPCode.Ready:
        {
          this.emit('debug', 'Ready!');
          this.emit('ready');
        }
        break;

      case OPCode.HeartbeatAck:
        {
          this.acked = true;
          this.emit('debug', `Acked a heartbeat from singyeong! Ping is ~${this.latency}ms`);
        }
        break;
    }
  }

  private ackHeartbeat() {
    if (!this.acked) {
      this.emit('debug', "Didn't receive heartbeat back, possible server lost connection...");
      return this.socket.close();
    }

    this.acked = false;
    this.socket.send(
      JSON.stringify({
        op: OPCode.Heartbeat,
      })
    );
  }

  private identify() {
    this.socket.send(
      JSON.stringify({
        op: OPCode.Identify,
        d: {
          client_id: this.options.clientId!,
          application_id: this.dsn.toUrl().username,
          receive_client_updates: true,
          namespace: this.options.namespace,
        },
      })
    );
  }
}
