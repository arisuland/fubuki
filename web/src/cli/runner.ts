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

import { type CommandExecutor } from './command';
import { Collection } from '@augu/collections';
import minimist from 'minimist';
import main from './commands/main';
import CliContext from './context';

/**
 * Represents the CLI runner for executing Fubuki commands. Read more about
 * what to do with the fubuki [CLI usage](https://docs.arisu.land/fubuki/cli).
 *
 * ### Commands
 * There is multiple commands to administrate Fubuki. The available ones are:
 * - `fubuki [-c ...]` - Bootstraps and runs the Fubuki server. If `cluster.enabled`
 *   is set to **true**, Fubuki will perform a cluster / node election to elect which one
 *   can manage multiple Fubuki nodes.
 *
 * - `fubuki ping [-c ...]` - If `cluster.enabled` is set to **true**, Fubuki will run
 *   a ping check on all nodes, otherwise, it'll just ping the current Next.js instance.
 *
 * - `fubuki validate [config file] [-e]` - Validates a Fubuki [configuration file](https://docs.arisu.land/fubuki/self-hosting#configuration)
 *   or the system's environment variables to check if it's valid or not.
 */
export default class CliRunner {
  private commands: Collection<string, CommandExecutor> = new Collection([['main', new main()]]);

  // Returns a list of the CLI arguments provided.
  private args: string[];

  /**
   * Constructs a new {@link CliRunner} instance.
   * @param argv The arguments list to use. By default, it will use the process' arguments.
   */
  constructor(argv: string[] = process.argv.slice(2)) {
    this.args = argv;
  }

  get #parsed() {
    return minimist(this.args);
  }

  async run() {
    const commandName = this.#parsed._[0];
    if (!commandName) {
      const main = this.commands.get('main');
      const args = this.#parsed._.slice(1);
      delete this.#parsed['--'];
      delete this.#parsed['-'];

      const context = new CliContext(args, this.#parsed);
      return main!.execute(context);
    }

    const found = this.commands.find((c) => c.name === commandName);
    if (!found) throw new Error(`Command with name "${commandName}" was not found.`);

    const args = this.#parsed._.slice(1);
    delete this.#parsed['--'];
    delete this.#parsed['-'];

    const context = new CliContext(args, this.#parsed);
    return found!.execute(context);
  }
}
