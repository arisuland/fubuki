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

import { Registry, collectDefaultMetrics, Counter, Gauge } from 'prom-client';

export const registry = new Registry();
export const requestHit = new Counter({
  name: 'arisu_requests_hit',
  help: 'How many requests all endpoints were hit.',
  registers: [registry],
  labelNames: ['endpoint', 'method'],
});

export const requestLatency = new Gauge({
  registers: [registry],
  name: 'arisu_request_latency',
  help: 'Returns the request latency of endpoints (excludes /_nuxt)',
  labelNames: ['endpoint', 'method'],
});

export const registerMetrics = () => {
  collectDefaultMetrics({
    register: registry,
    prefix: 'arisu_',
  });

  registry.registerMetric(requestHit);
  registry.registerMetric(requestLatency);
};
