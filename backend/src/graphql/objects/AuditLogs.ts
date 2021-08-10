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

export enum AuditLogAction {
  ADDED_MEMBER = 'ADDED_MEMBER',
  REMOVED_MEMBER = 'REMOVED_MEMBER',
  UPDATED_MEMBER = 'UPDATED_MEMBER',
  PROJECT_WENT_PRIVATE = 'PROJECT_WENT_PRIVATE',
  PROJECT_WENT_PUBLIC = 'PROJECT_WENT_PUBLIC',
  ADDED_WEBHOOK = 'ADDED_WEBHOOK',
  REMOVED_WEBHOOK = 'REMOVED_WEBHOOK',
  UPDATED_WEBHOOK = 'UPDATED_WEBHOOK',
  MEMBER_ADDED_TO_ORG = 'MEMBER_ADDED_TO_ORG',
  MEMBER_REMOVED_FROM_ORG = 'MEMBER_REMOVED_FROM_ORG',
  MEMBER_UPDATED_PERMISSIONS = 'MEMBER_UPDATED_PERMISSIONS',
}

export enum AuditLogTarget {
  Organization = 'Organization',
  Project = 'Project',
}

registerEnumType(AuditLogAction, {
  description: 'Returns the action that happened in this audit log.',
  valuesConfig: {
    // Organization Member
    MEMBER_UPDATED_PERMISSIONS: {
      description:
        "A member with the `EDIT_MEMBERS` permission updated another member's permissions. This will produce a `member_id`, `permissions`, and `old_perms` data object that happened, you can use bitwise operators to check what permissions were edited.",
    },
    MEMBER_REMOVED_FROM_ORG: {
      description:
        'A member with the `REMOVE_MEMBERS` permission kicked a member from the organization. This will produce a `reason?` and `member_id` data object of what the reason is (can be nullable) + the member who was kicked.',
    },
    MEMBER_ADDED_TO_ORG: {
      description:
        'A member has been added to this organization! This will produce a `member_id` and `member` data object of which member has joined.',
    },

    // Organization/Project Webhooks
    ADDED_WEBHOOK: {
      description:
        'A member with the `MANAGE_WEBHOOKS` permission has added a webhook to this organization or project. This will produce a `webhook` and `member_id` object of what webhook has been added and which member to blame for.',
    },

    REMOVED_WEBHOOK: {
      description:
        'A member with the `MANAGE_WEBHOOKS` permission has removed a webhook in this project. This will produce a `webhook`, `member`, and `reason?` data object.',
    },

    UPDATED_WEBHOOK: {
      description:
        'A member with the `MANAGE_WEBHOOKS` permission has updated this webhook in this project. This will produce a `updated`, `old_webhook`, and `member` data object.',
    },

    ADDED_MEMBER: {
      description:
        'A member with the `MANAGE_MEMBERS` permission has added a member to this project to collaborate. This will produce a `joined`, `member`, and `ts` data object.',
    },

    REMOVED_MEMBER: {
      description:
        'A member with the `MANAGE_MEMBERS` permission has removed a member of this project to collaborate. This will produce a `member`, `joined_at`, and `ts` data object.',
    },

    UPDATED_MEMBER: {
      description:
        "A member with the `MANAGE_MEMBERS` permission has updated a member's permission(s) in this project. This will produce a `old_permissions`, `permissions`, and `member` data object.",
    },

    PROJECT_WENT_PRIVATE: {
      description:
        'A member with the `MANAGE_PROJECT` permission has made this project private, only member of the organization / users who were invited to collaborate only can view and edit the project. This will produce a `member` and `ts` data object.',
    },

    PROJECT_WENT_PUBLIC: {
      description:
        'A member with the `MANAGE_PROJECT` permission has made this project public again! Everyone can view the project and collaborate! This will produce a `member` and `ts` data object.',
    },
  },
  name: 'AuditLogAction',
});

@ObjectType({
  description:
    'Represents the object type for audit logs in a project. Read https://docs.arisu.land/objects/audit-logs for more information and their CRUD operations.',
})
export class AuditLogs {
  @Field(() => AuditLogAction, {
    description:
      'Returns the action that occured. To view their data object relation, visit https://docs.arisu.land/objects/audit-logs#data-objects for more information.',
  })
  actionType!: AuditLogAction;

  @Field({
    description:
      "Returns the project's ID that was affected. This will be omitted as an empty string if occured in a organization.",
  })
  project!: string;

  @Field(() => String, {
    nullable: true,
    description: 'The reason why this audit log occured.',
  })
  reason!: string | null;

  @Field(() => AuditLogTarget, {
    description: 'Returns the target type of this audit log.',
  })
  target!: string;

  @Field(() => Object, {
    description: 'Returns the data object (if any) that occured in this audit log.',
  })
  data!: Record<string, unknown>;

  @Field({ description: 'Returns the ID of this audit log to fetch.' })
  id!: string;
}
