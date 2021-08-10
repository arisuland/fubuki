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
  description:
    'Represents a project or organization webhook which can execute actions in a seperate HTTP server, you can read more here: https://docs.arisu.land/features/webhooks',
})
export class Webhook {
  @Field(() => Int, {
    description: 'Returns how many successful hits the backend has hit this request with a 200 status code.',
  })
  successfulHits!: number;

  @Field({
    description:
      'Returns the content type to send the payload in as the request body, this is default to `application/json` per standard.',
  })
  contentType!: string;

  @Field(() => Int, {
    description:
      'Returns how many failed hits the backend has reached with a >400 <500 status code. Redirects do not count in successful or failed hits.',
  })
  failedHits!: number;

  @Field({
    description: 'Returns the project ID this webhook belongs to',
  })
  projectId!: string;

  @Field({
    description: 'Returns the webhook id for fetching.',
  })
  id!: string;
}
