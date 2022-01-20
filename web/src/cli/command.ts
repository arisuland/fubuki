/*
 * ☔ Arisu: Translation made with simplicity, yet robust.
 * Copyright (C) 2020-2022 Noelware
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

import type CliContext from './context';

/**
 * Interface to implement a {@link CommandExecutor.execute execute} command
 * to actually, run the command.
 */
export interface CommandExecutor<Args extends string[] = string[], Flags extends Record<string, unknown> = {}> {
  /**
   * Returns the command's name.
   */
  name: string;

  /**
   * Executes the command in the following {@link CliContext}.
   * @param context The CLI context to use.
   */
  execute(context: CliContext<Args, Flags>): Promise<any>;
}
