/*
 * ☔ Arisu: Translation made with simplicity, yet robust.
 * Copyright (C) 2020-2022 Noelware
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

import { faCalendar, faCloudMoonRain, faBookOpen, faBook, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTwitter, faGithub, faDocker } from '@fortawesome/free-brands-svg-icons';
import * as core from '@fortawesome/fontawesome-svg-core';

core.library.add(
  // Solid
  faCalendar,
  faCloudMoonRain,
  faBookOpen,
  faBook,
  faTimes,
  faBars,

  // Brands
  faDiscord,
  faTwitter,
  faGithub,
  faDocker
);
