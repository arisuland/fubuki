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

/**
 * Represents the metadata of a user.
 */
interface User {
  description: string | null;
  updatedAt: Date;
  createdAt: Date;
  username: string;
  flags: number;
  name: string | null;
  id: string;
}

const omit = <T extends object, K extends keyof T = keyof T>(obj: T, keys: K[]): Omit<T, K> =>
  Object.keys(keys)
    .filter((k) => !keys.includes(k as any))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {} as Omit<T, K>);

/**
 * Represents the current state of this store.
 */
export const state = () => ({
  user: null,
});

/**
 * Represents the current mutations available
 */
export const mutations = {
  setUser() {
    console.log(this);
  },
};
