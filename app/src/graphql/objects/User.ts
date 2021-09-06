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
  description: 'Represents a User registered.',
})
export default class User {
  @Field(() => String, { description: "Returns the user's description about themselves.", nullable: true })
  description!: string | null;

  @Field(() => String, { description: 'Returns a ISO8601 date of when this user has last updated their profile.' })
  updatedAt!: Date;

  @Field(() => String, { description: 'Returns a ISO8601 date of when this user was registered.' })
  createdAt!: Date;

  @Field({
    description: "Returns the user's username. You can preview their profile at https://arisu.land/~/<username>.",
  })
  username!: string;

  @Field(() => Int, {
    description: 'Returns any User flags as a bitfield. Refer to https://docs.arisu.land/#bitfield',
  })
  flags!: number;

  @Field({ description: "Returns the user's name or it'll default to the username.", nullable: true })
  name!: string;

  @Field({ description: 'Returns the unique identifier of this user.' })
  id!: string;
}
