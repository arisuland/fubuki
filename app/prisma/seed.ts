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
      flags: 0,
      name: 'Admin',
    },
  });

  console.log('Created admin account!');
  await prisma.$disconnect();
};

main();
