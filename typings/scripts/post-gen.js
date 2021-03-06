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

const { readFile, writeFile } = require('fs/promises');
const { colors, styles } = require('leeks.js');
const { ESLint } = require('eslint');
const { format } = require('prettier');
const { join } = require('path');

/** @type {import('consola').default} */
const consola = require('consola');
const log = consola.withScope('arisu:typings:postgen');

const main = async () => {
  log.info('Running post:gen hook...');
  const typings = await readFile(join(process.cwd(), 'typings', 'graphql.d.ts'), 'utf-8');

  // run it with eslint
  const eslint = new ESLint({
    fix: true,
    extensions: ['.d.ts', 'ts'],
  });

  const results = await eslint.lintText(typings);
  const warnings = results.reduce((acc, curr) => acc + curr.warningCount, 0);
  const errors = results.reduce((acc, curr) => acc + curr.errorCount, 0);

  log.warn(`Received ${warnings} warning(s) / ${errors} error(s) while linting.`);
  for (const result of results.filter((s) => s.messages.length > 0)) {
    for (const message of result.messages) {
      // calculate source
      const lines = result.output.split(/\r?\n/);
      const start = Math.max(message.line - 3, 0);
      const end = Math.min(message.line + 2, lines.length);
      const maxWidth = String(end).length;

      // get source code from here
      const source = lines
        .slice(start, end)
        .map((line, index) => {
          const num = start + 1 + index;
          const gutter = ' ' + (' ' + num).slice(-maxWidth) + ' | ';
          if (num === message.line) {
            const spacing =
              colors.gray(gutter.replace(/\d/g, '')) + line.slice(0, message.column - 1).replace(/[^\t]/g, '');

            return colors.gray(gutter) + line + '\n ' + spacing + styles.bold(colors.red('^'));
          }

          return colors.gray(gutter) + line;
        })
        .join('\n');

      log.fatal(`${message.ruleId === null ? '' : `${message.ruleId}: `}${message.message}\n\n${source}`);
    }

    process.exit(1);
  }

  // Format it with prettier
  const formatted = format(results[0].output, {
    semi: true,
    tabWidth: 2,
    singleQuote: true,
    endOfLine: 'lf',
    printWidth: 120,
    trailingComma: 'es5',
    bracketSpacing: true,
    parser: 'typescript',
  });

  const output = [
    '/*',
    ' * ☔ Arisu: Translation made with simplicity, yet robust.',
    ' * Copyright (C) 2020-2022 Noelware',
    ' *',
    ' * This program is free software: you can redistribute it and/or modify',
    ' * it under the terms of the GNU General Public License as published by',
    ' * the Free Software Foundation, either version 3 of the License, or',
    ' * (at your option) any later version.',
    ' *',
    ' * This program is distributed in the hope that it will be useful,',
    ' * but WITHOUT ANY WARRANTY; without even the implied warranty of',
    ' * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the',
    ' * GNU General Public License for more details.',
    ' *',
    ' * You should have received a copy of the GNU General Public License',
    ' * along with this program.  If not, see <https://www.gnu.org/licenses/>.',
    ' */',
    '',
    '// This file was generated using the `yarn generate` command.',
    `// Do not edit this file yourself. It was generated on ${new Date().toTimeString('en-GB')}.`,
    '',
    formatted,
  ];

  await writeFile(join(process.cwd(), 'typings', 'graphql.d.ts'), output.join('\n'));
  log.success('finished `post:gen` hook. :)');
};

main().catch((ex) => {
  log.error('A fatal error occured while running the post:gen hook:', ex);
  process.exit(1);
});
