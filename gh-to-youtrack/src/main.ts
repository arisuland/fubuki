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

import { HttpClient } from '@augu/orchid';
import { createHmac } from 'crypto';
import fastify from 'fastify';
import consola from 'consola';

(require('@augu/dotenv') as typeof import('@augu/dotenv')).parse({
  populate: true,
  file: (require('path') as typeof import('path')).join(process.cwd(), '..', '.env'),
  schema: {
    NODE_ENV: {
      default: 'development',
      type: 'string',
      oneOf: ['development', 'production'],
    },

    GITHUB_ACCESS_TOKEN: 'string',
    SECRET: 'string',
    HOST: {
      default: undefined,
      type: 'string',
    },

    PORT: {
      default: undefined,
      type: 'int',
    },
  },
});

const logger = consola.withScope('arisu:gh-to-youtrack');
const http = new HttpClient({
  userAgent: `Arisu/GitHub-To-YouTrack (+https://github.com/auguwu/Arisu; v${require('../package.json').version})`,
});

const validateSignature = (body: any, signature: string) => {
  const sha1 = createHmac('sha1', process.env.SECRET!);
  const sig = `sha1=${sha1.update(body).digest('hex')}`;

  return sig === signature;
};

const main = async () => {
  logger.info('Bootstrapping @arisu/github-to-youtrack service...');

  const server = fastify();
  server.register(require('fastify-no-icon'));

  server.addHook('onRequest', (_, reply, done) => {
    reply.headers({
      'X-Powered-By': 'cute furries doing cute things (https://floofy.dev)',
      Server: `Noelware${process.env.DEDI !== undefined ? `/${process.env.DEDI}` : ''}`,
    });

    done();
  });

  server.get('/', (_, reply) => {
    reply.status(200).send({
      message: 'Hi! Who are you... I have never seen you before... :<',
    });
  });

  server.post('/github', (req, reply) => {
    if (!req.headers['x-hub-signature'])
      return void reply.status(400).send({
        message: 'Missing `x-hub-signature` header.',
      });

    if (Array.isArray(req.headers['x-hub-signature']))
      return void reply.status(400).send({
        message: 'Received multiple `x-hub-signature` headers. We only need one.',
      });

    if (!validateSignature(req.body, req.headers['x-hub-signature']))
      return void reply.status(401).send({
        message: 'Invalid signature has been provided.',
      });

    console.log(req.body);
  });

  server.listen(
    {
      port: process.env.PORT !== undefined ? Number(process.env.PORT) : 4421,
      host: process.env.HOST ?? '0.0.0.0',
    },
    (error, address) => {
      if (error) {
        logger.fatal('Received error while bootstrapping:', error);
        process.exit(1);
      }

      logger.info(`We are now listening on ${address}!`);
    }
  );
};

main().catch((ex) => {
  logger.fatal('Unable to bootstrap server:', ex);
  process.exit(1);
});
