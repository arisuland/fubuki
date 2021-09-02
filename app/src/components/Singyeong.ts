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

import { Component, ComponentAPI, Inject } from '@augu/lilith';
import SingyeongListener from '~/listeners/SingyeongListener';
import { Logger } from 'tslog';
import { Client } from '@arisuland/singyeong';
import Config from './Config';

@Component({
  priority: 1,
  name: 'singyeong',
})
export default class Singyeong {
  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly config!: Config;

  client!: Client;
  api!: ComponentAPI;

  async load() {
    const config = this.config.getProperty('singyeong');
    if (config === undefined) {
      this.logger.warn(
        'Missing `singyeong` details to connect. This is optional unless you plan to run @arisu/github-bot.'
      );

      return;
    }

    this.logger.info('Connecting to singyeong...');
    this.client = new Client({
      dsn: config.dsn,
      connection: {
        clientId: config.clientId ?? 'arisu',
        namespace: config.namespace ?? 'arisu',
        reconnect: config.reconnect ?? true,
      },
    });

    this.api.forwardSubscriptions(this.client, new SingyeongListener());
    return this.client.connect();
  }
}
