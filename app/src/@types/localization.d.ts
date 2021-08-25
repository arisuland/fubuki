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

/* eslint-disable camelcase */

export {};
/** */
declare global {
  /**
   * Represents a translation's metadata. This is determined when
   * you select a locale in the website.
   */
  interface LocalizationMeta {
    /**
     * Returns the author of this translation, which would
     * be the locale manager of this specific translation.
     *
     * i.e, `en-US` would belong to **Noel**, so it'll be like:
     * ```json
     * {
     *    "meta": {
     *      "author": "Noel <@noel>"
     *    }
     * }
     * ```
     */
    author: string;

    /**
     * Returns the full name of the locale. For example,
     * `en-US` would return `English (United States)`.
     */
    full: string;

    /**
     * Returns the unicode language code of the locale.
     */
    flag: string;

    /**
     * Returns the name of the locale. For example, `English (United States)`
     * would be `en-US`.
     */
    code: string;
  }

  interface LocalizationStrings {
    generic: LocalizationStrings.Generic;
  }

  namespace LocalizationStrings {
    interface Generic {
      error: {
        message: string;
        status: number;
      }
    }
  }
}
