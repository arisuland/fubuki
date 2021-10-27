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

import { Security, Snowflake } from '.';
import type { Users } from '.prisma/client';
import { useContainer } from '@augu/lilith';
import { STATUS_CODES } from 'http';
import { HttpClient } from '@augu/orchid';

export interface TelemetryPacket {
  /**
   * Returns the format version when sending to the server.
   */
  format_version: 1;

  /**
   * Returns the project used, this can be omitted.
   */
  project?: string;

  /**
   * Returns the information of the given platform.
   */
  platform: TsubakiInfo;

  /**
   * Returns the sender of this {@link TelemetryPacket}.
   */
  sender: 'tsubaki';

  /**
   * Returns the user sending this telemetry packet
   */
  user: Users;

  /**
   * Returns the {@link Snowflake} that is used as the primary key.
   */
  id: string;

  /**
   * Returns the operating system information.
   */
  os: TelemetryOSInfo;
}

interface TelemetryOSInfo {
  platform: string;
  version: string;
  arch: string;
}

interface TsubakiInfo {
  http: {
    endpoint: string;
    method: string;
    time: number;
  };

  graphql?: {
    operation: 'query' | 'mutation';
    code: string;
  };

  runtime: {
    version: string;
    commit_hash: string;
  };

  errors?: Error[];
}

const container = useContainer();

/**
 * Represents the [telemetry-server](https://github.com/arisuland/telemetry-server) client.
 *
 * If the {@link TelemetryClient client} is enabled, it'll send requests to the telemetry server
 * with the Tsubaki defaults set.
 */
export default class TelemetryClient {
  /**
   * Returns a readonly instance of a {@link TelemetryClient} singleton.
   */
  static readonly INSTANCE: TelemetryClient = new TelemetryClient();

  // Returns the underlying [[HttpClient]] attached from the container.
  private readonly http: HttpClient = container.$ref(HttpClient);

  // `data.id` is automatically generated
  async send(session: string, data: Omit<TelemetryPacket, 'id'>) {
    // We cannot send it if there is no URL pointing to it.
    if (!process.env.TELEMETRY_SERVER_URL) return;

    const id = Snowflake.generate().toString();
    const token = Security.validate(session);

    // skip if `token` is null (i.e, no user is authenticated)
    if (token === null) return;

    return this.http
      .request({
        method: 'POST',
        url: `${process.env.TELEMETRY_SERVER_URL}/owo`,
        data: {
          ...data,
          id,
        },
        headers: {
          Authorization: `Session ${token}`,
        },
      })
      .then((res) => {
        const data = res.json<{ error?: string }>();
        if (data.error !== undefined)
          throw new Error(`Received ${res.statusCode} ${STATUS_CODES[res.statusCode]}: ${data.error}`);
      });
  }
}
