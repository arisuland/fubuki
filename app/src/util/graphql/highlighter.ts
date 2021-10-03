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

import type { GraphQLResolveInfo } from 'graphql';
import { styles, colors } from 'leeks.js';
import formatSelectionSet from './formatSelectionSet';
import formatArgValue from './formatArgValue';

/**
 * Represents a highlighter class to colourize GraphQL queries,
 * mutations, or subscriptions in a console-like fashion. This
 * is similarly to [@mikro-orm/sql-highlighter]()
 */
export default class GraphQLHighlighter {
  /**
   * Static reference to a {@link GraphQLHighlighter} singleton.
   */
  public static readonly instance = new GraphQLHighlighter();

  /**
   * Highlights the text and returns the text in which
   * you can print it in the console!
   *
   * @param ast The AST tree to parse through
   */
  highlight(ast: GraphQLResolveInfo) {
    let block = '';

    for (let i = 0; i < ast.fieldNodes.length; i++) {
      const field = ast.fieldNodes[i];
      block += styles.bold(colors.green(field.name.value));

      if (field.arguments !== undefined && field.arguments.length > 0) {
        block += colors.green('(');
        for (const arg of field.arguments)
          block += `${colors.white(arg.name.value)}: ${colors.cyan(formatArgValue(arg.value, true))}`;

        block += colors.green(')');
      }

      if (field.selectionSet !== undefined) {
        block += styles.bold(colors.gray(' {'));
        for (const select of field.selectionSet.selections) {
          const formatted = formatSelectionSet(select, true);
          block += `\n    ${formatted}`;
        }

        block += `\n  ${styles.bold(colors.gray('}'))}`;
      }
    }

    let operation = '';
    switch (ast.operation.operation) {
      case 'query':
        operation = `${styles.bold(
          colors.magenta(`query${ast.operation.name !== undefined ? ` ${ast.operation.name}` : ''}`)
        )} ${styles.bold(colors.gray('{'))}`;

        break;

      case 'mutation':
        operation = `${styles.bold(
          colors.cyan(`mutation${ast.operation.name !== undefined ? ` ${ast.operation.name}` : ''}`)
        )} ${styles.bold(colors.gray('{'))}`;

        break;

      case 'subscription':
        operation = `${styles.bold(
          colors.blue(`subscription${ast.operation.name !== undefined ? ` ${ast.operation.name}` : ''}`)
        )} ${styles.bold(colors.gray('{'))}`;

        break;
    }

    operation += `\n   ${block}`;
    operation += '\n ' + styles.bold(colors.gray('}'));

    return operation;
  }
}
