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

import * as graphql from './graphql';

declare namespace arisu {
  /**
   * Represents the `Query` type, read more in our [GraphQL API documentation](https://arisu.land/docs/graphql#type-query).
   */
  export type Query = graphql.Query;

  /**
   * Represents all the mutations available to modify, delete, or patch data.
   * Read more in our [GraphQL API documentation](https://arisu.land/docs/graphql#type-mutation).
   */
  export type Mutation = graphql.Mutation;

  /**
   * Represents a user inserted in the database.
   */
  export type User = graphql.User;

  /**
   * Represents a project inserted in the database.
   */
  export type Project = graphql.Project;
}

export = arisu;
export as namespace arisu;
