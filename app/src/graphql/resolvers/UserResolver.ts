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

import { Query, Resolver, Arg, Ctx, Mutation } from 'type-graphql';
import PropertyAlreadyTakenException from '~/graphql/exceptions/PropertyAlreadyTakenException';
import type { ArisuContext } from '~/graphql';
import { PrismaClient } from '.prisma/client';
import CreateUserInput from '~/graphql/input/users/CreateUserInput';
import * as argon2 from 'argon2';
import User from '~/graphql/objects/User';

@Resolver()
export default class UserResolver {
  @Query(() => User, {
    name: 'user',
    nullable: true,
    description: 'Returns a user by their unique identifier or username.',
  })
  user(
    @Ctx() context: ArisuContext,
    @Arg('id', { description: "The user's unique identifer or their username to search for." }) id: string
  ) {
    const prisma: PrismaClient = context.container.$ref(PrismaClient);
    return prisma.users.findFirst({
      where: {
        id,
        OR: {
          username: id,
        },
      },
    });
  }

  @Mutation(() => User, {
    description: 'Creates a user and registers them to the database.',
  })
  async createUser(
    @Ctx() context: ArisuContext,
    @Arg('input', { description: '' }) { username, password, email }: CreateUserInput
  ) {
    // Check if a user exists
    const prisma: PrismaClient = context.container.$ref(PrismaClient);
    const hasUser = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (hasUser !== null) throw new PropertyAlreadyTakenException(username, 'username');

    // Check if the email exists
    const hasEmail = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (hasEmail !== null) throw new PropertyAlreadyTakenException(email, 'email');

    // Both aren't taken! Let's create the account~
    const hashedPassword = await argon2.hash(password);
    return await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });
  }
}
