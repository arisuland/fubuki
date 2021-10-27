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

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// snowflake might not be available, so it's here!
/**
 * Represents a Snowflake ID.
 */
class Snowflake {
  /**
   * Returns the epoch timestamp of the snowflake, which
   * is January 1st, 2022. (`2022-01-01T07:00:00.000Z`)
   */
  public static EPOCH: number = 1641020400000;

  // Returns the increment id of the snowflake
  private static increment: number = 0;

  /**
   * Genereates a new snowflake ID using this utility.
   * @param workerId The worker ID to use.
   */
  static generate() {
    const timestamp = Date.now();
    this.increment++;

    let node = 0;
    if (process.env.DEDI_NODE !== undefined) {
      const lastChar = process.env.DEDI_NODE[process.env.DEDI_NODE.length - 1];
      if (!isNaN(Number(lastChar))) node = +lastChar;
    }

    if (this.increment >= 4095) this.increment = 0;
    return (
      (BigInt(timestamp - this.EPOCH) << 22n) |
      (BigInt(node) << 17n) |
      (BigInt(process.pid) << 12n) |
      BigInt(this.increment)
    ).toString();
  }
}

const main = async () => {
  // `admin` account gets deleted after first initialization
  console.log('Creating `admin` user with `admin` password...');

  const password = await argon2.hash('admin');
  await prisma.users.create({
    data: {
      description: 'Temporary administration account.',
      password: password,
      username: 'admin',
      email: 'admin@arisu.land',
      flags: 1 << 1,
      name: 'Admin',
      id: Snowflake.generate(),
    },
  });

  console.log('Created admin account!');
  await prisma.$disconnect();
};

main();
