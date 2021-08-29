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

import { InterpolatedVariables } from '~/util';
import * as z from 'zod';

const zodSchema = z
  .object({
    accessToken: z.string().optional(),
    project: z.string(),
    github: z.object({
      enabled: z.boolean(),
      repository: z.string(),
      files: z.union([
        z.string(),
        z.object({
          format: z.enum(['json', 'yaml', 'js', 'ts', 'javascript', 'typescript']),
          indent: z.number().optional().default(4),
        }),
      ]), // TODO: figure out to combine
      branches: z.array(z.string()).optional(),
      commitMessage: z.string().optional(),
    }),
  })
  .strict();

export type ArisurcZodSchema = z.infer<typeof zodSchema>;

/**
 * Validates the {@link object} and see if it validates.
 * @param object The object to look for
 * @returns The parsed schema for a {@link z.ZodError} if anything occured.
 */
export const validate = (object: any) => zodSchema.parse(object);

/**
 * Returns the zod schema as a {@link InterpolatedVariables interpolated variable schema}.
 */
export const useInterpolated = (schema: ArisurcZodSchema) =>
  new InterpolatedVariables(/[$]\{\{( [\w\.]+ )\}\}|[$]\{([\w\.]+)\}/g, schema);
