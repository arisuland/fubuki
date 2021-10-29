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

const { existsSync } = require('fs');
const { copyFile } = require('fs/promises');
const { Logger } = require('tslog');
const isDocker = require('is-docker');
const { join } = require('path');

const logger = new Logger();

(async () => {
  logger.info('Copying `.env`, `prisma/schema.prisma`, and `config.yml` to `build`...');
  if (!existsSync(join(process.cwd(), 'build'))) {
    logger.warn('Did you run this without running `yarn build`?');
    process.exit(1);
  }

  if (!isDocker() && existsSync(join(process.cwd(), 'config.yml')))
    await copyFile(join(process.cwd(), 'config.yml'), join(process.cwd(), 'build', 'config.yml'));

  // we explicitly ignore `.env` in Docker builds, so
  // if it's not in a Docker environment, let's move the .env file
  if (!isDocker() && existsSync(join(process.cwd(), '.env')))
    await copyFile(join(process.cwd(), '.env'), join(process.cwd(), 'build', '.env'));

  await copyFile(
    join(process.cwd(), 'prisma', 'schema.prisma'),
    join(process.cwd(), 'build', 'prisma', 'schema.prisma')
  );

  logger.info('Files should be copied over!');
})().catch((ex) => {
  logger.fatal(ex);
  process.exit(1);
});
