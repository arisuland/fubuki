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

import { Field, ObjectType, registerEnumType } from 'type-graphql';

export enum ProjectHandle {
  Organization = 'Organization',
  User = 'User',
}

registerEnumType(ProjectHandle, {
  description: 'Returns the handler of this project, which can belong to a User or Organization',
  valuesConfig: {
    Organization: {
      description: 'This project belongs to an organization.',
    },

    User: {
      description: 'This project belongs to a user account.',
    },
  },
  name: 'ProjectHandle',
});

@ObjectType()
export class Project {
  @Field(() => [String])
  contributors!: string[];

  @Field()
  updatedAt!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  directory!: string;

  @Field()
  ownerID!: string;

  @Field()
  handle!: ProjectHandle;

  @Field()
  flags!: number;

  @Field()
  id!: string;
}
