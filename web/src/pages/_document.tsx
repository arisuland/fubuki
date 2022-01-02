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

import Document, { NextScript, Head, Html, Main, DocumentContext } from 'next/document';

export default class FubukiDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initial = await Document.getInitialProps(ctx);
    return { ...initial };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="https://cdn.floofy.dev/art/icons/icon_cinnamonserval.png" />
          <link rel="icon" href="https://cdn.floofy.dev/art/icons/icon_cinnamonserval.png" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.14.0/devicon.min.css" />
          <meta charSet="UTF-8" />
          <meta
            name="description"
            content="☔ Translation made with simplicity, yet robust. Made with ❤️ in TypeScript."
          />
          <meta name="theme-color" content="#76509C" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
