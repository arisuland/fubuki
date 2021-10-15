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

import { Kafka as KafkaClient } from 'kafkajs';
import { randomBytes } from 'crypto';
import consola from 'consola';

const logger = consola.withScope('arisu:github:kafka');
export let consumer: ReturnType<KafkaClient['consumer']>;

export function connect() {
  logger.info('Created Kafka controller.');
  const client = new KafkaClient({
    clientId: 'arisu.github',
    brokers: process.env.KAFKA_CONSUMER_BROKERS.split(','),
    logLevel: process.env.NODE_ENV === 'development' ? 5 : 4,
    logCreator: (level) => {
      const log = consola.withScope('arisu:kafka:consumer');
      return (entry) => {
        // Do not log an entry if `level` = 0 (Nothing)
        if (level === 0) return;

        let levelName!: string;
        switch (level) {
          case 1:
            levelName = 'error';
            break;

          case 2:
            levelName = 'warn';
            break;

          case 4:
            levelName = 'info';
            break;

          case 5:
            levelName = 'debug';
            break;
        }

        // if we can't get a level name, let's
        // not log it.
        if (!levelName) return;
        log[levelName](entry.log.message);
      };
    },
  });

  consumer = client.consumer({
    groupId: `arisu-github-${randomBytes(4).toString('hex')}`,
    allowAutoTopicCreation: true,
  });

  logger.info('Initializing data pipeline using Kafka!');
  consumer.on('consumer.connect', () => logger.info('Connected to Kafka consumer!'));
  consumer.on('consumer.crash', () => logger.fatal('Consumer has crashed for an unknown reason:'));
  consumer.on('consumer.disconnect', () => logger.warn('Consumer has discnnected:'));

  return consumer.connect();
}

export function disconnect() {
  logger.warn('Disconnecting from Kafka consumer...');
  return consumer.disconnect();
}
