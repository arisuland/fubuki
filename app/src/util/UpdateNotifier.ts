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

import currentPackage from '@/package.json';
import { execSync } from 'child_process';
import * as leeks from 'leeks.js';
import isDocker from 'is-docker';
import boxen from 'boxen';
import http from '~/core/singletons/http';

/**
 * Returns the update notification box once Arisu has been launched.
 * Depending if you're running from Git or Docker, it'll notify you to update
 * if there is any releases.
 *
 * You can disable the notification with `IGNORE_UPDATE_NOTIF` environment
 * variable.
 */
export default async () => {
  if (process.env.IGNORE_UPDATE_NOTIF === '1') return;

  // Get version from git repository
  const packageJson = await http
    .request({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/auguwu/Arisu/master/app/package.json',
      headers: {
        Accept: 'application/json',
      },
    })
    .then((res) => res.json<typeof currentPackage>());

  if (currentPackage.version === packageJson.version) return;

  const branch = execSync('git branch', { encoding: 'utf-8' }).trim().slice(2);
  const notifier = boxen(
    `
    👀 ${leeks.colors.gray('A update is available, if you wish to update, run the following:')}
    🔥 ${leeks.colors.yellow(`v${currentPackage.version}`)} -> ${leeks.colors.green(`v${packageJson.version}`)}

    ${
      isDocker()
        ? `
      > ${leeks.styles.dim('$')} docker pull arisuland/arisu:latest
      > ${leeks.styles.dim(
        '$'
      )} docker run -d -p <port>:17903 --restart always --name arisu-backend -e NODE_ENV=production \\
        -v <path to config.yml>:/app/arisu/backend/config.yml
    `
        : `
      > ${leeks.styles.dim('$')} git pull origin ${branch}

      # ${leeks.styles.bold('If running on PM2')}
      > ${leeks.styles.dim('$')} pm2 restart <app id>

      # ${leeks.styles.bold('If running on systemd')}
      > ${leeks.styles.dim('$')} [sudo] systemctl restart arisu.service

      # ${leeks.styles.bold('If running from `node` (your files will persist anyway)')}
      > cd app && yarn build && yarn start
    `
    }
  `,
    {
      borderStyle: 'single',
      borderColor: 'green',
      title: '~ Update ~',
      titleAlignment: 'center',
      padding: 1,
    }
  );

  console.log(notifier);
};
