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

import { ObjectType, Field, registerEnumType, createUnionType, Int } from 'type-graphql';
import { JSONObjectResolver } from 'graphql-scalars';

// https://github.com/colinhacks/zod/blob/master/src/ZodError.ts#L4-L18
enum ZodIssueCode {
  InvalidType = 'invalid_type',
  Custom = 'custom',
  InvalidUnion = 'invalid_union',
  InvalidEnumValue = 'invalid_enum_value',
  UnrecognizedKeys = 'unrecognized_keys',
  InvalidReturnType = 'invalid_return_type',
  InvalidDate = 'invalid_date',
  InvalidArguments = 'invalid_arguments',
  InvalidString = 'invalid_string',
  TooSmall = 'too_small',
  TooBig = 'too_big',
  InvalidIntersectionTypes = 'invalid_intersection_types',
  NotMultipleOf = 'not_multiple_of',
}

// https://github.com/colinhacks/zod/blob/9648f3f632280614e07da9621af6e1a8440d678c/src/helpers/parseUtil.ts#L10-L31
enum ZodParsedType {
  String = 'string',
  NotANumber = 'nan',
  Number = 'number',
  Int = 'integer',
  Float = 'float',
  Boolean = 'boolean',
  Date = 'date',
  BigInteger = 'bigint',
  Undefined = 'undefined',
  Null = 'null',
  Array = 'array',
  Object = 'object',
  Unknown = 'unknown',
}

registerEnumType(ZodIssueCode, {
  name: 'ZodIssueType',
  description: 'Returns the issue type for a ZodError.',
});

registerEnumType(ZodParsedType, {
  name: 'ZodParsedType',
  description: 'Returns the parsed type, if any.',
});

const ZodPath = createUnionType({
  name: 'ZodPath',
  types: () => [Number, String],
});

@ObjectType({
  description:
    'Represents a ZodError, which Arisu uses for validating `.arisurc.yml` or `.arisurc.json` project configs.',
})
export default class ZodError {
  @Field(() => [ZodPath], {
    description: 'Returns the path from the error. This can be a `Int` or `String` type.',
  })
  // eslint-disable-next-line
  path!: Array<typeof ZodPath>;

  @Field(() => ZodIssueCode, {
    description: 'Returns the issue code for this ZodError object.',
  })
  code!: ZodIssueCode;

  @Field({
    description: 'Returns the message on why validation failed.',
    nullable: true,
  })
  message?: string;

  @Field(() => ZodParsedType, {
    description: 'The expected value, if the `type` value is `ZodIssueCode.InvalidType`',
    nullable: true,
  })
  expected?: ZodParsedType;

  @Field(() => ZodParsedType, {
    description: 'The received type, if the `type` value is `ZodIssueCode.InvalidType`',
    nullable: true,
  })
  received?: ZodParsedType;

  @Field(() => [String], {
    description: 'The list of keys that were unrecognized, if the `type` value is `ZodIssueCode.UnrecognizedKeys`',
    nullable: true,
  })
  keys?: string[];

  @Field(() => [ZodError], {
    description: 'Returns a list of ZodError object types of the union errors.',
    nullable: true,
  })
  unionErrors?: ZodError[];

  @Field(() => [ZodPath], {
    description: 'Returns the enumeration value issues as a ZodPath object.',
    nullable: true,
  })
  // eslint-disable-next-line
  options?: Array<typeof ZodPath>;

  @Field(() => [ZodError], {
    description: 'Returns a list of ZodError objects that went wrong in the arguments when validating.',
    nullable: true,
  })
  argumentsError?: ZodError[];

  @Field(() => [ZodError], {
    description: 'Returns a list of ZodError objects that went wrong in the return type.',
    nullable: true,
  })
  @Field(() => ZodError, {
    description: 'Returns the invalid return type error itself, if the `code` is InvalidReturnType.',
    nullable: true,
  })
  returnTypeError?: ZodError;

  @Field(() => String, {
    description: 'Returns the string validation issue type, which can be `email`, `url`, `uuid`, `regex`, or `cuid`.',
    nullable: true,
  })
  validation?: 'email' | 'url' | 'uuid' | 'regex' | 'cuid';

  @Field(() => Int, {
    description: 'Returns the maxmium number if the ZodError code is `TooBig`.',
    nullable: true,
  })
  maximum?: number;

  @Field(() => Boolean, { nullable: true })
  inclusive?: boolean;

  @Field(() => String, { nullable: true })
  type?: 'array' | 'string' | 'number';

  @Field(() => Int, {
    description: 'Returns the minimum number if the ZodError code is `TooSmall`.',
    nullable: true,
  })
  minimum?: number;

  @Field(() => Int, { nullable: true })
  mutipleOf?: number;

  @Field(() => JSONObjectResolver, { nullable: true })
  params?: Record<string, any>;
}
