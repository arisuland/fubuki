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

import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Represents a route path
 */
export type RoutePath<T extends string> = T extends `/${infer _}` ? T : T extends '/' ? '/' : never;

/**
 * Represents a route handler.
 */
export interface AbstractRoute<P extends string> {
  /**
   * Represents the path of this {@link AbstractRoute}. If the route
   * doesn't start **OR** is not equal to `/`, it'll error.
   */
  path: RoutePath<P>;

  /**
   * Returns the HTTP method to use for this {@link AbstractRoute}.
   */
  method: string;

  /**
   * Executes this {@link AbstractRoute} with the given {@link FastifyRequest} and {@link FastifyReply}.
   * @param req The {@link FastifyRequest} to use.
   * @param reply The {@link FastifyReply} to use.
   */
  execute(req: FastifyRequest, reply: FastifyReply): void | Promise<void>;
}
