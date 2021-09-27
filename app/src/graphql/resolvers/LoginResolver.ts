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

import { Resolver, Ctx, Arg, UseMiddleware, Mutation, ObjectType, Field } from 'type-graphql';
import { ResultObject, Result } from './UserResolver';
import SessionTokenService from '~/core/services/SessionTokenStore';
import type { ArisuContext } from '..';
import { isEmail } from 'class-validator';
import { auth } from '../middleware';
import argon2 from 'argon2';

@ObjectType()
class LoginResult extends ResultObject {
  @Field()
  token!: string;
}

@Resolver()
export default class LoginResolver {
  @Mutation(() => LoginResult, {
    description: 'Returns the result of the operation.',
  })
  async login(
    @Ctx() { prisma, container }: ArisuContext,
    @Arg('emailOrUser') emailOrUser: string,
    @Arg('password') password: string
  ): Promise<Result & { token?: string }> {
    const sessions: SessionTokenService = container.$ref(SessionTokenService);
    const propName = isEmail(emailOrUser) ? 'email' : 'username';
    const doc = await prisma.users.findFirst({
      where: {
        [propName]: emailOrUser,
      },
    });

    if (doc === null)
      return {
        success: false,
        errors: [new Error(`Username or email not found: "${emailOrUser}"`)],
      };

    const validated = await argon2.verify(doc.password, password);
    if (!validated)
      return {
        success: false,
        errors: [new Error('Invalid password.')],
      };

    const session = await sessions.createSession(doc, 'web');
    return {
      success: true,
      token: `Session ${session.token}`,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(auth)
  async logout(@Ctx() { container, req }: ArisuContext) {
    const sessions: SessionTokenService = container.$ref(SessionTokenService);
    return sessions
      .cancelSession(req.sessionToken!)
      .then(() => true)
      .catch(() => false);
  }
}
