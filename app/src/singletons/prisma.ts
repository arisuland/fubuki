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

import { PrismaClient } from '.prisma/client';

export const teardown = async (prisma: PrismaClient) => {
  await prisma.$disconnect();
};

// Why not a seperate variable for this?
//
// Lilith doesn't create new instances everytime it is
// referenced in @Inject, so doing `new PrismaClient` is safe
// in that regard.
export default new PrismaClient();
