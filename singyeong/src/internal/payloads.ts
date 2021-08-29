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

/**
 * Returns a list of all the [op codes](https://github.com/queer/singyeong/blob/mistress/PROTOCOL.md#%EC%8B%A0%EA%B2%BD-websocket-opcodes) available.
 */
export enum OPCode {
  /**
   * Sent on initial connection to the server.
   * @mode recv
   */
  Hello,

  /**
   * Tell the server who you are
   * @mode send
   */
  Identify,

  /**
   * The server has accepted you, and will send you packets
   * @mode recv
   */
  Ready,

  /**
   * Sent to tell you that an application-level issue with your payload occurred.
   * @mode recv
   */
  Invalid,

  /**
   * The server is sending you an event, or you are sending the gateway an event.
   * @mode recv, send
   */
  Dispatch,

  /**
   * Send a heartbeat to the server.
   * @mode send
   */
  Heartbeat,

  /**
   * Server acknowledging the last heartbeat you sent.
   * @mode recv
   */
  HeartbeatAck,

  /**
   * Sent to tell you to reconnect. Used for eg. load balancing.
   * @mode recv
   */
  Goodbye,

  /**
   * Sent to tell you that an unrecoverable error occurred.
   * @mode recv
   */
  Error,
}

/**
 * Returns all the receivable OPCodes.
 */
export type ReceiveOPCodes =
  | OPCode.Hello
  | OPCode.Ready
  | OPCode.Invalid
  | OPCode.Dispatch
  | OPCode.HeartbeatAck
  | OPCode.Goodbye
  | OPCode.Error;

export interface DispatchEvent {
  UPDATE_METADATA: DispatchEvent.UpdateMetadataPacket;
  SEND: DispatchEvent.SendOrBroadcast;
  BROADCAST: DispatchEvent.SendOrBroadcast;
  CLIENT_CONNECTED: DispatchEvent.ClientLifecycle;
  CLIENT_DISCONNECTED: DispatchEvent.ClientLifecycle;
}

type MetadataQuery =
  | { type: 'string'; value: string }
  | { type: 'integer'; value: number }
  | { type: 'float'; value: number }
  | { type: 'version'; value: string }
  | { type: 'list'; value: any[] }
  | { type: 'boolean'; value: boolean }
  | { type: 'map'; value: Record<string, unknown> };

// eslint-disable-next-line
export namespace DispatchEvent {
  export type UpdateMetadataPacket = Record<string, MetadataQuery>; // TODO: make this type-safe?
  export interface SendOrBroadcast {
    target: string;
    nonce: string;
    payload: Record<string, unknown>;
  }

  export interface ClientLifecycle {
    app: string;
  }
}

export interface Payload<OP extends OPCode, D extends {} = {}> {
  op: OP;
  d?: D;
  ts: number;
  t:
    | {
        [X in keyof DispatchEvent]: DispatchEvent[X];
      }
    | null;
}

export type HelloPayload = Payload<
  OPCode.Hello,
  {
    heartbeat_interval: number;
  }
>;

export type IdentifyPacket = Payload<
  OPCode.Identify,
  {
    client_id: string;
    application_id: string;
    auth?: string;
    ip?: string;
    namespace?: string;
    metadata?: DispatchEvent.UpdateMetadataPacket;
    receive_client_updates?: boolean;
  }
>;

export type ReadyEvent = Payload<OPCode.Ready, { client_id: string }>;
