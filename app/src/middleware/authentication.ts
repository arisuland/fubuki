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

import type { FastifyPluginCallback } from 'fastify';
import { Container } from '@augu/lilith';
import { Security } from '~/util';
import { Logger } from 'tslog';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    user: any;
  }
}

const logger = Container.instance.$ref<Logger>(Logger);
const authentication: FastifyPluginCallback<any> = (server, _, done) => {
  logger.info('Initializing authentication middleware...');

  server.decorateRequest('user', null);
  server.addHook('onRequest', (req, reply, done) => {
    if (req.headers.authorization !== undefined) {
      const [prefix, token] = req.headers.authorization.split(' ');
      if (!prefix) {
        console.log('rip prefix :<');
        reply
          .type('application/json')
          .status(400)
          .send({
            message: 'Missing prefix in `Authorization`.',
            available: ['Bearer'],
          });

        done();
        return;
      }

      if (prefix === 'Bearer') {
        const validated = Security.validate(token);
        if (validated === null) {
          reply
            .type('application/json')
            .status(401)
            .send({
              message: `Token ${token} was not a valid token or it was expired.`,
            });

          done();
          return;
        }
      }

      // todo: get user from database
      req.user = null;
      done();
    }

    // fuck
    done();
  });

  done();
};

export default fp(authentication, {
  fastify: '>=3.0',
});
