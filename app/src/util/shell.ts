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

import { isObject } from '@augu/utils';
import * as child from 'child_process';

/**
 * Utility class to work with executing terminal commands for async
 * and synchronous use.
 */
export default class Shell {
  private constructor() {
    throw new Error('Cannot construct instances of arisu.Shell');
  }

  /**
   * Executes a shell command synchronously
   * @param command The command to execute
   * @returns The stdout of the command result or a {@link SyntaxError} has been thrown.
   */
  static exec(command: string): string;

  /**
   * Executes a shell command synchronously
   * @param command The command to execute
   * @param args The arguments to use
   * @returns The stdout of the command result or a {@link SyntaxError} has been thrown.
   */
  static exec(command: string, args?: string[]): string;

  /**
   * Runs a shell command synchronously
   * @param command The command to execute
   * @param options Any additional options to execute
   * @param args The arguments to use
   * @returns The stdout of the command result or a {@link SyntaxError} has been thrown.
   */
  static exec(command: string, options: child.ExecOptions, args?: string[]): string;
  static exec(command: string, argsOrOptions?: string[] | child.ExecOptions, args?: string[]) {
    let result: string | SyntaxError = '';
    const list = argsOrOptions !== undefined ? (Array.isArray(argsOrOptions) ? argsOrOptions : args ?? []) : args ?? [];
    const options = argsOrOptions !== undefined && isObject<child.ExecOptions>(argsOrOptions) ? argsOrOptions : {};

    child.exec(`${command}${list.length > 0 ? ` ${list.join(' ')}` : ''}`, options, (error, stdout, stderr) => {
      if (error !== null)
        result = new SyntaxError(`Unable to run "${command}${list.length > 0 ? ` ${list.join(' ')}` : ''}": ${stderr}`);
      else result = stdout;
    });

    if ((result as any) instanceof SyntaxError) throw result;

    return result;
  }
}
