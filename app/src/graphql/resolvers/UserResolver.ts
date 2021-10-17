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

import { Query, Resolver, Arg, Ctx, Mutation, UseMiddleware, ObjectType, Field } from 'type-graphql';
import PropertyAlreadyTakenException from '~/graphql/exceptions/PropertyAlreadyTakenException';
import type { ArisuContext } from '~/graphql';
import { PrismaClient } from '@prisma/client';
import UpdateUserInput from '~/graphql/input/users/UpdateUserInput';
import CreateUserInput from '~/graphql/input/users/CreateUserInput';
import { isEmail } from 'class-validator';
import * as argon2 from 'argon2';
import { auth } from '../middleware';
import User from '~/graphql/objects/User';

export interface Result {
  success: boolean;
  errors?: readonly Error[];
}

@ObjectType()
export class ErrorType {
  @Field()
  message!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class ResultObject {
  @Field(() => [ErrorType], { nullable: true, description: 'Returns the list of validation errors, if any.' })
  errors!: readonly Error[];

  @Field({ description: 'Returns if the operation was successful or not.' })
  success!: boolean;
}

@Resolver()
export default class UserResolver {
  @Query(() => User, {
    name: 'me',
    nullable: true,
    description: 'Returns the user by their session token, if any.',
  })
  @UseMiddleware(auth)
  async me(@Ctx() { prisma, req }: ArisuContext) {
    return prisma.users.findUnique({
      where: {
        id: req.user!.id,
      },
    });
  }

  @Query(() => User, {
    name: 'user',
    nullable: true,
    description: 'Returns a user by their unique identifier or username.',
  })
  async user(
    @Ctx() context: ArisuContext,
    @Arg('id', { description: "The user's unique identifer or their username to search for." }) id: string
  ) {
    const prisma: PrismaClient = context.container.$ref(PrismaClient);
    const userWithId = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (userWithId !== null) return userWithId;
    return prisma.users.findUnique({
      where: {
        username: id,
      },
    });
  }

  @Mutation(() => User, {
    description: 'Creates a user and registers them to the database.',
  })
  async createUser(
    @Ctx() context: ArisuContext,
    @Arg('input', { description: 'The input for creating a new user in the database.' })
    { username, password, email }: CreateUserInput
  ) {
    // Check if a user exists
    const prisma: PrismaClient = context.container.$ref(PrismaClient);
    const hasUser = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (hasUser !== null) throw new PropertyAlreadyTakenException(username, 'username');
    if (!isEmail(email)) throw new Error(`Invalid email: "${email}"`);

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

  @Mutation(() => ResultObject, {
    description: "Updates a user's metadata about themselves.",
  })
  @UseMiddleware(auth)
  async updateUser(
    @Ctx() context: ArisuContext,
    @Arg('input') { username, password, name, description, email }: UpdateUserInput
  ): Promise<Result> {
    if (!username && !password && !name && !description && !email)
      return {
        success: false,
        errors: [new Error('Missing data to update. :<')],
      };

    const prisma: PrismaClient = context.container.$ref(PrismaClient);
    const oldUser = context.req.user!;
    const transactions: any[] = [];

    if (username !== undefined) {
      if (username.length > 32)
        return {
          success: false,
          errors: [new Error(`Username "${username}" is invalid: char length > 32`)],
        };

      const owo = await prisma.users.findUnique({
        where: {
          username,
        },
      });

      if (owo !== null)
        return {
          success: false,
          errors: [new Error(`Username "${username}" is already taken.`)],
        };

      transactions.push(
        prisma.users.update({
          where: {
            id: oldUser.id,
          },

          data: {
            username,
          },
        })
      );
    }

    if (password !== undefined) {
      const hashed = await argon2.hash(password);
      transactions.push(
        prisma.users.update({
          where: {
            id: oldUser.id,
          },

          data: {
            password: hashed,
          },
        })
      );
    }

    if (name !== undefined) {
      // TODO: check for racist words and such?
      transactions.push(
        prisma.users.update({
          where: {
            id: oldUser.id,
          },

          data: {
            name,
          },
        })
      );
    }

    if (description !== undefined) {
      if (description.length > 140)
        return {
          success: false,
          errors: [new Error(`Description is invalid: char length > 140`)],
        };

      transactions.push(
        prisma.users.update({
          where: {
            id: oldUser.id,
          },

          data: {
            description,
          },
        })
      );
    }

    await prisma.$transaction(transactions);

    return {
      success: true,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(auth)
  async deleteUser(@Ctx() context: ArisuContext) {
    const prisma: PrismaClient = context.container.$ref(PrismaClient);
    return prisma.users
      .delete({
        where: {
          id: context.req.user!.id,
        },
      })
      .then(() => true)
      .catch(() => false);
  }
}
