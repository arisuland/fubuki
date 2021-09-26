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

import Document, { DocumentContext, NextScript, Main, Html, Head } from 'next/document';

export default class AliceDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initial = await Document.getInitialProps(ctx);
    return { ...initial };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/lotus.png" />
          <link rel="icon" href="/lotus.png" />
          <meta charSet="utf-8" />
          <meta name="description" content="" />
        </Head>
      </Html>
    );
  }
}

/*
import Document, { NextScript, Head, Html, Main, DocumentContext } from 'next/document';

export default class PawDocument extends Document {
        <link rel='shortcut icon' href='https://cdn.floofy.dev/images/trans.png' />
        <link rel='icon' href='https://cdn.floofy.dev/images/trans.png' />
        <meta charSet='UTF-8' />
        <meta name='description' content='Student and developer in the United States who makes projects that no one will use. ☆*✲୧( ○ ╹ 〰 ╹ ○ )୨✲*☆' />
        <meta name='theme-color' content='#DAA2C6' />
        <meta property='og:description' content='Student and developer in the United States who makes projects that no one will use. ☆*✲୧( ○ ╹ 〰 ╹ ○ )୨✲*☆' />
        <meta property='og:title' content='Noel 🥀' />
        <meta property='og:image' content='https://cdn.floofy.dev/images/August.png' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://floofy.dev' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>;
  }
}
*/
