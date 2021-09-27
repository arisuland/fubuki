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

import { Query, Resolver, Arg, Ctx, Mutation, UseMiddleware } from 'type-graphql';
import { Result, ResultObject } from './UserResolver';
import type { ArisuContext } from '~/graphql';
import StorageProviderService from '~/core/services/StorageProviderService';
import UpdateProjectInput from '~/graphql/input/projects/UpdateProjectInput';
import CreateProjectInput from '~/graphql/input/projects/CreateProjectInput';
import { auth } from '../middleware';
import Project from '~/graphql/objects/Project';

@Resolver()
export default class ProjectResolver {
  @Query(() => Project, {
    description: 'Returns a project from querying its name or UUID.',
    nullable: true,
  })
  project(
    @Ctx() { prisma }: ArisuContext,
    @Arg('nameOrId', { description: 'The name of the project or its UUID when querying.' }) nameOrId: string
  ) {
    return prisma.projects.findFirst({
      where: {
        id: nameOrId,
        OR: {
          name: nameOrId,
        },
      },
      include: { owner: true },
    });
  }

  // TODO: probably cache this in LRU cache?
  @Query(() => [Project], {
    description: 'Returns the list of projects a user.',
  })
  projects(
    @Ctx() { prisma }: ArisuContext,
    @Arg('userId', { description: "The user's UUID to query a list of projects for or the project's name to query." })
    userNameOrId: string
  ) {
    return prisma.projects.findMany({
      where: {
        ownerId: userNameOrId,
        OR: {
          name: userNameOrId,
        },
      },
    });
  }

  @Mutation(() => Project, {
    description: 'Creates a new project as the owner being the current authenticated user.',
    nullable: true,
  })
  @UseMiddleware(auth)
  async createProject(
    @Ctx() { prisma, req, container }: ArisuContext,
    @Arg('input') { description, name, language }: CreateProjectInput
  ) {
    // Check if the user already has this project
    const hasProject = await prisma.projects.findFirst({
      where: {
        ownerId: req.user!.id,
        name,
      },
    });

    if (hasProject !== null) return null;

    // Create the project
    const project = await prisma.projects.create({
      data: {
        baseLanguage: language ?? 'en-US',
        description,
        ownerId: req.user!.id,
        name,
      },
      include: {
        owner: true,
      },
    });

    // Create the storage bucket
    const storage: StorageProviderService = container.$ref(StorageProviderService);
    await storage.addProject(req.user!.id, name);

    return project;
  }

  @Mutation(() => ResultObject, {
    description: "Update a project's metadata",
  })
  @UseMiddleware(auth)
  async updateProject(
    @Ctx() { prisma, req }: ArisuContext,
    @Arg('input') { description, language, name, id }: UpdateProjectInput
  ): Promise<Result> {
    if (!description && !language && !name)
      return {
        success: false,
        errors: [new Error('Missing `description`, `language`, or `name`.')],
      };

    const transactions: any[] = [];
    if (description !== undefined) {
      if (description.length > 250)
        return {
          success: false,
          errors: [new Error(`project.description: char length > 250, went over ${description.length - 250} chars.`)],
        };

      transactions.push(
        prisma.projects.update({
          where: {
            id,
          },

          data: {
            description,
          },
        })
      );
    }

    if (language !== undefined) {
      // TODO: add if the language exists in `languages` JSON object.
      transactions.push(
        prisma.projects.update({
          where: { id },
          data: { baseLanguage: language },
        })
      );
    }

    if (name !== undefined) {
      // check if name conflicts with any other project
      const hasProjName = await prisma.projects.findFirst({
        where: {
          name,
          ownerId: req.user!.id,
        },
      });

      if (hasProjName !== null)
        return {
          success: false,
          errors: [new Error(`projects.name: project with name ${name} exists.`)],
        };

      transactions.push(
        prisma.projects.update({
          where: { id },
          data: { name },
        })
      );
    }

    await prisma.$transaction(transactions);
    return { success: true };
  }

  @Mutation(() => Boolean, {
    description: "Deletes a project from the database and it's files in storage.",
  })
  @UseMiddleware(auth)
  async deleteProject(
    @Ctx() { prisma, container }: ArisuContext,
    @Arg('id', { description: 'The UUID of the project to delete.' }) id: string
  ) {
    // TODO: add storage removal
    // const storage: StorageProviderService = container.$ref(StorageProviderService);
    // await storage.clean(nameOrId);

    return prisma.projects.delete({
      where: {
        id,
      },
    });
  }
}
