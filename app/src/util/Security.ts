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

import { isObject } from '@augu/utils';
import jwt from 'jsonwebtoken';

export interface Token {
  type: 'access' | 'session';
  user: string;
}

/**
 * Represents a class for handling access tokens
 * and sessions. Sessions are stored in Redis
 * and have a TTL of 2 days while access tokens
 * don't have a TLL and are stored in PostgreSQL.
 */
class Security {
  static validate(token: string) {
    try {
      const v = jwt.verify(token, process.env.JWT_SECRET!, {
        subject: 'Arisu',
        algorithms: ['HS256'],
      });

      const t = isObject(v) ? v : null;
      if (t === null) return null;

      return t as Token;
    } catch (ex) {
      return null;
    }
  }

  generate(userId: string, type: 'access' | 'session'): Token & { token: string } {
    const token = jwt.sign({ type, user: userId }, process.env.JWT_SECRET!, {
      subject: 'Arisu',
      algorithm: 'HS256',
    });

    return { type, token, user: userId };
  }
}

export default Security;
