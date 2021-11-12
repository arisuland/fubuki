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

import Bitfield from './Bitfield';

/**
 * Represents the bits of the {@link UserFlags} bitfield set.
 */
export enum UserFlag {
  /**
   * None, there is nothing special about this person.
   */
  None = 0,

  /**
   * They are the owner of this instance, which has administration
   * powers. You can get an admin key from POST `/api/v1/admin/token` if
   * you have the `Owner` or higher bits.
   */
  Owner = 1 << 0,

  /**
   * They have administration powers, like seeing the admin dashboard.
   */
  Admin = 1 << 1,

  /**
   * This person is a Noelware employee.
   *
   * @note This is only allowed on `arisu.land` or `staging.arisu.land`, self-hosted instances
   * cannot attach this flag to themselves.
   */
  Employee = 1 << 2,

  /**
   * ...nothing to see here...
   *
   * @note This is only allowed on `arisu.land` or `staging.arisu.land`, self-hosted instances
   * cannot attach this flag to themselves.
   */
  Cutie = 1 << 3,

  /**
   * This is given to Noel himself.
   *
   * @note This is only allowed on `arisu.land` or `staging.arisu.land`, self-hosted instances
   * cannot attach this flag to themselves.
   */
  Founder = 1 << 4,

  /**
   * If this user has given us access to send in data usage / error reports
   * behalf their user account.
   */
  TelemetryOptIn = 1 << 5,
}

class UserFlags extends Bitfield<UserFlag> {}
UserFlags.FLAGS = UserFlag;

export default UserFlags;
