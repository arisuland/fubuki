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

import UserFlags, { UserFlag } from '~/util/bitfields/UserFlags';
import type { ArisuContext } from '..';
import type { MiddlewareFn } from 'type-graphql';

const mod: MiddlewareFn<ArisuContext> = async ({ context }, next) => {
  if (!context.req.user) throw new Error('unable to obtain user.');

  console.log(context.req.user);
  const flags = new UserFlags(context.req.user.flags);
  let isAdmin = flags.has('Admin') || flags.has('Owner');

  if (context.req.hostname === 'arisu.land')
    isAdmin = flags.has(UserFlag.Admin) || flags.has(UserFlag.Owner) || flags.has(UserFlag.Cutie);
  if (!isAdmin) throw new Error('Missing permissions.');

  return next();
};

export default mod;
