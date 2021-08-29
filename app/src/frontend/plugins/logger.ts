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

import type { Plugin } from '@nuxt/types';

declare module '@nuxt/types/index' {
  interface Context {
    $log: (...messages: unknown[]) => void;
  }
}

const formatMessage = (message: unknown) => {
  if (message instanceof Date) return message.toISOString();
  if (typeof message === 'number') return isNaN(message) ? 'NaN' : message.toString();
  if (message instanceof Error) return message.stack ?? '<... no stacktrace ...>';

  return message;
};

const logger: Plugin = (_, inject) => {
  inject('log', (...messages: unknown[]) =>
    console.log(
      `%c;[Arisu]%c » ${messages.map(formatMessage).join('\n')}`,
      'background-color:#ffffff;color:#B28585;',
      'color:white;'
    )
  );
};

export default logger;
