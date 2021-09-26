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

import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

export const baseUrl =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV ? 'localhost:17093' : 'arisu.land';

export const protocol = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV ? 'https' : 'http';
export const wsProtocol = 'ws'; // TODO: use `wss` in prod?

const http = new HttpLink({
  uri: `${protocol}://${baseUrl}/graphql`,
});

const ws = new WebSocketLink({
  uri: `${wsProtocol}://${baseUrl}/graphql/subscriptions`,
  options: {
    reconnect: true,
    reconnectionAttempts: 10,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  ws,
  http
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
