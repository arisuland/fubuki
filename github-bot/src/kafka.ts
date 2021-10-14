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

import { KafkaConsumer } from 'node-rdkafka';
import { randomBytes } from 'crypto';
import consola from 'consola';

const logger = consola.withScope('arisu:github:kafka');

// Singleton of [KafkaConsumer].
export let consumer: KafkaConsumer;

export function connect() {
  const groupId = process.env.KAFKA_CONSUME_GROUP_ID ?? randomBytes(16).toString('hex');
  consumer = new KafkaConsumer(
    {
      'group.id': `arisu-github-${groupId}`,
      'allow.auto.create.topics': true,
      'metadata.broker.list': `${process.env.KAFKA_CONSUMER_HOST}:${process.env.KAFKA_CONSUMER_PORT}`,
    },
    {
      'auto.offset.reset': 'latest',
    }
  );

  logger.debug('Initializing data pipeline...');
  consumer.on('data', (message) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Received JSON payload:\n${JSON.stringify(message, null, 2)}`);
    }

    if (message.headers !== undefined) {
      const channel = message.headers.find((header) => 'channel' in header);
      if (channel === undefined) {
        logger.warn(`Channel "${channel}" doesn't exist, are you sure the backend is connected?`);
        return;
      } else {
        logger.info(`We are now looking for parsed message in ${channel.channel.toString()}!`);
      }
    }

    // Now we listen for payloads
    const data = message.value?.toString();
    if (!data) {
      logger.error('Payload was `undefined`, skipping...');
      return;
    }

    let actualPayload: any;
    try {
      actualPayload = JSON.parse(data);
    } catch (ex) {
      logger.error('Unable to parse JSON data:', ex);
      return;
    }

    console.log(actualPayload);
  });

  consumer.on('event.error', (error) => logger.error('Received exception in Kafka consumer:', error));
  consumer.on('event.log', (message) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Consumer> ${message}`);
    }
  });

  consumer.on('subscribed', (topics) => logger.info(`Subscribed to topics: ${topics.join(', ')}`));

  return new Promise<void>((resolve, reject) => {
    consumer.on('ready', (_, metadata) => {
      const topics = metadata.topics.map((s) => s.name);
      logger.info('Connected to Kafka consumer, found topics:\n', topics.map((s) => `-   ${s}`).join('\n'));

      if (topics.includes(process.env.KAFKA_CONSUMER_TOPIC)) {
        logger.info(`Subscribing to topic ${process.env.KAFKA_CONSUMER_TOPIC}!`);
        consumer.subscribe([process.env.KAFKA_CONSUMER_TOPIC]).consume();
        resolve();
      } else {
        logger.warn(`Topic ${process.env.KAFKA_CONSUMER_TOPIC} was not found.`);
        consumer.disconnect();
        return reject(new Error(`Requested topic ${process.env.KAFKA_CONSUMER_TOPIC} was not found.`));
      }
    });

    consumer.once('event.error', (error) => {
      logger.error('Received exception in Kafka consumer:', error);
      return reject(error);
    });

    logger.info('Connecting to Kafka consumer...');
    consumer.connect();
  });
}

export function disconnect() {
  logger.warn('Disconnecting Kafka consumer...');
  consumer.disconnect();
}
