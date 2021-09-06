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

import { Inject, Service } from '@augu/lilith';
import { Collection } from '@augu/collections';
import type { Users } from '.prisma/client';
import { Security } from '~/util';
import { isObject } from '@augu/utils';
import { Logger } from 'tslog';
import Redis from '~/components/Redis';

export interface Session {
  expiresAt: number;
  device?: 'desktop' | 'mobile' | 'web'; // mobile soon??? :eyes:
  token: string;
  user: Users;
}

function isSession(value: any): value is Session {
  return (
    isObject<Session>(value) &&
    typeof value.expiresAt !== undefined &&
    typeof value.token !== undefined &&
    typeof value.user !== undefined
  );
}

@Service({
  priority: 1,
  name: 'sesssion:tokens',
})
export default class SessionTokenService {
  private readonly sessions: Collection<string, NodeJS.Timeout> = new Collection();

  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly redis!: Redis;

  async getSession(userId: string): Promise<Session | undefined> {
    const session = await this.redis.client.hget('arisu:sessions', userId);
    if (session !== null) {
      const data: Session = JSON.parse(session);

      if (Date.now() > data.expiresAt) await this.redis.client.hdel('arisu:sessions', userId);
      return data;
    }
  }

  async createSession(user: Users, device: 'desktop' | 'mobile' | 'web' = 'web') {
    const session = await this.getSession(user.id);
    if (session !== undefined) return session;

    const expiresAt = Date.now() + 604800000;
    const sessionToken = Security.generate(user.id, 'session', expiresAt);
    const data: Session = {
      expiresAt,
      device,
      token: sessionToken.token,
      user,
    };

    await this.redis.client.hset('arisu:sessions', [user.id, JSON.stringify(data)]);
    this.createExpirationTimeout(data, expiresAt);

    return data;
  }

  async cancelSession(token: string) {
    const sessions = await this.redis.client.hgetall('arisu:sessions');
    let found: Session | null = null;
    let k: string | null = null;

    for (const key in sessions) {
      const session = sessions[key];
      const data = JSON.parse(session) as Session;

      if (data.token === token) {
        found = data;
        k = key;

        break;
      }
    }

    if (found !== null) {
      await this.redis.client.hdel('arisu:sessions', k!);

      if (this.sessions.has(k!)) {
        const ses = this.sessions.get(k!)!;
        clearTimeout(ses);
      }
    }
  }

  hasSession(id: string) {
    return this.redis.client.hexists('arisu:sessions', id);
  }

  async load() {
    this.logger.info('Clearing expired sessions...');

    const sessions = await this.redis.client.hgetall('arisu:sessions');
    for (const key in sessions) {
      const data = JSON.parse(sessions[key]) as Session;
      if (!isSession(data)) {
        this.logger.warn(`Session for user ${key} was not a valid session. ew`);
        await this.redis.client.hdel('arisu:sessions', key);
      }

      if (Date.now() < data.expiresAt) {
        this.logger.info(`Purging user session ${key} - expired`);
        await this.redis.client.hdel('arisu:sessions', key);

        // TODO: add a notification (which the frontend can subscribe to using the GQL subscriptions api?)
      }

      this.createExpirationTimeout(data);
    }
  }

  private createExpirationTimeout(session: Session, expiresAt?: number) {
    this.logger.info(`Creating session expiration timeout for ${session.user.id}`);

    const time = expiresAt ? expiresAt : session.expiresAt - Date.now() + 604800000;
    const timeout = setTimeout(async () => {
      const exists = await this.redis.client.hexists('arisu:sessions', session.user.id);
      if (exists) {
        const sessionInStore = this.sessions.has(session.user.id);
        this.logger.info(
          `Session has expired for ${session.user.id}${sessionInStore ? ', session is in timeouts collection' : '.'}`
        );

        await this.redis.client.hdel('arisu:sessions', session.user.id);
        if (sessionInStore) {
          const timeout = this.sessions.get(session.user.id)!;
          clearTimeout(timeout);
        }
      }
    }, time);

    if (this.sessions.has(session.user.id)) {
      this.logger.info(`Session was already created by ${session.user.id}, clearing and replacing...`);

      const timeout = this.sessions.get(session.user.id)!;
      clearTimeout(timeout);
    }

    this.logger.info(`Session created for ${session.user.id}!`);
    timeout.unref();
    this.sessions.set(session.user.id, timeout);
  }
}
