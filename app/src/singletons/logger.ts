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

import { createLogger, format, transports } from 'winston';
import * as leeks from 'leeks.js';

export default createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'MMM Do, YYYY [at] HH:mm:ss A',
    }),
    format.printf((info) => {
      const metadata = Object.keys(info).filter((s) => !['level', 'message', 'timestamp', 'ms'].includes(s));
      const tags = metadata.map((key) => `[${leeks.colors.magenta(key)}: ${info[key]}]`).join(' ') + ' ';

      return `${leeks.colors.gray(info.timestamp)} ${tags}[${info.level}] ${info.message}`;
    })
  ),
});
