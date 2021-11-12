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

import { collectDefaultMetrics, register, Gauge } from 'prom-client';
import type { NextApiHandler } from 'next';

collectDefaultMetrics({ prefix: 'fubuki_' });

export const nextHydration = new Gauge({
  name: 'nextjs_hydration',
  help: 'How long until Next.js hydrates any page.',
});

export const nextRenderTime = new Gauge({
  name: 'nextjs_render_time',
  help: 'Returns how long Next.js renders a route change.',
});

export const webVitals = {
  // First Contentful Paint
  FCP: new Gauge({
    name: 'web_vital_fcp',
    help: 'Timestamp of when the browser first renders any text, images (backgrounds, SVGs, etc), iframes, webfonts, etc.',
  }),

  // Time to First Byte
  TTFB: new Gauge({
    name: 'web_vital_ttfb',
    help: 'Time between the browser requests a page and receives its first byte from the server. This includes DNS lookups and establishing the TCP connection and SSL handshake if requested over HTTPS.',
  }),

  // Largest Contenful Paint
  LCP: new Gauge({
    name: 'web_vital_lcp',
    help: 'Render-time of the largest image or text-block visible visible within the viewport, relative to when the page first started loading.',
  }),

  // First Input Delay
  FID: new Gauge({
    name: 'web_vital_fid',
    help: 'Time reported from when a user first interacts with a page (includes clicking links, tapping buttons, etc) to the time the browser is able to process event handlers in response of that interaction.',
  }),

  // Cumulative Layout Shift
  CLS: new Gauge({
    name: 'web_vital_cls',
    help: 'Measurement of the largest burst of layout shift scores for every unexpected layout shift that occurs.',
  }),
};

const hasOwnProp = <T extends {}, K extends keyof T = keyof T>(obj: T, prop: K): obj is T & Record<K, T[K]> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

const handler: NextApiHandler = async (req, res) => {
  const format = hasOwnProp(req.query, 'format') ? req.query.format : undefined;
  if (Array.isArray(format))
    return res.status(400).send({ message: 'You cannot specify multiple `?format` query params.' });

  const key =
    format !== undefined
      ? format === 'metrics'
        ? 'metrics'
        : format === 'json'
        ? 'getMetricsAsJSON'
        : 'metrics'
      : 'metrics';

  const data = await register[key]();
  return res
    .status(200)
    .setHeader('Content-Type', format === 'json' ? 'application/json; charset=utf-8' : register.contentType)
    .send(data);
};

export default handler;
