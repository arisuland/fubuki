/*
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

if (require.main === module) {
  process.emitWarning('Imported @arisu/typings from require/import scope.', {
    code: 'ARISU_TYPINGS_MODULE_IMPORTED',
    detail: `
      You imported the typings module (\`require('@arisu/typings')\`), in which, you should not be using!
      If you're using TypeScript, use the \`import type\` syntax:

        import type { User } from '@arisu/typings';

      This warning will be removed once you stop importing the typings module.
    `,
  });
}

module.exports = {};
