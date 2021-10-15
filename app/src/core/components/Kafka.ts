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

import { Kafka as KafkaClient, Producer } from 'kafkajs';
import { Component, Inject } from '@augu/lilith';
import { Logger } from 'tslog';
import Config from './Config';

export enum KafkaPublishTypes {
  ProjectPush = 'tsubaki:project:push',
  ProjectDelete = 'tsubaki:project:delete',
  ProjectUpdate = 'tsubaki:project:update',
}

/**
 * Represents the producer of Tsubaki, this is where any PubSub occurs,
 * if the **Kafka** PubSub engine is enabled in the configuration.
 *
 * This is used primarily for communication between the **GitHub** bot and
 * Tsubaki itself. If there is no consumer connected, it'll disconnect
 * the producer to leave off some extra memory.
 */
@Component({ name: 'kafka', priority: 1 })
export default class Kafka {
  @Inject
  private readonly logger!: Logger;

  @Inject
  private readonly config!: Config;
  private kafka!: KafkaClient;

  producer: Producer | null = null;

  async load() {
    const kafka = this.config.getProperty('kafka');
    if (kafka === undefined) {
      this.logger.warn('Kafka configuration is missing, but optional!');
      return Promise.resolve();
    }

    this.logger.debug('Creating Kafka broker client...');
    this.kafka = new KafkaClient({
      brokers: kafka.brokers.map((s) => `${s.host}${s.port !== undefined ? `:${s.port}` : ''}`),
      clientId: 'tsubaki',
      logLevel: process.env.NODE_ENV === 'development' ? 5 : 4,
    });

    this.logger.info('Creating producer...');
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: kafka.autoCreateTopics ?? true,
    });

    // setup producer events
    this.producer!.on('producer.connect', (...args: any[]) =>
      this.logger.info('Connected to Kafka producer!', ...args)
    );

    this.producer!.on('producer.disconnect', (...args: any[]) =>
      this.logger.info('Disconnected from Kafka producer :(', ...args)
    );

    return this.producer.connect();
  }

  dispose() {
    if (this.producer === null) return;

    this.logger.warn('Disconnecting Kafka producer...');
    return this.producer.disconnect();
  }

  publish(channel: string, type: KafkaPublishTypes, data?: Record<string, any>) {
    // TODO: type `data`
    if (this.producer === null) return Promise.resolve(); // no-op

    return this.producer.send({
      messages: [
        {
          value: JSON.stringify({
            type,
            d: data,
          }),
        },
      ],

      topic: channel,
      timeout: 2500, // 2.5 seconds should work
    });
  }
}
