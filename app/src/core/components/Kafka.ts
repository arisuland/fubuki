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

import { AdminClient, Producer } from 'node-rdkafka';
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
  producer?: Producer;

  load() {
    const pubsub = this.config.getProperty('pubsub');
    if (pubsub === undefined) {
      this.logger.warn('Unable to identify `pubsub` option, defaulting to Redis...');
      return Promise.resolve();
    }

    if (pubsub.type !== 'kafka') {
      this.logger.warn(`PubSub type was set to ${pubsub.type}, skipping...`);
      return Promise.resolve();
    }

    if (pubsub.kafka === undefined) {
      this.logger.warn('Missing Kafka options to initialize.');
      return Promise.resolve();
    }

    this.logger.info('Creating producer...');
    this.producer = new Producer({
      'metadata.broker.list': `${pubsub.kafka.host}:${pubsub.kafka.port}`,
    });

    this.producer.on('event.error', (error) =>
      this.logger.error('Received unknown exception in Kafka producer:', error)
    );
    return new Promise<void>((resolve, reject) => {
      this.logger.info('We are now making an attempt to connect to Kafka Producer...');
      this.producer!.on('ready', async (_, metadata) => {
        const topics = metadata.topics.map((t) => t.name);
        this.logger.info(
          `Successfully made a connection to the Kafka producer, found topics:`,
          topics.map((s) => `    - ${s}`).join('\n')
        );

        if (topics.includes(pubsub.kafka!.topic ?? 'tsubaki')) {
          return resolve();
        } else {
          this.logger.warn(`Unable to find requested topic: ${pubsub.kafka!.topic ?? 'tsubaki'}`);
          if (pubsub.kafka!.autoCreateTopics === true) {
            this.logger.info(`Creating topic '${pubsub.kafka!.topic ?? 'tsubaki'}'...`);

            // Create AdminClient to create topics
            const admin = AdminClient.create({
              'metadata.broker.list': `${pubsub.kafka!.host}:${pubsub.kafka!.port}`,
            });

            admin.createTopic(
              // eslint-disable-next-line
              { topic: pubsub.kafka!.topic ?? 'tsubaki', num_partitions: 2, replication_factor: 1 },
              (error) => {
                if (error !== undefined) {
                  reject(error);
                } else {
                  this.logger.info(`Created topic '${pubsub.kafka!.topic ?? 'tsubaki'}', please restart the server.`);
                  reject(new Error('Requires server restart.'));
                }
              }
            );
          } else {
            this.producer!.disconnect();
            return reject(
              new Error(
                `Topic ${
                  pubsub.kafka!.topic ?? 'tsubaki'
                } was not found (reason: \`autoCreateTopics\` was undefined or set to \`false\`.)`
              )
            );
          }
        }
      });

      this.producer!.connect({ allTopics: true });
    });
  }

  dispose() {
    if (!this.producer) return;

    this.logger.warn('Disposing producer...');
    return this.producer.disconnect();
  }

  publish<T>(type: KafkaPublishTypes, data: T) {
    if (!this.producer) return;

    const pubsub = this.config.getProperty('pubsub')!;
    this.producer!.produce(
      pubsub.kafka!.topic ?? 'tsubaki',
      null,
      Buffer.from(
        JSON.stringify({
          channel: type,
          payload: data,
        })
      ),
      null, // TODO: provide a key?
      Date.now(),
      [{ channel: type }]
    );
  }
}
