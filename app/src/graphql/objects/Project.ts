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

import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType({
  description: 'Represents a Project, linked to a User or Organization',
})
export default class Project {
  @Field({ nullable: true, description: 'Returns the project description.' })
  description!: string | null;

  @Field(() => String, { description: 'Returns a ISO8061 date on when the project was last updated.' })
  updatedAt!: Date;

  @Field(() => String, { description: 'Returns a ISO8061 date on when this project was created.' })
  createdAt!: Date;

  @Field({ description: 'Returns the owner of this Project.' })
  ownerId!: string;

  @Field(() => Int, {
    description: 'Returns any Project flags as a bitfield. Refer to https://docs.arisu.land/#bitfield',
  })
  flags!: number;

  @Field({ description: 'Returns the project name.' })
  name!: string;

  @Field({ description: 'Returns the unique identifier of this project.' })
  id!: string;
}
