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

import type { ServerMiddleware } from '@nuxt/types';
import { registry, registerMetrics } from '~/metrics';
import { URL } from 'url';

// since Nuxt will import this, we can register the metrics here,
// and not when /metrics is hit.
registerMetrics();

const mod: ServerMiddleware = async (req, res) => {
  const parsedUrl = new URL(req.url!);
  if (parsedUrl.searchParams.has('format')) {
    const format = parsedUrl.searchParams.get('format')!;
    if (!['json', 'metrics'].includes(format)) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(
        JSON.stringify({
          message: '`?format` only accepts `json` or `metrics`',
        })
      );
    }

    switch (format) {
      case 'json': {
        const data = await registry.getMetricsAsJSON();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(data));
      }

      case 'metrics': {
        const data = await registry.metrics();
        res.writeHead(200, { 'Content-Type': registry.contentType });
        return res.end(data);
      }
    }
  } else {
    const data = await registry.metrics();
    res.writeHead(200, { 'Content-Type': registry.contentType });
    return res.end(data);
  }
};

export default mod;
